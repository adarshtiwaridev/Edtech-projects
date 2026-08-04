const User = require("../models/User");
const Otp = require("../models/Otp");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const dns = require("dns");
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch (e) {}

exports.sendOtpService = async (emailInput) => {
  const email = emailInput ? emailInput.trim().toLowerCase() : "";
  const otp = crypto.randomInt(100000, 999999).toString();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME || "Kodemates Educations"}" <${process.env.FROM_EMAIL || process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5; text-align: center;">Kodemates Verification</h2>
        <p>Hello,</p>
        <p>Your verification code for signup is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4F46E5; background-color: #EEF2FF; padding: 10px 20px; border-radius: 6px;">${otp}</span>
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const mailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timeout. Please check your SMTP settings.")), 15000)
    );
    await Promise.race([mailPromise, timeoutPromise]);
    console.log(`✅ OTP Email sent successfully to ${email}`);
  } catch (emailErr) {
    console.error("⚠️ Nodemailer failed to send email:", emailErr.message);
    console.log(`🔑 DEV MODE OTP for ${email}: ${otp}`);
  }

  // Always save OTP to DB so user registration can proceed
  await Otp.create({ email, otp });
  return true;
};

exports.signupService = async (data) => {
  const { firstName, lastName, email: rawEmail, mobile, password, accountType, otp } = data;
  const email = rawEmail ? rawEmail.trim().toLowerCase() : "";

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists.");

  const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
  if (!recentOtp) throw new Error("OTP not found.");

  const OTP_EXPIRY_TIME = 5 * 60 * 1000;
  if (Date.now() - recentOtp.createdAt.getTime() > OTP_EXPIRY_TIME) {
    throw new Error("OTP expired.");
  }

  if (Number(otp) !== Number(recentOtp.otp)) {
    throw new Error("Invalid OTP.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const profileDetails = await Profile.create({
    gender: "Not Specified",
    dateOfBirth: null,
    address: "",
    contactNumber: mobile,
  });

  const user = await User.create({
    firstName,
    lastName,
    email,
    mobile,
    password: hashedPassword,
    accountType,
    status: accountType === "Teacher" ? "Pending" : "Approved",
    additionalDetails: profileDetails._id,
  });

  await Otp.deleteMany({ email });

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

exports.loginService = async (email, password) => {
  const emailClean = email.trim().toLowerCase();
  const user = await User.findOne({ email: emailClean })
    .populate("additionalDetails")
    .populate("courseprogress")
    .populate("courses");

  if (!user) throw new Error("User not registered.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Incorrect password.");

  const payload = { email: user.email, id: user._id, role: user.accountType, status: user.status };
  
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  user.token = refreshToken;
  await user.save();

  const userResponse = { ...user.toObject() };
  delete userResponse.password;

  return { user: userResponse, accessToken, refreshToken };
};

exports.changePasswordService = async (email, oldPassword, newPassword) => {
  const existUser = await User.findOne({ email });
  if (!existUser) throw new Error("User not found.");

  const isPasswordValid = await bcrypt.compare(oldPassword, existUser.password);
  if (!isPasswordValid) throw new Error("Incorrect old password");

  existUser.password = await bcrypt.hash(newPassword, 10);
  await existUser.save();
  return true;
};

exports.verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.isVerified) throw new Error("User already verified");
  if (user.otp !== otp) throw new Error("Invalid OTP");
  if (user.otpExpires && user.otpExpires < Date.now()) throw new Error("OTP expired. Please resend OTP");

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return true;
};

exports.resetPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
  // TODO: Send Email properly in production
  
  return resetToken;
};

exports.deleteAccountService = async (email) => {
  const user = await User.findOneAndDelete({ email });
  if (!user) throw new Error("User not found");
  
  if (user.additionalDetails) {
    await Profile.findByIdAndDelete(user.additionalDetails);
  }
  return true;
};

exports.refreshTokenService = async (refreshToken) => {
  if (!refreshToken) throw new Error("No refresh token provided.");
  
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user || user.token !== refreshToken) {
    throw new Error("Invalid refresh token.");
  }
  
  const payload = { email: user.email, id: user._id, role: user.accountType, status: user.status };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  
  return accessToken;
};
