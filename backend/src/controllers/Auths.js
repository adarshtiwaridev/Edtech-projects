const asyncHandler = require("express-async-handler");
const authService = require("../services/AuthService");
const jwt = require("jsonwebtoken");

exports.sendotp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.sendOtpService(email);
  res.status(200).json({ success: true, message: "OTP sent successfully" });
});

exports.signup = asyncHandler(async (req, res) => {
  const user = await authService.signupService(req.body);
  res.status(201).json({ success: true, message: "User registered successfully!", user });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginService(email, password);

  // Record session details for analytics & security tracking
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || req.connection.remoteAddress || "127.0.0.1";
  const StudentService = require("../services/StudentService");
  
  const reqDetails = {
    ip,
    userAgent,
    browser: userAgent.includes("Chrome") ? "Chrome" : userAgent.includes("Firefox") ? "Firefox" : userAgent.includes("Safari") ? "Safari" : "Web Browser",
    os: userAgent.includes("Windows") ? "Windows" : userAgent.includes("Mac") ? "macOS" : userAgent.includes("Linux") ? "Linux" : "Android/iOS",
    deviceType: /mobile/i.test(userAgent) ? "Mobile" : "Desktop",
    location: "India (Local)",
  };

  await StudentService.recordLoginSession(user._id, reqDetails, refreshToken);
  
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
  
  res.cookie("token", refreshToken, options).status(200).json({
    success: true,
    message: "Logged in successfully!",
    user,
    token: accessToken,
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  await authService.changePasswordService(email, oldPassword, newPassword);
  res.status(200).json({ success: true, message: "Password changed successfully!" });
});

exports.logout = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  }).status(200).json({ success: true, message: "Logged out successfully" });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyOtpService(email, otp);
  res.status(200).json({ success: true, message: "OTP verified successfully" });
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401);
    throw new Error("Authorization token missing");
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await authService.deleteAccountService(decoded.email);
  res.status(200).json({ success: true, message: "Account deleted successfully" });
});

exports.deleteAccountByAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.deleteAccountService(email);
  res.status(200).json({ success: true, message: "Account deleted successfully by admin" });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401);
    throw new Error("No refresh token found in cookies.");
  }
  
  const accessToken = await authService.refreshTokenService(token);
  res.status(200).json({ success: true, token: accessToken });
});