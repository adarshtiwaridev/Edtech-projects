const User = require("../models/User");
const Otp = require("../models/Otp");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.sendOtpService = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 10000,
  });

  const mailOptions = {
    from: `"EdTech Platform" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif;">
        <h2>Your OTP Code</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  const mailPromise = transporter.sendMail(mailOptions);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Email sending timeout")), 10000)
  );

  await Promise.race([mailPromise, timeoutPromise]);
  await Otp.create({ email, otp });

  return true;
};

exports.signupService = async (data) => {
  const { firstName, lastName, email, mobile, password, accountType, otp } = data;

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
