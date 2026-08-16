/**
 * Security Middleware to prevent IDOR (Insecure Direct Object Reference).
 * Ensures that non-admin users can only access or modify their own data.
 */
const verifyResourceOwnership = (paramName = "userId") => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role || req.user?.accountType;

      // Admins are authorized to view or manage resources across users
      if (userRole === "Admin") {
        return next();
      }

      const targetUserId =
        req.params[paramName] ||
        req.body[paramName] ||
        req.query[paramName];

      const authenticatedUserId = req.user?.id || req.user?._id;

      if (!targetUserId) {
        return next();
      }

      if (String(targetUserId) !== String(authenticatedUserId)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied: You do not have permission to access or modify this resource.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error verifying resource ownership",
        error: error.message,
      });
    }
  };
};

module.exports = {
  verifyResourceOwnership,
};
