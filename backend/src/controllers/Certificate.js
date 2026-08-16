const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const { emitToUser } = require("../sockets/socket");

// Generate certificate for a course after strict eligibility check
exports.generateCertificate = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error("Course ID is required");
  }

  const courseDetails = await Course.findById(courseId)
    .populate({
      path: "courseContent",
      populate: { path: "subsections" },
    })
    .populate("instructor", "firstName lastName");

  if (!courseDetails) {
    res.status(404);
    throw new Error("Course not found");
  }

  const userDetails = await User.findById(userId);
  if (!userDetails) {
    res.status(404);
    throw new Error("User record not found");
  }

  // 1. Verify enrollment
  const isEnrolled =
    (courseDetails.studentsEnrolled && courseDetails.studentsEnrolled.map(id => String(id)).includes(String(userId))) ||
    (userDetails.courses && userDetails.courses.map(id => String(id)).includes(String(courseId)));

  if (!isEnrolled) {
    res.status(403);
    throw new Error("You must be enrolled in this course to earn a certificate.");
  }

  // 2. Check if certificate already generated (Idempotency)
  let existingCert = await Certificate.findOne({ userId, courseId });
  if (existingCert) {
    return res.status(200).json({
      success: true,
      message: "Certificate already issued",
      data: existingCert,
    });
  }

  // 3. Verify 100% Subsection / Lesson Completion
  let totalSubsections = 0;
  if (courseDetails.courseContent) {
    courseDetails.courseContent.forEach((sec) => {
      totalSubsections += sec.subsections?.length || 0;
    });
  }

  const progress = await CourseProgress.findOne({ courseID: courseId, userId });
  const completedCount = progress?.completedVideos?.length || 0;

  if (totalSubsections > 0 && completedCount < totalSubsections) {
    res.status(400);
    throw new Error(
      `Course incomplete: You have completed ${completedCount} of ${totalSubsections} lessons (${Math.round((completedCount / totalSubsections) * 100)}%). Complete all lessons to claim certificate.`
    );
  }

  // 4. Verify Quiz Completion if Course has attached Quizzes
  const courseQuizzes = await Quiz.find({ courseId, isPublished: true });
  if (courseQuizzes.length > 0) {
    for (const q of courseQuizzes) {
      const passedAttempt = await QuizAttempt.findOne({
        quizId: q._id,
        studentId: userId,
        passed: true,
      });

      if (!passedAttempt) {
        res.status(400);
        throw new Error(
          `Assessment incomplete: You must pass the required course assessment '${q.title}' before claiming certificate.`
        );
      }
    }
  }

  const studentName = `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim() || userDetails.email;
  const instructorName = courseDetails.instructor
    ? `${courseDetails.instructor.firstName || ""} ${courseDetails.instructor.lastName || ""}`.trim()
    : "Kodemates Faculty";

  const verificationId = `KM-CERT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  const newCertificate = await Certificate.create({
    verificationId,
    userId,
    courseId,
    studentName,
    courseName: courseDetails.courseName,
    instructorName,
    grade: "Excellence & Distinction",
    issueDate: new Date(),
  });

  // Real-time socket notification
  emitToUser(userId, "certificate_issued", {
    certificateId: newCertificate._id,
    verificationId: newCertificate.verificationId,
    courseName: courseDetails.courseName,
  });

  res.status(201).json({
    success: true,
    message: "Certificate issued successfully! 🎉",
    data: newCertificate,
  });
});

// Public API to verify certificate by verificationId
exports.verifyCertificate = asyncHandler(async (req, res) => {
  const { verificationId } = req.params;

  const cert = await Certificate.findOne({ verificationId })
    .populate("userId", "firstName lastName profilePicture email")
    .populate("courseId", "courseName courseDescription thumbnail");

  if (!cert) {
    res.status(404);
    throw new Error("Invalid or unverified Certificate ID");
  }

  res.status(200).json({
    success: true,
    verified: true,
    message: "Certificate is official and verified by Kodemates Credentials Network",
    data: cert,
  });
});

// Get all certificates earned by logged in user
exports.getUserCertificates = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const certificates = await Certificate.find({ userId })
    .populate("courseId", "courseName thumbnail")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: certificates,
  });
});

// Stream or download certificate PDF binary by verificationId
exports.downloadCertificatePdf = asyncHandler(async (req, res) => {
  const { verificationId } = req.params;
  const { streamCertificatePdf } = require("../services/CertificatePdfService");

  const cert = await Certificate.findOne({ verificationId });
  if (!cert) {
    res.status(404);
    throw new Error("Certificate not found for the provided verification ID");
  }

  await streamCertificatePdf(cert, res);
});
