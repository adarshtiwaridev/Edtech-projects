const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ["mcq_single", "mcq_multiple", "true_false", "fill_blank", "numerical"],
      default: "mcq_single",
    },
    options: [
      {
        type: String,
      },
    ],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
    marks: {
      type: Number,
      default: 10,
    },
    negativeMarks: {
      type: Number,
      default: 0,
    },
    topic: {
      type: String,
      default: "General",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

quizQuestionSchema.index({ quizId: 1 });

const QuizQuestion =
  mongoose.models.QuizQuestion ||
  mongoose.model("QuizQuestion", quizQuestionSchema);

module.exports = QuizQuestion;
