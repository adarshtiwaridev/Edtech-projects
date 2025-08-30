const profile = require("../Models/Profile");
const user = require("../Models/User");
const course = require("../Models/Course");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_Key,
  api_secret: process.env.api_secret,
});

// ==========================
// Update Profile
// ==========================
exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", contactNumber, gender, address = "" } = req.body;
    const id = req.user.id;

    if (!dateOfBirth || !contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userDetails = await user.findById(id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profileId = userDetails.additionalDetails;
    const profileDetails = await profile.findById(profileId);

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    profileDetails.address = address;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating the profile",
      error: error.message,
    });
  }
};

// ==========================
// Update Display Picture
// ==========================
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files?.displayPicture;
    const userId = req.user.id;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "Display picture is required",
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      displayPicture.tempFilePath,
      { folder: "user_profile_pictures" }
    );

    const profilePicUrl = uploadResult.secure_url;

    // Update user with Cloudinary URL
    const userDetails = await user.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicUrl },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error updating display picture:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating display picture",
      error: error.message,
    });
  }
};

// ==========================
// Delete Account
// ==========================
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await user.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileId = userDetails.additionalDetails;

    // Delete profile
    await profile.findByIdAndDelete(profileId);

    // Delete user
    await user.findByIdAndDelete(id);

    // Delete courses created by the user
    await course.deleteMany({ createdBy: id });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the account",
      error: error.message,
    });
  }
};

// ==========================
// Get User Details
// ==========================
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await user.findById(id).populate("additionalDetails").exec();

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error fetching profile details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the profile details",
      error: error.message,
    });
  }
};

// ==========================
// Get All User Details
// ==========================
exports.getAllUserDetails = async (req, res) => {
  try {
    const users = await user.find().populate("additionalDetails").exec();
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All user details fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching all user details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all user details",
      error: error.message,
    });
  }
};

// ==========================
// Get Enrolled Courses
// ==========================
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await user.findById(userId).populate("courses").exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data: userDetails.courses,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching enrolled courses",
      error: error.message,
    });
  }
};
