const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {   type: String, required: true ,trim:true },
    lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountType: { type: String, enum: [ "Admin" ,"Student", "Teacher"], default: "Student" },
    additionaldetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile" ,// Reference to AdditionalDetails model
        // required: true
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course"  }],
    courseprogress :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress" // Reference to CourseProgress model

    },
    profilePicture: { type: String, default: "https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg", set: v => v === "" ? "https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg" : v },
    token:
    {
      type:String,
    },
    resetPasswordExpires:{
type:Date,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: "users" });
const User = mongoose.model("User", userSchema);
module.exports = User;
