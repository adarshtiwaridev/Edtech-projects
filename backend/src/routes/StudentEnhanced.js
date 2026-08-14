const express = require("express");
const router = express.Router();

const { auth, instructor } = require("../middleware/Auth");
const {
  generateCertificate,
  verifyCertificate,
  getUserCertificates,
  downloadCertificatePdf,
} = require("../controllers/Certificate");
const { executeCode } = require("../controllers/CodeRunner");
const {
  createQuestion,
  getCourseQuestions,
  addAnswer,
  upvoteQuestion,
} = require("../controllers/Discussion");
const { getInstructorAnalytics } = require("../controllers/InstructorAnalytics");

// Certificates Routes
router.post("/certificates/generate", auth, generateCertificate);
router.get("/certificates/verify/:verificationId", verifyCertificate); // Public route
router.get("/certificates/download/:verificationId", downloadCertificatePdf); // Public PDF download route
router.get("/certificates/my-certificates", auth, getUserCertificates);

// Online Code Runner Route
router.post("/code/execute", auth, executeCode);

// Community Discussion Forum Routes
router.post("/discussion/questions", auth, createQuestion);
router.get("/discussion/course/:courseId", auth, getCourseQuestions);
router.post("/discussion/questions/:questionId/answers", auth, addAnswer);
router.patch("/discussion/questions/:questionId/upvote", auth, upvoteQuestion);

// Instructor Analytics Route
router.get("/instructor/analytics", auth, instructor, getInstructorAnalytics);

module.exports = router;
