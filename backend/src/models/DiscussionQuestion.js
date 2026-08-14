const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: {
      type: String,
      default: "Student",
    },
    text: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const discussionQuestionSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    subSectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

const DiscussionQuestion =
  mongoose.models.DiscussionQuestion || mongoose.model("DiscussionQuestion", discussionQuestionSchema);

module.exports = DiscussionQuestion;
