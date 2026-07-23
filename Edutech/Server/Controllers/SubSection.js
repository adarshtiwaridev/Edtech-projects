const SubSection = require("../Models/SubSection");
const Section = require("../Models/Section");
const { uploadOptimizedFile } = require("../utlis/Imageuploader");

// create subsection
exports.createSubSection = async (req, res) => {
  try {
    const sectionId = req.body.sectionId || req.body.sectionID;
    const { title } = req.body;
    const description = req.body.description || req.body.descptions || req.body.descriptions || "";
    const timeDurationInput = req.body.timeDuration || req.body.duration;

    const video = req.files?.video || req.files?.videoFile || req.files?.videoFiles || req.files?.videoUrl;
    const existingVideoUrl = req.body.videoUrl || req.body.videourl;

    if (!sectionId || !title || (!video && !existingVideoUrl)) {
      return res.status(400).json({
        success: false,
        message: "sectionId, title, and video (or videoUrl) are required",
      });
    }

    let videoUrl = existingVideoUrl || "";
    let calculatedDuration = timeDurationInput || "0";

    if (video) {
      const filePath = video.tempFilePath || video.path;
      const uploadDetails = await uploadOptimizedFile(
        filePath,
        "Kodemates-lecture",
        { resource_type: "video" }
      );
      videoUrl = uploadDetails.secure_url;
      if (!timeDurationInput && uploadDetails.duration) {
        calculatedDuration = String(Math.round(uploadDetails.duration));
      }
    }

    const subSectionDetails = await SubSection.create({
      title,
      timeDuration: calculatedDuration,
      description,
      videourl: videoUrl,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subsections: subSectionDetails._id } },
      { new: true }
    ).populate("subsections");

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found for subsection assignment",
      });
    }

    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error creating SubSection:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the SubSection",
      error: error.message,
    });
  }
};

// update subsection
exports.updateSubSection = async (req, res) => {
  try {
    const subSectionId = req.body.subSectionId || req.body.subSectionID || req.params.subSectionId;
    const { title } = req.body;
    const description = req.body.description || req.body.descptions || req.body.descriptions;
    const timeDuration = req.body.timeDuration || req.body.duration;
    const video = req.files?.video || req.files?.videoFile || req.files?.videoFiles || req.files?.videoUrl;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId is required",
      });
    }

    const subSectionDetails = await SubSection.findById(subSectionId);
    if (!subSectionDetails) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) subSectionDetails.title = title;
    if (timeDuration !== undefined) subSectionDetails.timeDuration = timeDuration;
    if (description !== undefined) subSectionDetails.description = description;

    if (video) {
      const filePath = video.tempFilePath || video.path;
      const uploadDetails = await uploadOptimizedFile(
        filePath,
        "Kodemates-lecture",
        { resource_type: "video" }
      );
      subSectionDetails.videourl = uploadDetails.secure_url;
      if (!timeDuration && uploadDetails.duration) {
        subSectionDetails.timeDuration = String(Math.round(uploadDetails.duration));
      }
    }

    await subSectionDetails.save();

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: subSectionDetails,
    });

  } catch (error) {
    console.error("Error updating SubSection:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the SubSection",
      error: error.message,
    });
  }
};

// delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    const subSectionId = req.body.subSectionId || req.body.subSectionID || req.params.subSectionId;
    const sectionId = req.body.sectionId || req.body.sectionID;

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId is required",
      });
    }

    const subSectionDetails = await SubSection.findByIdAndDelete(subSectionId);
    if (!subSectionDetails) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (sectionId) {
      await Section.findByIdAndUpdate(
        sectionId,
        { $pull: { subsections: subSectionId } },
        { new: true }
      );
    } else {
      await Section.findOneAndUpdate(
        { subsections: subSectionId },
        { $pull: { subsections: subSectionId } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: subSectionDetails,
    });

  } catch (error) {
    console.error("Error deleting SubSection:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the SubSection",
      error: error.message,
    });
  }
};