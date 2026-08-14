const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  minutes: { type: Number, default: 0 },
  lecturesCompleted: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
});

const studentStreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentStreak: { type: Number, default: 1 },
    longestStreak: { type: Number, default: 1 },
    missedDays: { type: Number, default: 0 },
    totalStudyMinutes: { type: Number, default: 0 },
    totalXp: { type: Number, default: 150 },
    level: { type: Number, default: 1 },
    coins: { type: Number, default: 50 },
    badges: [{ type: String }],
    achievements: [{ type: String }],
    lastActiveDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    activityLogs: [activityLogSchema],
    dailyTargetMinutes: { type: Number, default: 45 },
    weeklyGoalLectures: { type: Number, default: 10 },
  },
  { timestamps: true }
);

const StudentStreak =
  mongoose.models.StudentStreak || mongoose.model("StudentStreak", studentStreakSchema);

module.exports = StudentStreak;
