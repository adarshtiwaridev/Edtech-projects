// Import the required modules
const express = require("express");
const router = express.Router();

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
} = require("../controllers/Course");

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Sections");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

// Rating Controllers Import
const {
  createRatingAndReviews,
  getAverageRating,
  getAllRatings,
} = require("../controllers/RatingAndReviews");

// Course Progress Controllers Import
const {
  updateCourseProgress,
  getCourseProgress,
} = require("../controllers/CourseProgress");

// Importing Middlewares
const { auth, instructor, student, admin } = require("../middleware/Auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can be created/managed by Instructors & Admins
router.post("/createCourse", auth, instructor, createCourse);
router.put("/updateCourse/:courseId", auth, instructor, updateCourse);
router.delete("/deleteCourse/:courseId", auth, instructor, deleteCourse);

// Add/Update/Delete Section
router.post("/createSection", auth, instructor, createSection);
router.post("/updateSection", auth, instructor, updateSection);
router.post("/deleteSection", auth, instructor, deleteSection);

// Add/Update/Delete Sub Section
router.post("/createSubSection", auth, instructor, createSubSection);
router.post("/updateSubSection", auth, instructor, updateSubSection);
router.post("/deleteSubSection", auth, instructor, deleteSubSection);

// Get all Registered Courses (aliases for GET / and GET /getAllCourses)
router.get("/", getAllCourses);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.get("/getCourseDetails/:courseId", getCourseDetails);

// Course Progress routes
router.post("/updateCourseProgress", auth, student, updateCourseProgress);
router.post("/getCourseProgress", auth, student, getCourseProgress);
router.get("/getCourseProgress", auth, student, getCourseProgress);

// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************
router.post("/createCategory", auth, admin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, student, createRatingAndReviews);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllReviews", getAllRatings);

module.exports = router;
