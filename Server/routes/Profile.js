const express = require("express");
const router = express.Router();

// Import middleware
const { auth } = require("../middleware/Auth");

// Import controllers
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);

// Update Profile
router.put("/updateProfile", auth, updateProfile);

// Get User Details
router.get("/getUserDetails", auth, getAllUserDetails);

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// Update Display Picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

module.exports = router;
