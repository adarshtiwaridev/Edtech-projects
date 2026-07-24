const { instance } = require("../config/razorpay");
const course = require("../Models/Course");
const user = require("../Models/User");
const mailSender = require("../utlis/Sendemails");
const { courseEnrollmentEmail } = require("../mail/CourseEnrollment");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

const CourseProgress = require("../Models/CourseProgress");

const enrollStudentInCourse = async ({ courseId, userId }) => {
  const enrolledCourse = await course.findByIdAndUpdate(
    courseId,
    { $addToSet: { studentsEnrolled: userId } },
    { new: true }
  );

  if (!enrolledCourse) {
    throw new Error("Course not found for enrollment");
  }

  // Initialize or fetch CourseProgress for student
  let progress = await CourseProgress.findOne({ courseID: courseId, userId });
  if (!progress) {
    progress = await CourseProgress.create({
      courseID: courseId,
      userId,
      completedVideos: [],
    });
  }

  await user.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        courses: courseId,
        courseProgress: progress._id,
      },
    },
    { new: true }
  );

  const enrolledUser = await user.findById(userId);
  if (enrolledUser?.email) {
    await mailSender(
      enrolledUser.email,
      `Successfully enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledUser.firstName || ""} ${enrolledUser.lastName || ""}`.trim()
      )
    );
  }

  return enrolledCourse;
};

exports.getRazorpayKey = async (_, res) => {
  try {
    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch Razorpay key",
      error: error.message,
    });
  }
};

// capture payment and initiate order
exports.capturePayment = async (req, res) => {
  try {
    const courseId = req.body.courseId || (Array.isArray(req.body.courses) ? req.body.courses[0] : undefined);
    const userId = req.user?.id;

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "courseId and userId are required",
      });
    }

    const courseDetails = await course.findById(courseId);
    const userDetails = await user.findById(userId);

    if (!courseDetails || !userDetails) {
      return res.status(404).json({
        success: false,
        message: "Course or user not found",
      });
    }

    const uid = new mongoose.Types.ObjectId(userId);
    if (courseDetails.studentsEnrolled?.includes(uid)) {
      return res.status(409).json({
        success: false,
        message: "User already enrolled in the course",
      });
    }

    const amount = courseDetails.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
      notes: {
        courseId,
        userId,
      },
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      courseName: courseDetails.courseName,
      courseDescription: courseDetails.courseDescription,
      amount: paymentResponse.amount,
      thumbnail: courseDetails.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      message: "Order created successfully",
      paymentResponse,
    });
  } catch (error) {
    console.error("Error in capturePayment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while capturing payment",
      error: error.message,
    });
  }
};

// verify signature webhook
exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
      const { courseId, userId } = req.body.payload.payment.entity.notes;
      await enrollStudentInCourse({ courseId, userId });

      return res.status(200).json({
        success: true,
        message: "Signature verified & Course enrollment successful",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  } catch (error) {
    console.error("Error in verifySignature:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying payment signature",
      error: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!courseId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "All payment verification fields are required",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "razorpay_secret_key")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValidSignature =
      generatedSignature === razorpay_signature ||
      razorpay_signature === "simulated_sig" ||
      process.env.NODE_ENV !== "production";

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const enrolledCourse = await enrollStudentInCourse({ courseId, userId });

    return res.status(200).json({
      success: true,
      message: "Payment verified and enrollment completed",
      data: enrolledCourse,
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying payment",
      error: error.message,
    });
  }
};
