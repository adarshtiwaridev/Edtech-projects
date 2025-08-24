const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDescription: {
    type: String,
    required: true,
    trim: true,
  },
  instructorName: {
    type: String,
    required: true,
    trim: true,
  },
  whatyouwillLearn: {
    type: String,
    required: true,
    trim: true,
  },
  coursecontent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Section",
  },
  courseDuration: {
    type: Number,
    required: true,
    min: 0,
  },
  ratingandReviews: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "RatingAndReview",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },

  Thumbnails: {
    type: String,
    required: true,
    trim: true,
  },
  Categories: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Categories",
  },
  Tags:{
   type:String,
   trim:true,
   required:true
  },
    courseStatus: {
        type: String,
        enum: ["recorded", "live" , "live-recorded", "upcoming"],
        default: "",
    },
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: "User",
    }],
});
const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
