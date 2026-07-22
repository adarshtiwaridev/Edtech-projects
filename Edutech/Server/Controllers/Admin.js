const mongoose = require("mongoose");
const User = require("../Models/User");
const Course = require("../Models/Course");
const Profile = require("../Models/Profile");

// ==========================================
// 1. DASHBOARD & ANALYTICS
// ==========================================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ accountType: "Student" });
    const totalTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] } });
    
    const pendingTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] }, status: "Pending" });
    const approvedTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] }, status: "Approved" });
    const rejectedTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] }, status: "Rejected" });

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ courseStatus: "Published" });
    const draftCourses = await Course.countDocuments({ courseStatus: "Draft" });

    // Revenue calculation: Sum of all enrolled students * price of the course
    const allCourses = await Course.find({}).select("price studentsEnrolled");
    let totalRevenue = 0;
    allCourses.forEach((course) => {
      totalRevenue += (course.price || 0) * (course.studentsEnrolled?.length || 0);
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalTeachers,
        pendingTeachers,
        approvedTeachers,
        rejectedTeachers,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
};

exports.getRevenueCharts = async (req, res) => {
  try {
    // A simplified chart mock for now based on actual data
    const allCourses = await Course.find({}).populate("category").select("courseName price studentsEnrolled category createdAt");
    
    // Group revenue by course
    const courseSales = allCourses.map(c => ({
      name: c.courseName,
      revenue: (c.price || 0) * (c.studentsEnrolled?.length || 0),
      enrollments: c.studentsEnrolled?.length || 0
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        courseSales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch charts", error: error.message });
  }
};

// ==========================================
// 2. USER & TEACHER MANAGEMENT
// ==========================================
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = {};
    
    if (role) query.accountType = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .populate("additionalDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId, status, rejectionReason } = req.body;
    
    if (!userId || !status) {
      return res.status(400).json({ success: false, message: "User ID and status are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status, rejectionReason: rejectionReason || "" },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, message: "User status updated", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
};

exports.deleteUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }
    // Note: To make it production ready, we would also remove the user from enrolled courses, etc.
    
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};

// ==========================================
// 3. COURSE MANAGEMENT
// ==========================================
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.courseStatus = status;
    if (search) {
      query.courseName = { $regex: search, $options: "i" };
    }

    const courses = await Course.find(query)
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses", error: error.message });
  }
};

exports.updateCourseStatus = async (req, res) => {
  try {
    const { courseId, status } = req.body; // e.g. "Published", "Draft"
    const course = await Course.findByIdAndUpdate(courseId, { courseStatus: status }, { new: true });
    res.status(200).json({ success: true, message: "Course status updated", data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update course", error: error.message });
  }
};
