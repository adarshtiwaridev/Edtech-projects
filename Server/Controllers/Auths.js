// controllers/Auth.js
const User = require("../Models/User");
const Otp = require("../Models/Otp");
const Profile = require("../Models/Profile"); // FIX: was Profiler
const { customAlphabet } = require("nanoid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // check if user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

    // generate 6-digit OTP
    const generateOTP = customAlphabet("1234567890", 6);
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    // save OTP to DB
    const otpBody = await Otp.create({ email, otp });
    console.log("Otp saved:", otpBody);

    // ⚠️ in production, send OTP via email/SMS, don’t return in response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      otp, 
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // check password match
    if (password !== confirmPassword) {
      return res.status(403).json({ success: false, message: "Passwords do not match." });
    }

    // check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    // get the most recent OTP for this email
    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
    // console.log("Recent OTP found:", recentOtp);

    if (!recentOtp || otp !== recentOtp.otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create profile document
    const profileDetails = await Profile.create({
      gender: "Not Specified",
      dateOfBirth: null,
      address: "",
      contactNumber: "",
    });

    // create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      accountType,
      additionaldetails: profileDetails._id,
      // ⚠️ don't pass profilePicture here so default in schema applies
    });

    // remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ success: false, message: "Signup failed." });
  }
};


// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({ success: false, message: "All fields are required." });
    }
    const allusers = await User.find();
    console.log("All users:", allusers);
   const emailClean = email.trim().toLowerCase();

const user = await User.findOne({ email: emailClean }).populate("additionaldetails");

if (!user) {
  console.log("Email searched:", emailClean);
  console.log("Available users:", await User.find({}, "email")); // only show emails
  return res.status(404).json({ success: false, message: "User not registered." });
}


    if (await bcrypt.compare(password, user.password)) {
      const payload = { email: user.email, id: user._id, role: user.accountType };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

      const options = { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), httpOnly: true };

      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged in successfully!",
        user: userResponse,
        token,
      });
    } else {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
};


// ------------------ CHANGE PASSWORD ------------------
exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(403).json({ success: false, message: "All inputs are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, existUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Incorrect old password" });
    }

    existUser.password = await bcrypt.hash(newPassword, 10);
    await existUser.save();

    return res.status(200).json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ success: false, message: "Error changing password." });
  }
};
// ------------------ LOGOUT ------------------
