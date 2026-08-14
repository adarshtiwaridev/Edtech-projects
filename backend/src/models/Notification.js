const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["Assignment", "Quiz", "LiveClass", "Certificate", "Security", "Streak", "Placement", "General"],
      default: "General",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

module.exports = Notification;
