const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.auth = (req, res, next) => {
  try {
    let token = null;

    // 1. Priority: Authorization header
    if (req.header("Authorization")) {
      const parts = req.header("Authorization").split(" ");
      if (parts[0] === "Bearer" && parts[1]) {
        token = parts[1];
      }
    }

    // 2. Fallback: body or cookies
    if (!token) token = req.body.token || req.cookies.token;

    // If no token
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id || decoded.userId;
    const userRole = decoded.role || decoded.accountType || "Student";

    req.user = {
      ...decoded,
      id: userId,
      _id: userId,
      role: userRole,
      accountType: userRole,
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ------------------ ROLE CHECKERS ------------------
exports.student = (req, res, next) => {
  const role = req.user?.role || req.user?.accountType;
  if (role !== "Student" && role !== "Admin") {
    return res.status(403).json({ success: false, message: "Student only route" });
  }
  next();
};

exports.instructor = async (req, res, next) => {
  try {
    const role = req.user?.role || req.user?.accountType;
    if (role !== "Teacher" && role !== "Instructor" && role !== "Admin") {
      return res.status(403).json({ success: false, message: "Instructor only route" });
    }

    // Admins always have full permissions
    if (role === "Admin") {
      return next();
    }

    const userId = req.user?.id || req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ success: false, message: "Invalid user credentials" });
    }

    // Fetch live user from DB to prevent token staleness
    const User = require("../models/User");
    const dbUser = await User.findById(userId);
    if (!dbUser) {
      return res.status(404).json({ success: false, message: "User record not found" });
    }

    const status = dbUser.status || "Approved";

    if (status === "Pending") {
      // Auto-approve instructor status for seamless course creation
      dbUser.status = "Approved";
      await dbUser.save();
      return next();
    }
    if (status === "Rejected") {
      return res.status(403).json({ success: false, message: "Your instructor account was rejected by an admin." });
    }
    if (status === "Suspended") {
      return res.status(403).json({ success: false, message: "Your instructor account is suspended." });
    }

    next();
  } catch (error) {
    console.error("Instructor authorization error:", error);
    return res.status(500).json({ success: false, message: "Error verifying instructor authorization", error: error.message });
  }
};

exports.admin = (req, res, next) => {
  const role = req.user?.role || req.user?.accountType;
  if (role !== "Admin") {
    return res.status(403).json({ success: false, message: "Admin only route" });
  }
  next();
};