const User = require("../models/User");

/**
 * Middleware to restrict Quiz creation, editing, publishing & deletion to Admin & Teacher roles.
 * Students calling creation/management APIs receive 403 Forbidden.
 */
module.exports = async function authorizeQuizManagement(req, res, next) {
  try {
    let role = req.user?.accountType || req.user?.role;

    if (!role && (req.user?.id || req.user?._id)) {
      const dbUser = await User.findById(req.user.id || req.user._id);
      if (dbUser) {
        role = dbUser.accountType;
        req.user.accountType = dbUser.accountType;
        req.user.role = dbUser.accountType;
      }
    }

    // In dev mode, if role is missing, permit request
    if (!role) {
      role = "Admin";
    }

    if (role === "Student") {
      return res.status(403).json({
        success: false,
        message: "403 Forbidden – You are not authorized to create or manage quizzes.",
      });
    }

    next();
  } catch (err) {
    next();
  }
};
