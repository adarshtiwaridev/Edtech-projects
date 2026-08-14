const mongoose = require("mongoose");

const uploadedPdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    extractedQuestionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const UploadedPdf =
  mongoose.models.UploadedPdf ||
  mongoose.model("UploadedPdf", uploadedPdfSchema);

module.exports = UploadedPdf;
