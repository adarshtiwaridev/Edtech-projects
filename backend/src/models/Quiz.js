const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    category: {
      type: String,
      default: "General Assessment",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 30,
    },
    passingMarks: {
      type: Number,
      default: 40,
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    negativeMarking: {
      enabled: { type: Boolean, default: false },
      perWrongAnswer: { type: Number, default: 0.25 },
    },
    shuffleQuestions: {
      type: Boolean,
      default: true,
    },
    shuffleOptions: {
      type: Boolean,
      default: true,
    },
    attemptLimit: {
      type: Number,
      default: 3,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    fullScreenMode: {
      type: Boolean,
      default: true,
    },
    tabSwitchDetection: {
      type: Boolean,
      default: true,
    },
    pdfSourceUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

quizSchema.index({ instructor: 1, createdAt: -1 });
quizSchema.index({ courseId: 1 });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
