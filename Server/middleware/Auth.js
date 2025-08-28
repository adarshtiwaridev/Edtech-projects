const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};


// ------------------ ROLE CHECKERS ------------------
exports.student = (req, res, next) => {
  if (req.user.role !== "Student") {
    return res.status(403).json({ success: false, message: "Student only route" });
  }
  next();
};

exports.instructor = (req, res, next) => {
  if (req.user.role !== "Instructor") {
    return res.status(403).json({ success: false, message: "Instructor only route" });
  }
  next();
};

exports.admin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ success: false, message: "Admin only route" });
  }
  next();
};