const Section = require("../Models/Section");
const Course = require("../Models/Course");
const SubSection = require("../Models/SubSection");

// ================= CREATE SECTION =================
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "sectionName and courseId are required",
      });
    }

    const newSection = await Section.create({
      sectionName,
      courseId,
    });

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subsections",
        },
      })
      .exec();

    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error: error.message,
    });
  }
};

// ================= UPDATE SECTION =================
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionName and sectionId are required",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    ).populate("subsections");

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      updatedSection,
    });

  } catch (error) {
    console.error("Error updating section:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating section",
      error: error.message,
    });
  }
};

// ================= DELETE SECTION =================
exports.deleteSection = async (req, res) => {
  try {
    const sectionId = req.body.sectionId || req.params.sectionId;
    const courseId = req.body.courseId || req.params.courseId;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId is required",
      });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Delete associated SubSections
    if (section.subsections && section.subsections.length > 0) {
      await SubSection.deleteMany({ _id: { $in: section.subsections } });
    }

    // Delete Section
    await Section.findByIdAndDelete(sectionId);

    // Remove Section reference from parent Course
    const targetCourseId = courseId || section.courseId;
    let updatedCourse = null;
    if (targetCourseId) {
      updatedCourse = await Course.findByIdAndUpdate(
        targetCourseId,
        { $pull: { courseContent: sectionId } },
        { new: true }
      ).populate({
        path: "courseContent",
        populate: {
          path: "subsections",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      updatedCourse,
    });

  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
      error: error.message,
    });
  }
};