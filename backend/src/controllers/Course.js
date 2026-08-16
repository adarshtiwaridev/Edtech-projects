const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const Category = require("../models/Categories");
const { uploadOptimizedFile } = require("../utils/Imageuploader");

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
    const {
      title,
      courseName,
      description,
      courseDescription,
      whatyouwillLearn,
      price,
      categories,
      category,
      level,
      thumbnail,
      sections,
    } = req.body;

    const finalTitle = (courseName || title || "").trim();
    const finalDesc = (courseDescription || description || "").trim();
    const userId = req.user?.id;

    if (!finalTitle || !finalDesc) {
      return res.status(400).json({
        success: false,
        message: "Course title and description are required",
      });
    }

    // Instructor check
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(400).json({ success: false, message: "Instructor user record not found" });
    }

    // Category resolution
    let targetCategory = null;
    const categoryId = categories || category;

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      targetCategory = await Category.findById(categoryId);
    }
    if (!targetCategory) {
      targetCategory = await Category.findOne({});
    }
    if (!targetCategory) {
      targetCategory = await Category.create({
        categoryName: "Full Stack Web Development",
        description: "Comprehensive software engineering and full-stack development curriculum.",
      });
    }

    // Thumbnail upload & fallback handling
    let thumbnailUrl = thumbnail || req.body.thumbnailUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800";
    const thumbnailFile = req.files?.thumbnailFile || req.files?.thumbnail;

    if (thumbnailFile) {
      try {
        const uploadedImage = await uploadOptimizedFile(
          thumbnailFile.tempFilePath || thumbnailFile.path,
          "course_thumbnails"
        );
        if (uploadedImage?.secure_url) {
          thumbnailUrl = uploadedImage.secure_url;
        }
      } catch (err) {
        console.warn("Cloudinary upload fallback activated:", err.message);
      }
    }

    const newCourse = await Course.create({
      courseName: finalTitle,
      courseDescription: finalDesc,
      instructor: instructorDetails._id,
      instructorName: getInstructorDisplayName(instructorDetails),
      whatyouwillLearn: whatyouwillLearn || "Comprehensive full-stack development concepts and practical projects.",
      price: price !== undefined && price !== "" ? Number(price) : 0,
      thumbnail: thumbnailUrl,
      Thumbnails: thumbnailUrl,
      category: targetCategory._id,
      level: level || "Beginner",
      courseStatus: "Published",
      courseContent: [],
    });

    // Create sections & lectures if provided in payload
    if (Array.isArray(sections) && sections.length > 0) {
      const createdSectionIds = [];

      for (const sec of sections) {
        if (!sec.title?.trim()) continue;

        const createdSection = await Section.create({
          sectionName: sec.title.trim(),
          courseId: newCourse._id,
          subsections: [],
        });

        if (Array.isArray(sec.lectures) && sec.lectures.length > 0) {
          const createdSubSectionIds = [];

          for (const lec of sec.lectures) {
            if (!lec.title?.trim()) continue;

            const createdSubSection = await SubSection.create({
              title: lec.title.trim(),
              timeDuration: lec.timeDuration || "10:00",
              description: lec.notes || lec.description || "",
              videourl: lec.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            });

            createdSubSectionIds.push(createdSubSection._id);
          }

          createdSection.subsections = createdSubSectionIds;
          await createdSection.save();
        }

        createdSectionIds.push(createdSection._id);
      }

      newCourse.courseContent = createdSectionIds;
      await newCourse.save();
    }

    // Update instructor + category relations
    await User.findByIdAndUpdate(instructorDetails._id, { $addToSet: { courses: newCourse._id } });
    await Category.findByIdAndUpdate(targetCategory._id, { $addToSet: { courses: newCourse._id } });

    let populatedCourse = newCourse;
    try {
      populatedCourse = await Course.findById(newCourse._id)
        .populate("instructor", "firstName lastName email accountType profilePicture")
        .populate("category", "categoryName description")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subsections",
          },
        })
        .exec();
    } catch (popErr) {
      console.warn("Populate course warning:", popErr.message);
      populatedCourse = newCourse;
    }

    return res.status(201).json({
      success: true,
      message: "Course created successfully! 🚀",
      data: populatedCourse || newCourse,
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
