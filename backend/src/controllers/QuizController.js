const asyncHandler = require("express-async-handler");
const Quiz = require("../models/Quiz");
const QuizQuestion = require("../models/QuizQuestion");
const QuizAttempt = require("../models/QuizAttempt");
const UploadedPdf = require("../models/UploadedPdf");
const { extractQuizFromPdfBuffer } = require("../services/PdfQuizExtractorService");
const { evaluateQuizSubmission } = require("../services/QuizEvaluationService");

// 1. Upload PDF & Extract Structured Quiz Questions
exports.uploadAndExtractPdfQuiz = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.pdfFile) {
    res.status(400);
    throw new Error("Please upload a PDF question paper file.");
  }

  const pdfFile = req.files.pdfFile;
  const buffer = pdfFile.data || require("fs").readFileSync(pdfFile.tempFilePath);

  const extractedData = await extractQuizFromPdfBuffer(buffer);

  await UploadedPdf.create({
    title: pdfFile.name,
    fileUrl: pdfFile.tempFilePath || "temp_pdf_storage",
    fileSize: pdfFile.size,
    uploadedBy: req.user.id,
    status: "processed",
    extractedQuestionCount: extractedData.questions.length,
  });

  res.status(200).json({
    success: true,
    message: `Extracted ${extractedData.questions.length} questions from PDF paper!`,
    data: extractedData,
  });
});

// 2. Create / Save Quiz with Questions (Super Admin / Teacher)
exports.createQuiz = asyncHandler(async (req, res) => {
  const mongoose = require("mongoose");
  const User = require("../models/User");

  let instructorId = req.user?.id || req.user?._id;

  if (!instructorId || !mongoose.Types.ObjectId.isValid(instructorId)) {
    const userObj = await User.findOne({ email: req.user?.email });
    if (userObj) {
      instructorId = userObj._id;
    } else {
      const adminObj = await User.findOne({ accountType: "Admin" });
      if (adminObj) {
        instructorId = adminObj._id;
      } else {
        const anyUser = await User.findOne();
        instructorId = anyUser?._id;
      }
    }
  }

  const {
    title,
    description,
    courseId,
    category,
    durationMinutes,
    passingMarks,
    negativeMarking,
    questions = [],
  } = req.body;

  if (!title || !title.trim()) {
    res.status(400);
    throw new Error("Quiz title is required.");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    res.status(400);
    throw new Error("At least one valid question is required to create a quiz.");
  }

  const newQuiz = await Quiz.create({
    title: title.trim(),
    description: description ? description.trim() : "",
    courseId: courseId || null,
    category: category || "General Assessment",
    instructor: instructorId,
    durationMinutes: Number(durationMinutes) || 30,
    passingMarks: Number(passingMarks) || 40,
    totalMarks: questions.reduce((sum, q) => sum + (Number(q.marks) || 10), 0),
    negativeMarking: negativeMarking || { enabled: false },
    isPublished: true,
  });

  const questionDocs = questions.map((q) => ({
    quizId: newQuiz._id,
    questionText: q.questionText || q.question || "Assessment Question",
    questionType: q.questionType || "mcq_single",
    options: Array.isArray(q.options) ? q.options : [],
    correctAnswer: q.correctAnswer !== undefined ? Number(q.correctAnswer) : (q.answer !== undefined ? Number(q.answer) : 0),
    explanation: q.explanation || "",
    marks: Number(q.marks) || 10,
    topic: q.topic || "General",
    difficulty: q.difficulty || "medium",
  }));

  await QuizQuestion.insertMany(questionDocs);

  res.status(201).json({
    success: true,
    message: "Quiz created & published successfully! 🚀",
    data: {
      quiz: newQuiz,
      questionCount: questionDocs.length,
    },
  });
});

// 3. Get All Published Quizzes
exports.getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ isPublished: true })
    .populate("instructor", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  const quizIds = quizzes.map((q) => q._id);
  const questions = await QuizQuestion.find({ quizId: { $in: quizIds } }).lean();

  const questionCountMap = new Map();
  questions.forEach((q) => {
    const key = q.quizId.toString();
    questionCountMap.set(key, (questionCountMap.get(key) || 0) + 1);
  });

  const quizzesWithCounts = quizzes.map((quiz) => ({
    ...quiz,
    totalQuestions: questionCountMap.get(quiz._id.toString()) || 0,
  }));

  res.status(200).json({
    success: true,
    count: quizzesWithCounts.length,
    data: quizzesWithCounts,
  });
});

// 4. Get Quiz Details & Questions
exports.getQuizDetails = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId).populate(
    "instructor",
    "firstName lastName"
  );
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const questions = await QuizQuestion.find({ quizId }).select("-correctAnswer");

  res.status(200).json({
    success: true,
    data: {
      quiz,
      questions,
    },
  });
});

// 5. Start Timed Quiz Attempt (Student)
exports.startQuizAttempt = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const existingAttempt = await QuizAttempt.findOne({
    quizId,
    studentId,
    status: { $in: ["completed", "auto_submitted"] },
  });

  if (existingAttempt) {
    return res.status(200).json({
      success: true,
      message: "You have already completed this assessment.",
      data: existingAttempt,
      alreadyCompleted: true,
    });
  }

  const newAttempt = await QuizAttempt.create({
    quizId,
    studentId,
    startTime: new Date(),
    status: "in_progress",
  });

  res.status(201).json({
    success: true,
    message: "Quiz attempt started",
    data: newAttempt,
  });
});

// 6. Save Attempt Progress / Anti-Cheat Warning
exports.saveAttemptProgress = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { answers, tabSwitchCount } = req.body;

  const attempt = await QuizAttempt.findById(attemptId);
  if (!attempt) {
    res.status(404);
    throw new Error("Attempt not found");
  }

  if (answers) attempt.answers = answers;
  if (tabSwitchCount !== undefined) attempt.tabSwitchCount = tabSwitchCount;

  await attempt.save();

  res.status(200).json({
    success: true,
    message: "Progress auto-saved",
  });
});

// 7. Submit Quiz & Auto-Evaluate Answers
exports.submitQuizAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { answers = [], tabSwitchCount = 0 } = req.body;

  const attempt = await QuizAttempt.findById(attemptId);
  if (!attempt) {
    res.status(404);
    throw new Error("Quiz attempt not found");
  }

  const quiz = await Quiz.findById(attempt.quizId);
  if (!quiz) {
    res.status(404);
    throw new Error("Associated quiz not found");
  }

  const evalResult = await evaluateQuizSubmission(quiz, answers);

  attempt.answers = evalResult.processedAnswers;
  attempt.totalScore = evalResult.totalScore;
  attempt.percentage = evalResult.percentage;
  attempt.accuracy = evalResult.accuracy;
  attempt.passed = evalResult.passed;
  attempt.tabSwitchCount = tabSwitchCount;
  attempt.status = tabSwitchCount > 5 ? "disqualified" : "completed";
  attempt.submitTime = new Date();
  attempt.aiPerformanceReport = evalResult.aiPerformanceReport;

  await attempt.save();

  res.status(200).json({
    success: true,
    message: "Quiz submitted & evaluated successfully! 🎉",
    data: attempt,
  });
});

// 8. Get Attempt Result Details
exports.getAttemptResult = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const attempt = await QuizAttempt.findById(attemptId)
    .populate("quizId", "title category durationMinutes passingMarks totalMarks")
    .populate("studentId", "firstName lastName email");

  if (!attempt) {
    res.status(404);
    throw new Error("Quiz attempt not found");
  }

  res.status(200).json({
    success: true,
    data: attempt,
  });
});

// 9. Get Student Dashboard Quiz Statistics & Assigned List
exports.getStudentQuizDashboardStats = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const publishedQuizzes = await Quiz.find({ isPublished: true })
    .populate("instructor", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  const studentAttempts = await QuizAttempt.find({ studentId })
    .sort({ createdAt: -1 })
    .lean();

  const attemptMap = new Map();
  studentAttempts.forEach((att) => {
    if (!attemptMap.has(att.quizId.toString())) {
      attemptMap.set(att.quizId.toString(), att);
    }
  });

  let completedCount = 0;
  let totalScorePercentageSum = 0;
  let highestPercentage = 0;

  const assignedQuizzes = publishedQuizzes.map((quiz) => {
    const attempt = attemptMap.get(quiz._id.toString());
    const isCompleted = attempt && (attempt.status === "completed" || attempt.status === "auto_submitted");

    if (isCompleted) {
      completedCount += 1;
      const pct = attempt.percentage || 0;
      totalScorePercentageSum += pct;
      if (pct > highestPercentage) highestPercentage = pct;
    }

    return {
      ...quiz,
      status: isCompleted ? "Completed" : "Pending",
      isAttempted: Boolean(attempt),
      attemptId: attempt ? attempt._id : null,
      score: attempt ? attempt.totalScore : null,
      percentage: attempt ? attempt.percentage : null,
    };
  });

  const totalAssigned = publishedQuizzes.length;
  const pendingCount = Math.max(0, totalAssigned - completedCount);
  const averageScore = completedCount > 0 ? Math.round(totalScorePercentageSum / completedCount) : 0;

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalAssigned,
        completedQuizzes: completedCount,
        pendingQuizzes: pendingCount,
        averageScore,
        highestScore: highestPercentage,
      },
      assignedQuizzes,
      recentActivity: studentAttempts.slice(0, 5),
    },
  });
});

// 10. Get Teacher / Admin Quiz Records with Analytics Summary
exports.getTeacherQuizRecords = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role || req.user.accountType || "Student";

  const filter = role === "Admin" ? {} : { instructor: userId };

  const quizzes = await Quiz.find(filter)
    .populate("instructor", "firstName lastName email")
    .sort({ createdAt: -1 })
    .lean();

  const quizIds = quizzes.map((q) => q._id);
  const allAttempts = await QuizAttempt.find({
    quizId: { $in: quizIds },
    status: { $in: ["completed", "auto_submitted"] },
  }).lean();

  const attemptsByQuiz = new Map();
  allAttempts.forEach((att) => {
    const key = att.quizId.toString();
    if (!attemptsByQuiz.has(key)) attemptsByQuiz.set(key, []);
    attemptsByQuiz.get(key).push(att);
  });

  const quizRecords = quizzes.map((quiz) => {
    const attempts = attemptsByQuiz.get(quiz._id.toString()) || [];
    const totalAttempts = attempts.length;
    const passedAttempts = attempts.filter((a) => a.passed).length;
    const avgScorePct =
      totalAttempts > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts)
        : 0;
    const highestScorePct =
      totalAttempts > 0 ? Math.max(...attempts.map((a) => a.percentage || 0)) : 0;
    const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

    return {
      ...quiz,
      totalAttempts,
      averageScore: avgScorePct,
      highestScore: highestScorePct,
      passRate,
    };
  });

  res.status(200).json({
    success: true,
    data: quizRecords,
  });
});

// 11. Toggle Quiz Publish Status
exports.togglePublishQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  quiz.isPublished = !quiz.isPublished;
  await quiz.save();

  res.status(200).json({
    success: true,
    message: `Quiz is now ${quiz.isPublished ? "Published" : "Unpublished"}!`,
    data: quiz,
  });
});

// 12. Update Quiz Details & Questions
exports.updateQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { title, description, category, durationMinutes, passingMarks, questions } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  if (title) quiz.title = title;
  if (description !== undefined) quiz.description = description;
  if (category) quiz.category = category;
  if (durationMinutes) quiz.durationMinutes = durationMinutes;
  if (passingMarks) quiz.passingMarks = passingMarks;

  if (questions && Array.isArray(questions) && questions.length > 0) {
    await QuizQuestion.deleteMany({ quizId });

    const questionDocs = questions.map((q) => ({
      quizId: quiz._id,
      questionText: q.questionText || q.question,
      questionType: q.questionType || "mcq_single",
      options: q.options || [],
      correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : q.answer,
      explanation: q.explanation || "",
      marks: q.marks || 10,
      topic: q.topic || "General",
      difficulty: q.difficulty || "medium",
    }));

    await QuizQuestion.insertMany(questionDocs);
    quiz.totalMarks = questions.reduce((sum, q) => sum + (q.marks || 10), 0);
  }

  await quiz.save();

  res.status(200).json({
    success: true,
    message: "Quiz updated successfully! ✏️",
    data: quiz,
  });
});

// 13. Delete Quiz & Associated Questions
exports.deleteQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  await Quiz.findByIdAndDelete(quizId);
  await QuizQuestion.deleteMany({ quizId });

  res.status(200).json({
    success: true,
    message: "Quiz and associated questions deleted successfully.",
  });
});

// 14. Get Detailed Quiz Analytics & Student Attempts List for Instructors
exports.getQuizAnalyticsDetail = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId).populate("instructor", "firstName lastName email");
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  const questions = await QuizQuestion.find({ quizId });
  const attempts = await QuizAttempt.find({
    quizId,
    status: { $in: ["completed", "auto_submitted"] },
  })
    .populate("studentId", "firstName lastName email profilePicture")
    .sort({ submitTime: -1 });

  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((a) => a.passed).length;
  const failedAttempts = Math.max(0, totalAttempts - passedAttempts);

  const percentages = attempts.map((a) => a.percentage || 0);
  const avgScore = totalAttempts > 0 ? Math.round(percentages.reduce((a, b) => a + b, 0) / totalAttempts) : 0;
  const highestScore = totalAttempts > 0 ? Math.max(...percentages) : 0;
  const lowestScore = totalAttempts > 0 ? Math.min(...percentages) : 0;
  const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      quiz,
      questionsCount: questions.length,
      overview: {
        totalAttempts,
        passedAttempts,
        failedAttempts,
        avgScore,
        highestScore,
        lowestScore,
        passRate,
      },
      studentAttempts: attempts,
    },
  });
});

// 15. Get Quiz Leaderboard
exports.getQuizLeaderboard = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const leaderboard = await QuizAttempt.find({
    quizId,
    status: { $in: ["completed", "auto_submitted"] },
  })
    .populate("studentId", "firstName lastName profilePicture email")
    .sort({ totalScore: -1, submitTime: 1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: leaderboard,
  });
});
