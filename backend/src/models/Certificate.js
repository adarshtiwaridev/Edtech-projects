const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    verificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      default: "Kodemates Faculty",
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      default: "Excellence",
    },
  },
  { timestamps: true }
);

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Certificate =
  mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;
