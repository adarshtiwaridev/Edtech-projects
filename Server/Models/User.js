const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {   type: String, required: true ,trim:true },
    lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountType: { type: String, enum: [ "Adamin" ,"student", "teacher"], default: "student" },
    additionaldetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "profile" ,// Reference to AdditionalDetails model
        required: true
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course"  }],
    courseprogress :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress" // Reference to CourseProgress model

    },
    profilePicture: { type: String, default: "" },
    token:
    {
      type:String,
    },
    resetPasswordExpires:{
type:Date,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
