const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema(
  {
    courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
    lastWatchedSubSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  },
  { timestamps: true }
);

courseProgressSchema.index({ courseID: 1, userId: 1 }, { unique: true });

const CourseProgress =
  mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", courseProgressSchema);

module.exports = CourseProgress;
