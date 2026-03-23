// controllers/Auth.js

const User = require("../Models/User");
const Otp = require("../Models/Otp");
const Profile = require("../Models/Profile"); // FIX: was Profiler

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("📩 OTP request for:", email);

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // TODO: Save OTP to DB with expiry (recommended)
    console.log("Generated OTP:", otp);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000, // 10 sec safety
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

    // Timeout protection
    const mailPromise = transporter.sendMail(mailOptions);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timeout")), 10000)
    );

    await Promise.race([mailPromise, timeoutPromise]);

      // Save OTP to DB (optional but recommended)
      console.log("Saving OTP to DB for:", email);
    await Otp.create({ email, otp });
    console.log("OTP saved to DB for:", email);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } 
  catch (error) {
    console.error("❌ OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
};



// ==========================
// SIGNUP CONTROLLER
// ==========================
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

    if (!firstName || !lastName || !email || !mobile || !password || !confirmPassword || !accountType || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found.",
      });
    }

    const OTP_EXPIRY_TIME = 5 * 60 * 1000;

    if (Date.now() - recentOtp.createdAt.getTime() > OTP_EXPIRY_TIME) {
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    if (Number(otp) !== Number(recentOtp.otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create profile
    const profileDetails = await Profile.create({
      gender: "Not Specified",
      dateOfBirth: null,
      address: "",
      contactNumber: mobile,
    });

    // 👤 Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
    });

    await Otp.deleteMany({ email });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: userResponse,
    });

  } catch (error) {
    console.error("Error during signup:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({ success: false, message: "All fields are required." });
    }
    // const allusers = await User.find();
    // console.log("All users:", allusers);
   const emailClean = email.trim().toLowerCase();

const user = await User.findOne({ email: emailClean }).populate("additionalDetails").populate("courseprogress").populate("courses");

if (!user) {
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
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ success: false, message: "Logout failed." });
  }
}

// ------------------ VERIFY OTP ------------------

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Already verified check
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    // 4️⃣ OTP match
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 5️⃣ OTP expiry check
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please resend OTP",
      });
    }

    // 6️⃣ Mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // TODO: implement sendEmail properly
    console.log("Reset Token:", resetToken);

    return res.status(200).json({
      success: true,
      message: "Password reset link generated",
      resetToken,
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};

// delete account
exports.deleteAccount = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
 console.log("Delete account request with token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const email = decoded.email;

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete profile if exists
    if (user.additionaldetails) {
      await Profile.findByIdAndDelete(user.additionaldetails);
    }
  
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("Delete Account Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during account deletion",
    });
  }
};

// admin delete account
exports.deleteAccountByAdmin = async (req, res) => {
  try {     

    const { email } = req.body;
     console.log("Delete account request for:", email);
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Also delete associated profile
    await Profile.findByIdAndDelete(user.additionaldetails);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during account deletion",
    });
  }
};












exports.deleteAccountByAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Also delete associated profile
    await Profile.findByIdAndDelete(user.additionaldetails);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully by admin",
    });
  } catch (error) {
    console.error("Admin Delete Account Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during account deletion by admin",
    });
  }
};