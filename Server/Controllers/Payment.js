const { instance } = require("../config/razorpay");
const course = require("../Models/Course");
const user = require("../Models/User");
const mailSender = require("../utlis/Sendemails");
const { courseEnrollmentEmail } = require("../mail/CourseEnrollment");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

// capture payment and initiate order
exports.capturePayment = async (req, res) => {
  try {
    // get courseId and userId
    const { courseId } = req.body;
    const userId = req.user.id;

    // validate input
    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "courseId and userId are required",
      });
    }

    // fetch course and user details
    const courseDetails = await course.findById(courseId);
    const userDetails = await user.findById(userId);

    // validate existence
    if (!courseDetails || !userDetails) {
      return res.status(404).json({
        success: false,
        message: "Course or user not found",
      });
    }

    // check if user already enrolled
    const uid = new mongoose.Types.ObjectId(userId);
    if (courseDetails.studentsEnrolled.includes(uid)) {
      return res.status(409).json({
        success: false,
        message: "User already enrolled in the course",
      });
    }

    // create order on razorpay
    const amount = courseDetails.price;
    const currency = "INR";
    const options = {
      amount: amount * 100, // amount in paisa
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

    // hashed secret
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    // compare the signature
    if (signature === digest) {
      console.log("✅ Payment is Authorised");

      const { courseId, userId } = req.body.payload.payment.entity.notes;

      // enroll user into course
      const enrolledCourse = await course.findByIdAndUpdate(
        courseId,
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found for enrollment",
        });
      }

      await user.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );

      // send enrollment email
      const enrolledUser = await user.findById(userId);
      await mailSender(
        enrolledUser.email,
        `Successfully enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledUser.firstName} ${enrolledUser.lastName}`
        )
      );

      return res.status(200).json({
        success: true,
        message: "Signature verified & Course enrollment successful",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Error in verifySignature:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying payment signature",
      error: error.message,
    });
  }
};
