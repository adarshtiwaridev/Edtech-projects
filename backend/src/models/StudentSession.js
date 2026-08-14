const mongoose = require("mongoose");

const studentSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionToken: { type: String, required: true },
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "Unknown Device" },
    browser: { type: String, default: "Chrome" },
    os: { type: String, default: "Windows" },
    deviceType: { type: String, default: "Desktop" },
    location: { type: String, default: "India" },
    loginTime: { type: Date, default: Date.now },
    lastActiveTime: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Terminated"], default: "Active" },
    isCurrent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const StudentSession =
  mongoose.models.StudentSession || mongoose.model("StudentSession", studentSessionSchema);

module.exports = StudentSession;
