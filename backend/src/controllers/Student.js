const asyncHandler = require("express-async-handler");
const StudentService = require("../services/StudentService");

exports.getDashboardOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const overview = await StudentService.getOverview(userId);
  res.status(200).json({ success: true, data: overview });
});

exports.getLoginAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const analytics = await StudentService.getLoginAnalytics(userId);
  res.status(200).json({ success: true, data: analytics });
});

exports.terminateSession = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;
  await StudentService.terminateSession(userId, sessionId);
  res.status(200).json({ success: true, message: "Session terminated successfully" });
});

exports.logDailyActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { minutes, lecturesCount, quizzesCount } = req.body;
  const updatedStreak = await StudentService.logActivity(userId, {
    minutes: Number(minutes) || 25,
    lecturesCount: Number(lecturesCount) || 1,
    quizzesCount: Number(quizzesCount) || 0,
  });
  res.status(200).json({ success: true, data: updatedStreak, message: "Study activity logged!" });
});

exports.recoverStreak = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updatedStreak = await StudentService.recoverStreak(userId);
  res.status(200).json({ success: true, data: updatedStreak, message: "Streak recovered successfully! 🔥" });
});

exports.getStudentAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const analytics = await StudentService.getStudentAnalytics(userId);
  res.status(200).json({ success: true, data: analytics });
});

exports.getResumeProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const resumeData = await StudentService.getResumeProfile(userId);
  res.status(200).json({ success: true, data: resumeData });
});

exports.updateResumeProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updated = await StudentService.updateResumeProfile(userId, req.body);
  res.status(200).json({ success: true, data: updated, message: "Resume profile updated successfully!" });
});

exports.getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notifs = await StudentService.getNotifications(userId);
  res.status(200).json({ success: true, data: notifs });
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notifId } = req.params;
  await StudentService.markNotificationRead(userId, notifId);
  res.status(200).json({ success: true, message: "Notification marked as read" });
});

exports.getPreferences = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const prefs = await StudentService.getPreferences(userId);
  res.status(200).json({ success: true, data: prefs });
});

exports.updatePreferences = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updated = await StudentService.updatePreferences(userId, req.body);
  res.status(200).json({ success: true, data: updated, message: "Preferences updated!" });
});
