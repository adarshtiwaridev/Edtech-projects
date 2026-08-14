const asyncHandler = require("express-async-handler");
const Course = require("../models/Course");
const User = require("../models/User");

exports.getInstructorAnalytics = asyncHandler(async (req, res) => {
  const instructorId = req.user.id;

  // Fetch all courses created by instructor
  const instructorCourses = await Course.find({ instructor: instructorId })
    .populate("studentsEnrolled", "firstName lastName email createdAt")
    .lean();

  let totalGrossRevenue = 0;
  let totalStudentsCount = 0;

  const courseBreakdown = instructorCourses.map((course) => {
    const studentsCount = course.studentsEnrolled?.length || 0;
    const price = course.price || 0;
    const courseGross = studentsCount * price;

    totalGrossRevenue += courseGross;
    totalStudentsCount += studentsCount;

    return {
      courseId: course._id,
      title: course.courseName,
      thumbnail: course.thumbnail,
      price,
      studentsEnrolledCount: studentsCount,
      grossRevenue: courseGross,
      netPayout: (courseGross * 0.85).toFixed(2),
    };
  });

  const platformFee = (totalGrossRevenue * 0.15).toFixed(2);
  const netEarnings = (totalGrossRevenue * 0.85).toFixed(2);

  // Simulated 6-month earnings breakdown for charts
  const monthlyEarningsChart = [
    { month: "Jan", revenue: Math.round(totalGrossRevenue * 0.1) },
    { month: "Feb", revenue: Math.round(totalGrossRevenue * 0.15) },
    { month: "Mar", revenue: Math.round(totalGrossRevenue * 0.18) },
    { month: "Apr", revenue: Math.round(totalGrossRevenue * 0.22) },
    { month: "May", revenue: Math.round(totalGrossRevenue * 0.2) },
    { month: "Jun", revenue: Math.round(totalGrossRevenue * 0.15) },
  ];

  res.status(200).json({
    success: true,
    data: {
      totalCoursesCount: instructorCourses.length,
      totalStudentsCount,
      totalGrossRevenue,
      platformFee,
      netEarnings,
      courseBreakdown,
      monthlyEarningsChart,
    },
  });
});
