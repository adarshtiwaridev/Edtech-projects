 const SubSection = require("../Models/SubSection");
const Section = require("../Models/Section");
const { uploadOptimizedImage } = require("../utlis/Imageuploader");

// Create SubSection
exports.createSubSection = async (req, res) => {
  try {
    // 1. Extract body and file
    const { sectionId, title, timeDuration, descptions } = req.body;
    const video = req.files?.videoFiles;

    // 2. Validate required fields
    if (!sectionId || !title || !timeDuration || !descptions || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields (sectionId, title, timeDuration, description, video) are required",
      });
    }

    // 3. Upload video to Cloudinary
    const uploadDetails = await uploadOptimizedImage(video, "Kodemates-lecture");

    // 4. Create SubSection
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description: descptions,
      videourl: uploadDetails.secure_url,
    });

    // 5. Update Section with new SubSection reference
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subsections: subSectionDetails._id } },
      { new: true }
    ).populate("subsections"); // optional: auto-populate subsections

    // 6. Return response
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


// update dubsection 




//delete subsection