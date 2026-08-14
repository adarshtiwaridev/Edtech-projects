const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    submitTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "auto_submitted", "disqualified"],
      default: "in_progress",
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QuizQuestion",
        },
        selectedAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: { type: Boolean, default: false },
        marksAwarded: { type: Number, default: 0 },
        timeSpentSeconds: { type: Number, default: 0 },
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    tabSwitchCount: {
      type: Number,
      default: 0,
    },
    aiPerformanceReport: {
      summary: { type: String, default: "" },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      recommendedTopics: [{ type: String }],
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ quizId: 1, studentId: 1 });

const QuizAttempt =
  mongoose.models.QuizAttempt ||
  mongoose.model("QuizAttempt", quizAttemptSchema);

module.exports = QuizAttempt;
