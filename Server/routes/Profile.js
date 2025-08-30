const express = require("express");
const router = express.Router();

// Import middleware
const { auth } = require("../middleware/Auth");

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  getUserDetails,
  getEnrolledCourses,
  updateDisplayPicture,
} = require("../Controllers/Profile");
// Define routes and attach middleware and controllers
router.delete("/deleteAccount", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getUserDetails);
router.get("/getAllUserDetails", auth, getAllUserDetails);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

module.exports = router;
