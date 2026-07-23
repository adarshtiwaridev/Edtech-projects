const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file (image/video/raw) to Cloudinary with optional optimizations
 * @param {string} filePath - Local file path (from express-fileupload tempFilePath)
 * @param {string} folderName - Cloudinary folder name
 * @param {object} options - { resource_type, height, width, quality, format, crop }
 * @returns {object} Uploaded file details
 */
const uploadOptimizedFile = async (filePath, folderName, options = {}) => {
  try {
    const uploadOptions = {
      folder: folderName || "uploads",
      resource_type: options.resource_type || "auto",
    };

    if (options.resource_type === "image") {
      if (options.height) uploadOptions.height = options.height;
      if (options.width) uploadOptions.width = options.width;
      if (options.crop) uploadOptions.crop = options.crop;
      if (options.quality) uploadOptions.quality = options.quality;
      if (options.format) uploadOptions.format = options.format;
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error?.message || error);
    // If specific resource_type upload failed (e.g. video format error), try fallback auto
    if (options.resource_type && options.resource_type !== "auto") {
      try {
        const fallbackResult = await cloudinary.uploader.upload(filePath, {
          folder: folderName || "uploads",
          resource_type: "auto",
        });
        return fallbackResult;
      } catch (fallbackError) {
        console.error("Cloudinary Fallback Upload Error:", fallbackError?.message || fallbackError);
      }
    }
    throw new Error(`Cloudinary upload failed: ${error?.message || "Invalid file or credentials"}`);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resource_type - "image" | "video" | "raw"
 */
const deleteFileFromCloudinary = async (publicId, resource_type = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type });
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error?.message || error);
    throw new Error(`File deletion failed: ${error?.message || error}`);
  }
};

module.exports = {
  uploadOptimizedFile,
  deleteFileFromCloudinary,
};
