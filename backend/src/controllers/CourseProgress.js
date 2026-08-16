const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const StudentService = require("../services/StudentService");

// Update or toggle lecture completion progress
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId, completed } = req.body;
    const userId = req.user.id;

    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "courseId and subSectionId are required",
      });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    let progress = await CourseProgress.findOne({ courseID: courseId, userId });

    let isNewlyCompleted = false;

    if (!progress) {
      progress = await CourseProgress.create({
        courseID: courseId,
        userId,
        completedVideos: [subSectionId],
        lastWatchedSubSection: subSectionId,
      });
      isNewlyCompleted = true;
    } else {
      const isAlreadyCompleted = progress.completedVideos.some(
        (id) => String(id) === String(subSectionId)
      );

      if (completed === false) {
        // Unmark completed
        progress.completedVideos = progress.completedVideos.filter(
          (id) => String(id) !== String(subSectionId)
        );
      } else if (!isAlreadyCompleted) {
        // Mark completed
        progress.completedVideos.push(subSectionId);
        isNewlyCompleted = true;
      }

      progress.lastWatchedSubSection = subSectionId;
      await progress.save();
    }

    // Calculate course completion stats
    const courseDetails = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subsections",
      },
    });

    let totalSubsections = 0;
    if (courseDetails?.courseContent) {
      courseDetails.courseContent.forEach((section) => {
        totalSubsections += section.subsections?.length || 0;
      });
    }

    const completedCount = progress.completedVideos.length;
    const progressPercentage =
      totalSubsections > 0 ? Math.round((completedCount / totalSubsections) * 100) : 0;

    // Log learning activity & update streak if newly completed
    if (isNewlyCompleted) {
      try {
        await StudentService.logActivity(userId, {
          minutes: 15,
          lecturesCount: 1,
          quizzesCount: 0,
        });
      } catch (logErr) {
        console.error("Failed to update student activity log:", logErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully",
      data: {
        progress,
        completedCount,
        totalSubsections,
        progressPercentage,
        isCourseFullyCompleted: completedCount >= totalSubsections && totalSubsections > 0,
      },
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update course progress",
      error: error.message,
    });
  }
};

// Get progress for a specific course or all courses for student
exports.getCourseProgress = async (req, res) => {
  try {
    const courseId = req.body.courseId || req.query.courseId;
    const userId = req.user.id;

    if (courseId) {
      const progress = await CourseProgress.findOne({ courseID: courseId, userId })
        .populate("completedVideos")
        .populate("lastWatchedSubSection");

      const courseDetails = await Course.findById(courseId).populate({
        path: "courseContent",
        populate: {
          path: "subsections",
        },
      });

      let totalSubsections = 0;
      if (courseDetails?.courseContent) {
        courseDetails.courseContent.forEach((section) => {
          totalSubsections += section.subsections?.length || 0;
        });
      }

      const completedCount = progress?.completedVideos?.length || 0;
      const progressPercentage =
        totalSubsections > 0 ? Math.round((completedCount / totalSubsections) * 100) : 0;

      return res.status(200).json({
        success: true,
        data: {
          progress: progress || { completedVideos: [], lastWatchedSubSection: null },
          completedCount,
          totalSubsections,
          progressPercentage,
        },
      });
    }

    // If no courseId, return all user progress
    const allProgress = await CourseProgress.find({ userId })
      .populate("courseID", "courseName thumbnail")
      .populate("completedVideos")
      .populate("lastWatchedSubSection");

    return res.status(200).json({
      success: true,
      data: allProgress,
    });

  } catch (error) {
    console.error("Error fetching course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch course progress",
      error: error.message,
    });
  }
};
