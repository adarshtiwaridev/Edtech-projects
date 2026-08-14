const mongoose = require("mongoose");

const studentResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, default: "Passionate Full-Stack & Systems Engineering Student" },
    dsaProgress: { type: Number, default: 65 },
    frontendProgress: { type: Number, default: 85 },
    backendProgress: { type: Number, default: 75 },
    databaseProgress: { type: Number, default: 70 },
    systemDesignProgress: { type: Number, default: 55 },
    devopsProgress: { type: Number, default: 45 },
    communicationScore: { type: Number, default: 80 },
    mockInterviewScore: { type: Number, default: 88 },
    githubUrl: { type: String, default: "https://github.com" },
    linkedinUrl: { type: String, default: "https://linkedin.com" },
    portfolioUrl: { type: String, default: "https://portfolio.dev" },
    college: { type: String, default: "IIT / State University" },
    branch: { type: String, default: "Computer Science & Engineering" },
    graduationYear: { type: String, default: "2026" },
    placementStatus: { type: String, default: "Actively Looking for Internships / SDE Roles" },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

const StudentResume =
  mongoose.models.StudentResume || mongoose.model("StudentResume", studentResumeSchema);

module.exports = StudentResume;
