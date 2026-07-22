 const SubSection = require("../Models/SubSection");
const Section = require("../Models/Section");
const { uploadOptimizedFile } = require("../utlis/Imageuploader");

// create subsection
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, descptions } = req.body;
    const video = req.files?.video;  // uploaded video

    if (!sectionId || !title || !timeDuration || !descptions || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields sectionId, title, timeDuration, descriptions, video are required",
      });
    }

    // ✅ FIX: pass video.tempFilePath instead of video object
    const uploadDetails = await uploadOptimizedFile(
      video.tempFilePath,
      "Kodemates-lecture",
      { resource_type: "video" } // tell Cloudinary it's a video
    );

    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description: descptions,
      videourl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subsections: subSectionDetails._id } },
      { new: true }
    ).populate("subsections");

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
    // 1. Extract body and file
    const { subSectionId, title, timeDuration, descptions } = req.body;
    const video = req.files?.videoFiles;

    // 2. Validate required fields
    if (!subSectionId || !title || !timeDuration || !descptions) {
      return res.status(400).json({
        success: false,
        message: "All fields (subSectionId, title, timeDuration, description) are required",
      });
    }

    // 3. Find SubSection by ID
    const subSectionDetails = await SubSection.findById(subSectionId);
    if (!subSectionDetails) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // 4. Update fields
    subSectionDetails.title = title;
    subSectionDetails.timeDuration = timeDuration;
    subSectionDetails.description = descptions;

    // 5. If new video is provided, upload and update videourl
    if (video) {
      const uploadDetails = await uploadOptimizedFile(
        video.tempFilePath || video.path, 
        "Kodemates-lecture",
        { resource_type: "video" }
      );
      subSectionDetails.videourl = uploadDetails.secure_url;
    }

    // 6. Save updated SubSection
    await subSectionDetails.save();

    // 7. Return response
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



//delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    // 1. Extract subSectionId from body
    const { subSectionId } = req.body;

    // 2. Validate required field
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "subSectionId is required",
      });
    }

    // 3. Find and delete SubSection by ID
    const subSectionDetails = await SubSection.findByIdAndDelete(subSectionId);
    if (!subSectionDetails) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // 4. Remove SubSection reference from Section
    await Section.findOneAndUpdate(
      { subsections: subSectionId },
      { $pull: { subsections: subSectionId } }
    );

    // 5. Return response
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