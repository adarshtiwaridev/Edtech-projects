const Course = require("../Models/Course");
const RatingAndReview = require("../Models/RatingAndReview");
const User = require("../Models/User");
const mongoose = require("mongoose");

// create or update rating and review
exports.createRatingAndReviews = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;

    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const alreadyReviewed = await RatingAndReview.findOne({ course: courseId, user: userId });

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.review = review;
      await alreadyReviewed.save();

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: alreadyReviewed
      });
    }

    const newReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review
    });

    await Course.findByIdAndUpdate(
      courseId,
      { $push: { ratingAndReviews: newReview._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview
    });

  } catch (error) {
    console.error("Error in createRatingAndReviews:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating or updating the review",
      error: error.message
    });
  }
};

// get average rating of a course
exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.query.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const result = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      averageRating: result.length > 0 ? result[0].averageRating : 0
    });

  } catch (error) {
    console.error("Error in getAverageRating:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while calculating average rating",
      error: error.message
    });
  }
};

// get all rating and reviews of a course
const getAllReviews = async (req, res) => {
  try {
    const courseId = req.query.courseId || req.body.courseId;

    let query = {};
    if (courseId) {
      query.course = courseId;
    }

    const reviews = await RatingAndReview.find(query)
      .populate({ path: "user", select: "firstName lastName email profilePicture" })
      .populate({ path: "course", select: "courseName" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error("Error in getAllReviews:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching reviews",
      error: error.message
    });
  }
};

exports.getAllReviews = getAllReviews;
exports.getAllRatings = getAllReviews; // Alias for compatibility with router imports
