const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/Auth");
const {
  getDashboardOverview,
  getLoginAnalytics,
  terminateSession,
  logDailyActivity,
  recoverStreak,
  getStudentAnalytics,
  getResumeProfile,
  updateResumeProfile,
  getNotifications,
  markNotificationRead,
  getPreferences,
  updatePreferences,
} = require("../controllers/Student");

// All routes require authentication
router.use(auth);

// Student Overview & Stats
router.get("/dashboard/overview", getDashboardOverview);

// Session & Security Analytics
router.get("/security/sessions", getLoginAnalytics);
router.delete("/security/sessions/:sessionId", terminateSession);

// Streak Engine & Activity Logging
router.post("/streak/log", logDailyActivity);
router.post("/streak/recover", recoverStreak);

// Student Analytics & Skill Matrix
router.get("/analytics", getStudentAnalytics);

// Resume & Career Placement Showcase
router.get("/resume", getResumeProfile);
router.put("/resume", updateResumeProfile);

// Notifications
router.get("/notifications", getNotifications);
router.patch("/notifications/:notifId/read", markNotificationRead);

// Preferences & Customization
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

module.exports = router;
