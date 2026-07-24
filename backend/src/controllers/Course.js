const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const Category = require("../models/Categories");
const { uploadOptimizedFile } = require("../utils/Imageuploader");
require("dotenv").config();

const getInstructorDisplayName = (user) =>
  user?.fullName ||
  [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
  user?.name ||
  "";

const populateCourseQuery = (query) =>
  query
    .populate("instructor", "firstName lastName email accountType profilePicture")
    .populate("category", "categoryName description")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subsections",
      },
    });

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatyouwillLearn, price, categories, category, level } = req.body;
    const thumbnailFile = req.files?.thumbnailFile;
    const userId = req.user?.id;
    const categoryId = categories || category;

    // Validation
    if (!courseName || !courseDescription || !price || !thumbnailFile || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Instructor check
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(400).json({ success: false, message: "Instructor not found" });
    }
    if (instructorDetails.accountType !== "Teacher" && instructorDetails.accountType !== "Instructor" && instructorDetails.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "Instructor only route" });
    }

    // Category check
    const categoryDetails = await Category.findById(categoryId);
    if (!categoryDetails) {
      return res.status(400).json({ success: false, message: "Category not found" });
    }

    // Upload thumbnail
    let uploadedImage;
    try {
      uploadedImage = await uploadOptimizedFile(thumbnailFile.tempFilePath || thumbnailFile.path, "course_thumbnails");
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: err.message,
      });
    }
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      instructorName: getInstructorDisplayName(instructorDetails),
      whatyouwillLearn: whatyouwillLearn || "Learn in depth",
      price: Number(price),
      thumbnail: uploadedImage.secure_url,
      Thumbnails: uploadedImage.secure_url,
      category: categoryDetails._id,
      level: level || "Beginner",
      courseStatus: "Published",
    });



    // Update instructor + category
    await User.findByIdAndUpdate(instructorDetails._id, { $push: { courses: newCourse._id } });
    await Category.findByIdAndUpdate(categoryDetails._id, { $push: { courses: newCourse._id } });

    const populatedCourse = await populateCourseQuery(Course.findById(newCourse._id));

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: populatedCourse,
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



// Get all courses with optional filters (category, search, level, status)
exports.getAllCourses = async (req, res) => {
  try {
    const { category, search, level, status } = { ...req.query, ...req.body };
    const query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (status) query.courseStatus = status;
    if (search) {
      query.$or = [
        { courseName: { $regex: search, $options: "i" } },
        { courseDescription: { $regex: search, $options: "i" } },
      ];
    }

    const allCourses = await populateCourseQuery(
      Course.find(query, {
        courseName: 1,
        courseDescription: 1,
        ratingAndReviews: 1,
        price: 1,
        thumbnail: 1,
        Thumbnails: 1,
        instructor: 1,
        instructorName: 1,
        category: 1,
        level: 1,
        courseStatus: 1,
        studentsEnrolled: 1,
        courseContent: 1,
        createdAt: 1,
      }).sort({ createdAt: -1 })
    );

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
    const courseId = req.body.courseId || req.query.courseId || req.params.courseId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const courseDetails = await populateCourseQuery(
      Course.findById(courseId).populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
    ).exec();

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

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    const { courseName, courseDescription, whatyouwillLearn, price, categories, category, level, courseStatus } = req.body;
    const thumbnailFile = req.files?.thumbnailFile;
    const categoryId = categories || category;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const requesterId = req.user?.id;
    const isUserAdmin = req.user?.role === "Admin" || req.user?.accountType === "Admin";
    if (!isUserAdmin && String(existingCourse.instructor) !== String(requesterId)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own courses",
      });
    }

    let nextCategoryId = existingCourse.category;
    if (categoryId && String(categoryId) !== String(existingCourse.category)) {
      const categoryDetails = await Category.findById(categoryId);
      if (!categoryDetails) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      await Category.findByIdAndUpdate(existingCourse.category, {
        $pull: { courses: existingCourse._id },
      });
      await Category.findByIdAndUpdate(categoryDetails._id, {
        $addToSet: { courses: existingCourse._id },
      });
      nextCategoryId = categoryDetails._id;
    }

    let thumbnailUrl = existingCourse.thumbnail || existingCourse.Thumbnails || "";
    if (thumbnailFile) {
      const uploadedImage = await uploadOptimizedFile(
        thumbnailFile.tempFilePath || thumbnailFile.path,
        "course_thumbnails"
      );
      thumbnailUrl = uploadedImage.secure_url;
    }

    existingCourse.courseName = courseName || existingCourse.courseName;
    existingCourse.courseDescription = courseDescription || existingCourse.courseDescription;
    existingCourse.whatyouwillLearn = whatyouwillLearn || existingCourse.whatyouwillLearn;
    existingCourse.price = price !== undefined ? Number(price) : existingCourse.price;
    existingCourse.level = level || existingCourse.level;
    existingCourse.category = nextCategoryId;
    existingCourse.thumbnail = thumbnailUrl;
    existingCourse.Thumbnails = thumbnailUrl;

    await existingCourse.save();

    const updatedCourse = await populateCourseQuery(Course.findById(existingCourse._id));

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error while updating course:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the course",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const requesterId = req.user?.id;
    const isUserAdmin = req.user?.role === "Admin" || req.user?.accountType === "Admin";
    if (!isUserAdmin && String(course.instructor) !== String(requesterId)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own courses",
      });
    }

    const sections = await Section.find({ courseId: course._id });
    const sectionIds = sections.map((section) => section._id);
    const subSectionIds = sections.flatMap((section) => section.subsections || []);

    if (subSectionIds.length) {
      await SubSection.deleteMany({ _id: { $in: subSectionIds } });
    }
    if (sectionIds.length) {
      await Section.deleteMany({ _id: { $in: sectionIds } });
    }

    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: course._id },
    });
    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: course._id },
    });
    await Course.findByIdAndDelete(course._id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: { courseId },
    });
  } catch (error) {
    console.error("Error while deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the course",
      error: error.message,
    });
  }
};
