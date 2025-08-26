exports.createRatingAndReviews = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;

    // validation
    if (!rating || !review || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // check if course exists
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // check if user exists
    const userDetails = await User.findById(userId); // <-- fixed await
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // check if user has already reviewed the course
    const alreadyReviewed = await RatingAndReview.findOne({ course: courseId, user: userId });

    if (alreadyReviewed) {
      // update review
      alreadyReviewed.rating = rating;
      alreadyReviewed.review = review;
      await alreadyReviewed.save();

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: alreadyReviewed
      });
    }

    // create new review
    const newReview = await RatingAndReview.create({
      user: userId,
      course: courseId,
      rating,
      review
    });

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