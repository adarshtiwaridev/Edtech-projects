const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
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
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorName: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: "",
    },
    Thumbnails: {
      type: String,
      trim: true,
      default: "",
    },
    whatyouwillLearn: {
      type: String,
      trim: true,
      default: "",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    courseStatus: {
      type: String,
      default: "Draft",
    },
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
module.exports = Course;
