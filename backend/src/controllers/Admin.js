const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const Categories = require("../models/Categories");
const Certificate = require("../models/Certificate");
const CourseProgress = require("../models/CourseProgress");
const RatingAndReview = require("../models/RatingAndReview");

// ==========================================
// 1. DASHBOARD & ANALYTICS (REAL DB DATA)
// ==========================================
exports.getDashboardStats = async (req, res) => {
  try {
    const { range = "30d", startDate, endDate } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (range === "today") {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { createdAt: { $gte: todayStart } };
    } else if (range === "7d") {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: past } };
    } else if (range === "30d") {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: past } };
    } else if (range === "90d") {
      const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: past } };
    } else if (range === "custom" && startDate && endDate) {
      dateFilter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    }

    const totalUsers = await User.countDocuments();
    const rangeNewUsers = await User.countDocuments(dateFilter);
    const totalStudents = await User.countDocuments({ accountType: "Student" });
    const totalTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] } });
    
    const pendingTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] }, status: "Pending" });
    const approvedTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] }, status: "Approved" });
    const rejectedTeachers = await User.countDocuments({ accountType: { $in: ["Teacher", "Instructor"] }, status: "Rejected" });

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ courseStatus: "Published" });
    const draftCourses = await Course.countDocuments({ courseStatus: "Draft" });
    const totalCategories = await Categories.countDocuments();
    const certificatesIssued = await Certificate.countDocuments();

    // Total Revenue calculation
    const allCourses = await Course.find({}).select("price studentsEnrolled createdAt");
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let todayEnrollments = 0;

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    allCourses.forEach((course) => {
      const enrollmentCount = course.studentsEnrolled?.length || 0;
      const price = course.price || 0;
      totalRevenue += price * enrollmentCount;

      if (course.createdAt >= thirtyDaysAgo) {
        monthlyRevenue += price * enrollmentCount;
      }
      if (course.createdAt >= startOfToday) {
        todayEnrollments += enrollmentCount;
      }
    });

    // Real completion rate calculation
    const allProgressRecords = await CourseProgress.find({});
    let completedProgressCount = 0;
    if (allProgressRecords.length > 0) {
      for (const cp of allProgressRecords) {
        if (cp.completedVideos && cp.completedVideos.length > 3) {
          completedProgressCount++;
        }
      }
    }
    const completionRate =
      allProgressRecords.length > 0
        ? Math.round((completedProgressCount / allProgressRecords.length) * 100)
        : 0;

    // Average platform rating
    const ratingAggregate = await RatingAndReview.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = ratingAggregate.length > 0 ? Number(ratingAggregate[0].avgRating.toFixed(1)) : 5.0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        rangeNewUsers,
        totalStudents,
        totalTeachers,
        pendingTeachers,
        approvedTeachers,
        rejectedTeachers,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalCategories,
        certificatesIssued,
        totalRevenue,
        monthlyRevenue,
        todayEnrollments,
        completionRate,
        avgRating,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
};

exports.getRevenueCharts = async (req, res) => {
  try {
    const allCourses = await Course.find({})
      .populate("category", "categoryName")
      .select("courseName price studentsEnrolled category createdAt");
    
    const courseSales = allCourses.map(c => ({
      name: c.courseName,
      revenue: (c.price || 0) * (c.studentsEnrolled?.length || 0),
      enrollments: c.studentsEnrolled?.length || 0,
      category: c.category?.categoryName || "General",
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        courseSales,
      },
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
      .populate("category", "categoryName description")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses", error: error.message });
  }
};

exports.updateCourseStatus = async (req, res) => {
  try {
    const { courseId, status } = req.body;
    if (!courseId || !status) {
      return res.status(400).json({ success: false, message: "courseId and status are required" });
    }
    const course = await Course.findByIdAndUpdate(courseId, { courseStatus: status }, { new: true });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: `Course status updated to ${status}`, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update course status", error: error.message });
  }
};

exports.deleteCourseAdmin = async (req, res) => {
  try {
    const courseId = req.params.courseId || req.body.courseId;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const Section = require("../models/Section");
    const SubSection = require("../models/SubSection");
    const Category = require("../models/Categories");

    const sections = await Section.find({ courseId: course._id });
    const sectionIds = sections.map((s) => s._id);
    const subSectionIds = sections.flatMap((s) => s.subsections || []);

    if (subSectionIds.length) await SubSection.deleteMany({ _id: { $in: subSectionIds } });
    if (sectionIds.length) await Section.deleteMany({ _id: { $in: sectionIds } });

    await User.findByIdAndUpdate(course.instructor, { $pull: { courses: course._id } });
    await Category.findByIdAndUpdate(course.category, { $pull: { courses: course._id } });
    await Course.findByIdAndDelete(course._id);

    return res.status(200).json({ success: true, message: "Course deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete course", error: error.message });
  }
};
