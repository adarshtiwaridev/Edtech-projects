const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const StudentStreak = require("../models/StudentStreak");
const StudentSession = require("../models/StudentSession");
const StudentResume = require("../models/StudentResume");
const Notification = require("../models/Notification");
const StudentPreferences = require("../models/StudentPreferences");

class StudentService {
  // Ensure default records exist for student
  static async ensureStudentRecords(userId) {
    let streak = await StudentStreak.findOne({ userId });
    if (!streak) {
      const today = new Date().toISOString().split("T")[0];
      streak = await StudentStreak.create({
        userId,
        currentStreak: 5,
        longestStreak: 12,
        missedDays: 1,
        totalStudyMinutes: 450,
        totalXp: 1850,
        level: 4,
        coins: 120,
        badges: ["Early Adopter", "7-Day Streak Master", "DSA Novice", "Quick Learner"],
        achievements: ["Completed First Module", "Scored 100% on Quiz", "Logged 5 Hours"],
        lastActiveDate: today,
        dailyTargetMinutes: 45,
        weeklyGoalLectures: 10,
        activityLogs: [
          { date: today, minutes: 45, lecturesCompleted: 2, quizzesTaken: 1 },
        ],
      });
    }

    let resume = await StudentResume.findOne({ userId });
    if (!resume) {
      resume = await StudentResume.create({
        userId,
        skills: ["JavaScript", "React.js", "Node.js", "MongoDB", "Tailwind CSS", "Data Structures"],
      });
    }

    let prefs = await StudentPreferences.findOne({ userId });
    if (!prefs) {
      prefs = await StudentPreferences.create({ userId });
    }

    // Generate initial notifications if none exist
    const notifCount = await Notification.countDocuments({ userId });
    if (notifCount === 0) {
      await Notification.insertMany([
        {
          userId,
          type: "Placement",
          title: "SDE Internship Drive 2026 Active",
          message: "Top tech companies are reviewing student profiles. Keep your GitHub & project status updated!",
          priority: "High",
          link: "/dashboard",
        },
        {
          userId,
          type: "Streak",
          title: "🔥 5-Day Learning Streak Active!",
          message: "Keep up the great pace. Study 15 minutes today to maintain your current streak.",
          priority: "Medium",
          link: "/dashboard",
        },
        {
          userId,
          type: "Quiz",
          title: "Upcoming Full-Stack Assessment",
          message: "React & Node.js mastery quiz scheduled for Friday. Practice with previous coding challenges.",
          priority: "Medium",
          link: "/quiz",
        },
      ]);
    }

    return { streak, resume, prefs };
  }

  // Record login session automatically
  static async recordLoginSession(userId, reqDetails, token) {
    try {
      // Mark prior current sessions as non-current
      await StudentSession.updateMany({ userId, isCurrent: true }, { isCurrent: false });

      const newSession = await StudentSession.create({
        userId,
        sessionToken: token || "session_" + Date.now(),
        ipAddress: reqDetails.ip || "127.0.0.1",
        userAgent: reqDetails.userAgent || "Browser Client",
        browser: reqDetails.browser || "Chrome",
        os: reqDetails.os || "Windows",
        deviceType: reqDetails.deviceType || "Desktop",
        location: reqDetails.location || "India",
        status: "Active",
        isCurrent: true,
      });

      return newSession;
    } catch (err) {
      console.error("Error recording login session:", err.message);
    }
  }

  // Dashboard Overview
  static async getOverview(userId) {
    await this.ensureStudentRecords(userId);

    const user = await User.findById(userId)
      .populate("courses")
      .populate("courseProgress");

    const streak = await StudentStreak.findOne({ userId });
    const resume = await StudentResume.findOne({ userId });
    const notifications = await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });

    const totalEnrolled = user.courses ? user.courses.length : 0;
    
    // Calculate progress stats
    let completedCoursesCount = 0;
    let inProgressCount = 0;
    let totalCompletedLectures = 0;

    if (user.courseProgress && user.courseProgress.length > 0) {
      for (const cp of user.courseProgress) {
        const completedCount = cp.completedVideos ? cp.completedVideos.length : 0;
        totalCompletedLectures += completedCount;
        if (completedCount > 5) {
          completedCoursesCount++;
        } else {
          inProgressCount++;
        }
      }
    } else {
      inProgressCount = totalEnrolled;
    }

    const certificatesEarned = completedCoursesCount;
    const hoursStudied = (streak.totalStudyMinutes / 60).toFixed(1);

    // Build weekly activity breakdown from activity logs or defaults
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyActivity = daysOfWeek.map((day, idx) => {
      const log = streak.activityLogs.find((l) => new Date(l.date).getDay() === idx);
      return {
        day,
        minutes: log ? log.minutes : Math.floor(Math.random() * 40) + 10,
        lectures: log ? log.lecturesCompleted : Math.floor(Math.random() * 2) + 1,
      };
    });

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        accountType: user.accountType,
      },
      stats: {
        coursesPurchased: totalEnrolled,
        coursesCompleted: completedCoursesCount,
        coursesInProgress: inProgressCount,
        certificatesEarned,
        totalLearningHours: hoursStudied,
        globalRank: "#4 Top 1%",
        currentLevel: streak.level,
        learningXp: streak.totalXp,
        coins: streak.coins,
        badgesCount: streak.badges.length,
        achievementsCount: streak.achievements.length,
        assignmentsPending: 2,
        assignmentsSubmitted: 8,
        avgQuizScore: 88,
        attendancePercentage: 94,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        weeklyGoalProgress: 84, // %
        learningSpeed: "1.4x Faster than Average",
        skillGrowth: "+18%",
      },
      streak,
      resume,
      unreadNotificationsCount: notifications.length,
      weeklyActivity,
    };
  }

  // Login Analytics
  static async getLoginAnalytics(userId) {
    const sessions = await StudentSession.find({ userId }).sort({ createdAt: -1 }).limit(10);
    const loginCount = await StudentSession.countDocuments({ userId });

    const activeSessions = sessions.filter((s) => s.status === "Active");
    const securityAlerts = [
      {
        id: "alert_1",
        title: "New Device Login Detected",
        message: "Login from Chrome on Windows detected on current session.",
        severity: "Low",
        timestamp: new Date(),
      },
    ];

    return {
      totalLogins: loginCount,
      failedAttempts: 0,
      activeDevicesCount: activeSessions.length,
      currentSession: activeSessions.find((s) => s.isCurrent) || sessions[0],
      sessionsHistory: sessions,
      securityAlerts,
    };
  }

  // Logout Remote Session
  static async terminateSession(userId, sessionId) {
    if (sessionId === "all_others") {
      await StudentSession.updateMany(
        { userId, isCurrent: false },
        { status: "Terminated" }
      );
    } else {
      await StudentSession.findByIdAndUpdate(sessionId, { status: "Terminated", isCurrent: false });
    }
    return true;
  }

  // Log Daily Activity & Study Time
  static async logActivity(userId, { minutes = 25, lecturesCount = 1, quizzesCount = 0 }) {
    let streak = await StudentStreak.findOne({ userId });
    if (!streak) {
      await this.ensureStudentRecords(userId);
      streak = await StudentStreak.findOne({ userId });
    }

    const today = new Date().toISOString().split("T")[0];
    const existingLogIndex = streak.activityLogs.findIndex((l) => l.date === today);

    if (existingLogIndex >= 0) {
      streak.activityLogs[existingLogIndex].minutes += minutes;
      streak.activityLogs[existingLogIndex].lecturesCompleted += lecturesCount;
      streak.activityLogs[existingLogIndex].quizzesTaken += quizzesCount;
    } else {
      streak.activityLogs.push({
        date: today,
        minutes,
        lecturesCompleted: lecturesCount,
        quizzesTaken: quizzesCount,
      });

      // Update streak count if log is from new day
      streak.currentStreak += 1;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
    }

    streak.totalStudyMinutes += minutes;
    const addedXp = minutes * 5 + lecturesCount * 20;
    streak.totalXp += addedXp;

    // Check level up (1000 XP per level)
    streak.level = Math.floor(streak.totalXp / 1000) + 1;
    streak.lastActiveDate = today;

    await streak.save();
    return streak;
  }

  // Recover Streak
  static async recoverStreak(userId) {
    const streak = await StudentStreak.findOne({ userId });
    if (!streak) throw new Error("Streak record not found");

    if (streak.coins < 20) {
      throw new Error("Insufficient coins for streak recovery (20 coins needed)");
    }

    streak.coins -= 20;
    streak.currentStreak += 1;
    streak.missedDays = Math.max(0, streak.missedDays - 1);
    await streak.save();

    return streak;
  }

  // Student Analytics
  static async getStudentAnalytics(userId) {
    const streak = await StudentStreak.findOne({ userId });
    const user = await User.findById(userId).populate("courses");

    return {
      skillRadar: [
        { subject: "Data Structures", score: 85 },
        { subject: "React Frontend", score: 92 },
        { subject: "Node.js Backend", score: 78 },
        { subject: "Database (MongoDB)", score: 70 },
        { subject: "System Design", score: 62 },
        { subject: "DevOps & Cloud", score: 55 },
      ],
      topicProgress: [
        { topic: "React Hooks & State", progress: 95, status: "Mastered" },
        { topic: "Express REST Architecture", progress: 88, status: "Advanced" },
        { topic: "Binary Trees & Graphs", progress: 65, status: "In Progress" },
        { topic: "Docker & Kubernetes", progress: 40, status: "Needs Practice" },
      ],
      learningVelocity: "Fast (45 mins/day average)",
      engagementScore: 92, // %
      productivityScore: 88,
      strongTopics: ["React.js Component Architecture", "REST API Design", "Authentication"],
      weakTopics: ["Dynamic Programming", "Kubernetes Deployment", "GraphQL Caching"],
    };
  }

  // Resume & Career Profile
  static async getResumeProfile(userId) {
    await this.ensureStudentRecords(userId);
    const resume = await StudentResume.findOne({ userId });

    // Calculate placement readiness score
    const readiness = Math.round(
      (resume.dsaProgress * 0.3 +
        resume.frontendProgress * 0.2 +
        resume.backendProgress * 0.2 +
        resume.mockInterviewScore * 0.2 +
        resume.communicationScore * 0.1)
    );

    return {
      resume,
      placementReadinessScore: readiness,
      resumeCompletionScore: 90,
    };
  }

  static async updateResumeProfile(userId, updateData) {
    const resume = await StudentResume.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    return resume;
  }

  // Notifications
  static async getNotifications(userId) {
    const list = await Notification.find({ userId }).sort({ createdAt: -1 });
    const unreadCount = list.filter((n) => !n.isRead).length;
    return { notifications: list, unreadCount };
  }

  static async markNotificationRead(userId, notifId) {
    if (notifId === "all") {
      await Notification.updateMany({ userId }, { isRead: true });
    } else {
      await Notification.findOneAndUpdate({ _id: notifId, userId }, { isRead: true });
    }
    return true;
  }

  // Preferences
  static async getPreferences(userId) {
    await this.ensureStudentRecords(userId);
    return await StudentPreferences.findOne({ userId });
  }

  static async updatePreferences(userId, updateData) {
    const prefs = await StudentPreferences.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    return prefs;
  }
}

module.exports = StudentService;
