// models/Otp.js
const mongoose = require("mongoose");
const sendEmail = require("../utlis/Sendemails");
const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // document auto-deletes after 5 minutes
  },
}, { collection: "otps" });

async function sendemailverification(email, otp) {
  try {
    const title = "OTP Verification from Kodemates Education";
    const body = `Your OTP is <b>${otp}</b>. It will expire in 5 minutes.`;

    const mailResponse = await sendEmail(email, title, body);
    console.log("📩 Verification email sent successfully:", mailResponse);
    return mailResponse;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
OtpSchema.pre("save", async function (next) {
  await sendemailverification(this.email, this.otp);
  console.log("📧 OTP email sent for:", this.email)     ;
  next();
});
const Otp = mongoose.model("Otp", OtpSchema);
module.exports = Otp;
