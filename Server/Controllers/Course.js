const Course = require("../Models/Course");
const Section = require("../Models/Section");
const Tag = require("../Models/Tag");
const User = require("../Models/User");
const { uploadOptimizedImage } = require("../utlis/Imageuploader");

/**
 * @route POST /api/courses/create
 */
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatyouwillLearn, price, tag, userId } = req.body;

    const thumbnailFile = req.file;

    if (!courseName || !courseDescription || !whatyouwillLearn || !price || !thumbnailFile || !userId || !tag) {
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

    // Tag check
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Tag not found",
      });
    }

    // Upload thumbnail
    const uploadedImage = await uploadOptimizedImage(thumbnailFile.path, "course_thumbnails");

    // Create course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id, // use consistent field name
      whatyouwillLearn,
      price,
      Thumbnails: uploadedImage.secure_url,
      tag: tagDetails._id,
    });

    // Update instructor's courses
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Update tag with course
    await Tag.findByIdAndUpdate(
      tagDetails._id,
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

// get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      { courseName: true, ratingandReviews: true, price: true, Thumbnails: true, instructor: true }
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
    });
  }
};



// get coursedetails
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
      .populate(path : "instructor",{
        populate : {
          path : "additionalDetails",
        }
      })
      .populate("catgories").populate("tag").populate("ratingandReviews")
      .populate({
        path : "courseContent",
       populate : { path : "subSection"

        }
      }).exec();
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
  }
  catch(error){
    console.error("Error while fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching course details",
      error: error.message,
    });
  }
};
