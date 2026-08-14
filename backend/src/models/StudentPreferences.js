const mongoose = require("mongoose");

const studentPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    accentColor: { type: String, default: "emerald" }, // emerald, indigo, violet, amber, cyan
    pinnedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    widgetVisibility: {
      overview: { type: Boolean, default: true },
      streakHeatmap: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      placement: { type: Boolean, default: true },
      pomodoro: { type: Boolean, default: true },
      aiAssistant: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const StudentPreferences =
  mongoose.models.StudentPreferences ||
  mongoose.model("StudentPreferences", studentPreferencesSchema);

module.exports = StudentPreferences;
