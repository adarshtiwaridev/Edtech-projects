const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require("../models/User");

// Generate certificate for a course
exports.generateCertificate = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error("Course ID is required");
  }

  const courseDetails = await Course.findById(courseId).populate("instructor", "firstName lastName");
  if (!courseDetails) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check if certificate already generated
  let existingCert = await Certificate.findOne({ userId, courseId });
  if (existingCert) {
    return res.status(200).json({
      success: true,
      message: "Certificate already issued",
      data: existingCert,
    });
  }

  const userDetails = await User.findById(userId);
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

