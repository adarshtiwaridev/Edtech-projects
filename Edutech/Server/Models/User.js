const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, },
  password: { type: String, required: true },
  accountType: { type: String, enum: ["Admin", "Student", "Teacher"], default: "Student" },
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Suspended"], default: "Approved" },
  rejectionReason: { type: String, default: "" },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  courseprogress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseProgress",
  },
  profilePicture: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg",
    set: (v) =>
      v === ""
        ? "https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg"
        : v,
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: "users" });

// ✅ Fix for OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
