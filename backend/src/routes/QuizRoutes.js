const express = require("express");
const router = express.Router({ caseSensitive: false, strict: false });
const { auth } = require("../middleware/Auth");
const authorizeQuizManagement = require("../middleware/authorizeQuizManagement");
const {
  uploadAndExtractPdfQuiz,
  createQuiz,
  getAllQuizzes,
  getQuizDetails,
  startQuizAttempt,
  saveAttemptProgress,
  submitQuizAttempt,
  getAttemptResult,
  getStudentQuizDashboardStats,
  getTeacherQuizRecords,
  togglePublishQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizAnalyticsDetail,
  getQuizLeaderboard,
} = require("../controllers/QuizController");

// ==========================================
// 1. STATIC ADMIN / TEACHER CREATION & MANAGEMENT ROUTES
// ==========================================
router.post("/createQuiz", auth, authorizeQuizManagement, createQuiz);
router.post("/create-quiz", auth, authorizeQuizManagement, createQuiz);
router.post("/create", auth, authorizeQuizManagement, createQuiz);
router.post("/", auth, authorizeQuizManagement, createQuiz);

router.post("/pdf-extract", auth, authorizeQuizManagement, uploadAndExtractPdfQuiz);
router.post("/extract", auth, authorizeQuizManagement, uploadAndExtractPdfQuiz);

router.get("/records", auth, authorizeQuizManagement, getTeacherQuizRecords);

// ==========================================
// 2. STATIC STUDENT & PUBLIC LIST ROUTES
// ==========================================
router.get("/student/stats", auth, getStudentQuizDashboardStats);
router.get("/all", auth, getAllQuizzes);
router.get("/", auth, getAllQuizzes);

// ==========================================
// 3. STUDENT TIMED ATTEMPT PROGRESS ROUTES
// ==========================================
router.put("/attempt/:attemptId/save", auth, saveAttemptProgress);
router.post("/attempt/:attemptId/submit", auth, submitQuizAttempt);
router.get("/attempt/:attemptId/result", auth, getAttemptResult);

// ==========================================
// 4. PARAMETERIZED QUIZ ROUTES (/:quizId)
// ==========================================
router.get("/:quizId", auth, getQuizDetails);
router.post("/:quizId/start", auth, startQuizAttempt);
router.patch("/:quizId/publish", auth, authorizeQuizManagement, togglePublishQuiz);
router.put("/:quizId", auth, authorizeQuizManagement, updateQuiz);
router.delete("/:quizId", auth, authorizeQuizManagement, deleteQuiz);
router.get("/:quizId/analytics", auth, authorizeQuizManagement, getQuizAnalyticsDetail);
router.get("/:quizId/leaderboard", auth, getQuizLeaderboard);

module.exports = router;
