// controllers/Auth.js

const User = require("../Models/User");
const Otp = require("../Models/Otp");
const Profiler = require("../Models/Profiler"); // Ensure your Profiler model is correctly imported
const otpGenerator = require("otp-generator"); // This import is not used if customAlphabet is preferred
const { customAlphabet } = require("nanoid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

    // Generate OTP using nanoid
    const generateOTP = customAlphabet("1234567890", 6);
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    // Save OTP in DB
    const otpPayload = { email, otp };
    const otpBody = await Otp.create(otpPayload);
    console.log("Otp saved:", otpBody);

    // Return response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      // In production, DO NOT send the OTP in the response for security reasons!
      // This is included for development/debugging purposes only.
      otp,
    });
  } catch (error) {
    console.error("Error sending OTP:", error); // Use console.error for errors
    return res.status(500).json({ // Use 500 for server errors
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }
};

// signup concept
exports.Signup = async (req, res) => {
  try {
    // Data fetch from body
    const {
      firstName,
      lastname,
      email,
      mobile,
      password,
      confirmPassword,
      accountType, // Ensure accountType is handled or set a default if not provided
      otp,
    } = req.body;

    // Validate inputs
    if (
      !firstName ||
      !lastname ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All inputs are required.",
      });
    }

    // Passwords match
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Password and Confirm Password do not match. Please try again.",
      });
    }

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login instead.",
      });
    }

    // Find most recent OTP for the given email
    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 }).limit(1);

    // Validate OTP
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please send a new OTP.",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Optional: Add OTP expiry check (e.g., OTP valid for 5 minutes)
    // const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    // if (recentOtp.createdAt < fiveMinutesAgo) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP has expired. Please send a new OTP.",
    //   });
    // }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Profile details creation
    // Ensure Profiler model is correctly defined and available
    const profileDetails = await Profiler.create({
      gender: null,
      dateOfBirth: null,
      address: null,
      contactNumber: null,
    });

    // Create entry in user database
    const user = await User.create({
      firstName,
      lastname,
      email,
      mobile,
      password: hashedPassword,
      accountType: accountType, // Assign accountType from request body
      additionaldetails: profileDetails._id,
      image: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${firstName} ${lastname}`, // More dynamic avatar
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    console.error("Error during signup:", error); // Use console.error for errors
    return res.status(500).json({
      success: false,
      message: "Signup failed. Please try again.",
    });
  }
};

// Login concept
exports.Login = async (req, res) => {
  try {
    // Get data from req body
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required. Please try again.",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({ // Use 404 for not found
        success: false,
        message: "User is not registered. Please sign up first.",
      });
    }

    // Compare password and generate JWT
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id, // Use user._id for Mongoose document ID
        accountType: user.accountType, // Use accountType from the user object
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h", // Increased expiration for convenience
      });

      // Set cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure flag in production
        sameSite: 'Lax', // Recommended for CSRF protection
      };

      // Do not modify the 'user' object directly for response, create a new object if needed
      // or selectively send properties.
      const userResponse = { ...user.toObject() }; // Convert Mongoose document to plain object
      delete userResponse.password; // Remove password from the response object

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged in successfully!",
        user: userResponse, // Send the cleaned user object
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }
  } catch (error) {
    console.error("Error during login:", error); // Use console.error for errors
    return res.status(500).json({ // Use 500 for server errors
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// change password 
exports.changedpassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Validations
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All inputs are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password & confirm password should be the same",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password & old password should not be the same",
      });
    }

    // Check if user exists
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, existUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect old password. Please try again.",
      });
    }

    // Hash new password & update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existUser.password = hashedPassword;
    await existUser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while changing the password. Please try again.",
    });
  }
};
