const Course = require("../Models/Course");
const Section = require("../Models/Section");
const User = require("../Models/User");
const Category = require("../Models/Categories"); // ✅ Replaced Tag with Category
const { uploadOptimizedImage } = require("../utlis/Imageuploader");

/**
 * @route POST /api/courses/create
 */
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatyouwillLearn, price, categories, userId } = req.body;
    const thumbnailFile = req.file;

    // Validation
    if (!courseName || !courseDescription || !whatyouwillLearn || !price || !thumbnailFile || !userId || !categories) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Instructor check
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Optional: check if user is actually an Instructor
    if (instructorDetails.accountType && instructorDetails.accountType !== "Teacher") {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to create a course",
      });
    }

    // Category check
    const categoryDetails = await Category.findById(categories);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Upload thumbnail to Cloudinary
    const uploadedImage = await uploadOptimizedImage(thumbnailFile.path, "course_thumbnails");

    // Create new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatyouwillLearn,
      price,
      thumbnail: uploadedImage.secure_url, // ✅ fixed field name
      categories: categoryDetails._id,
    });

    // Update instructor's courses
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Update category with course
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating course",
      error: error.message,
    });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      { courseName: 1, ratingAndReviews: 1, price: 1, thumbnail: 1, instructor: 1 }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error("Error while fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all courses",
      error: error.message,
    });
  }
};

// Get course details
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("categories")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error while fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching course details",
      error: error.message,
    });
  }
};
