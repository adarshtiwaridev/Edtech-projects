const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middleware/Auth");
const {
  getDashboardStats,
  getRevenueCharts,
  getAllUsers,
  updateUserStatus,
  deleteUserAdmin,
  getAllCoursesAdmin,
  updateCourseStatus,
  deleteCourseAdmin,
} = require("../controllers/Admin");

const { updateCourse } = require("../controllers/Course");

// All Admin routes require Auth and Admin privileges
router.use(auth, admin);

// Dashboard
router.get("/dashboard-stats", getDashboardStats);
router.get("/revenue-charts", getRevenueCharts);

// User & Teacher Management
router.get("/users", getAllUsers);
router.put("/user/status", updateUserStatus);
router.delete("/user/:userId", deleteUserAdmin);

// Course Management
router.get("/courses", getAllCoursesAdmin);
router.put("/course/status", updateCourseStatus);
router.put("/course/:courseId", updateCourse);
router.delete("/course/:courseId", deleteCourseAdmin);

module.exports = router;
