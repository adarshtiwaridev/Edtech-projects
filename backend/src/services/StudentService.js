const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const StudentStreak = require("../models/StudentStreak");
const StudentSession = require("../models/StudentSession");
const StudentResume = require("../models/StudentResume");
const Notification = require("../models/Notification");
const StudentPreferences = require("../models/StudentPreferences");
const Certificate = require("../models/Certificate");
const QuizAttempt = require("../models/QuizAttempt");
const { emitToUser } = require("../sockets/socket");

class StudentService {
  // Ensure default records exist for student without fake random stats
  static async ensureStudentRecords(userId) {
    let streak = await StudentStreak.findOne({ userId });
    if (!streak) {
      const today = new Date().toISOString().split("T")[0];
      streak = await StudentStreak.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        missedDays: 0,
        totalStudyMinutes: 0,
        totalXp: 0,
        level: 1,
        coins: 0,
        badges: ["New Learner"],
        achievements: [],
        lastActiveDate: today,
        dailyTargetMinutes: 30,
        weeklyGoalLectures: 10,
        activityLogs: [],
      });
    }

    let resume = await StudentResume.findOne({ userId });
    if (!resume) {
      resume = await StudentResume.create({
        userId,
        skills: ["JavaScript", "HTML/CSS"],
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
          type: "System",
          title: "Welcome to Kodemates Learning Platform!",
          message: "Explore published courses, complete interactive quizzes, and earn verified certificates.",
          priority: "High",
          link: "/dashboard/student/browse",
        },
      ]);
    }

    return { streak, resume, prefs };
  }

  // Record login session automatically
  static async recordLoginSession(userId, reqDetails, token) {
    try {
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

  // Dashboard Overview with Real Database Analytics
  static async getOverview(userId) {
    await this.ensureStudentRecords(userId);

    const user = await User.findById(userId)
      .populate("courses")
      .populate("courseProgress");

    const streak = await StudentStreak.findOne({ userId });
    const resume = await StudentResume.findOne({ userId });
    const notifications = await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });

    const totalEnrolled = user.courses ? user.courses.length : 0;
    
    // Real Course Progress Calculations
    let completedCoursesCount = 0;
    let inProgressCount = 0;

    const allProgressRecords = await CourseProgress.find({ userId });
    
    for (const cp of allProgressRecords) {
      const course = await Course.findById(cp.courseID).populate({
        path: "courseContent",
        populate: { path: "subsections" },
      });

      let totalSubsections = 0;
      if (course?.courseContent) {
        course.courseContent.forEach((sec) => {
          totalSubsections += sec.subsections?.length || 0;
        });
      }

      const completedCount = cp.completedVideos ? cp.completedVideos.length : 0;

      if (totalSubsections > 0 && completedCount >= totalSubsections) {
        completedCoursesCount++;
      } else {
        inProgressCount++;
      }
    }

    const certificatesEarned = await Certificate.countDocuments({ userId });
    const hoursStudied = (streak.totalStudyMinutes / 60).toFixed(1);

    // Calculate real average quiz score
    const completedQuizAttempts = await QuizAttempt.find({
      studentId: userId,
      status: { $in: ["completed", "auto_submitted"] },
    });

    let avgQuizScore = 0;
    if (completedQuizAttempts.length > 0) {
      const totalPct = completedQuizAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0);
      avgQuizScore = Math.round(totalPct / completedQuizAttempts.length);
    }

    // Build real weekly activity breakdown from activity logs
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const sundayDate = new Date(now);
    sundayDate.setDate(now.getDate() - currentDayOfWeek);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let weeklyLecturesTotal = 0;

    const weeklyActivity = daysOfWeek.map((dayName, idx) => {
      const targetDate = new Date(sundayDate);
      targetDate.setDate(sundayDate.getDate() + idx);
      const dateStr = targetDate.toISOString().split("T")[0];

      const log = streak.activityLogs?.find((l) => l.date === dateStr);
      const minutes = log ? log.minutes : 0;
      const lectures = log ? log.lecturesCompleted : 0;

      weeklyLecturesTotal += lectures;

      return {
        day: dayName,
        minutes,
        lectures,
        date: dateStr,
      };
    });

    const targetLectures = streak.weeklyGoalLectures || 10;
    const weeklyGoalProgress = Math.min(
      100,
      Math.round((weeklyLecturesTotal / targetLectures) * 100)
    );

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
        globalRank: streak.level > 5 ? "#1 Top Learner" : `#${Math.max(1, 10 - streak.level)} Scholar`,
        currentLevel: streak.level,
        learningXp: streak.totalXp,
        coins: streak.coins,
        badgesCount: streak.badges.length,
        achievementsCount: streak.achievements.length,
        avgQuizScore,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        weeklyGoalProgress,
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

    return {
      totalLogins: loginCount,
      failedAttempts: 0,
      activeDevicesCount: activeSessions.length,
      currentSession: activeSessions.find((s) => s.isCurrent) || sessions[0],
      sessionsHistory: sessions,
      securityAlerts: [],
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

  // Log Real Learning Activity & Compute Streak / XP
  static async logActivity(userId, { minutes = 15, lecturesCount = 0, quizzesCount = 0 }) {
    let streak = await StudentStreak.findOne({ userId });
    if (!streak) {
      await this.ensureStudentRecords(userId);
      streak = await StudentStreak.findOne({ userId });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

    const lastActive = streak.lastActiveDate;

    if (!lastActive) {
      streak.currentStreak = 1;
    } else if (lastActive === todayStr) {
      // Same day activity - streak stays same
    } else if (lastActive === yesterdayStr) {
      // Consecutive day - streak increments!
      streak.currentStreak += 1;
    } else {
      // Missed 1+ days - reset streak to 1
      streak.currentStreak = 1;
    }

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    const existingLogIndex = streak.activityLogs.findIndex((l) => l.date === todayStr);

    if (existingLogIndex >= 0) {
      streak.activityLogs[existingLogIndex].minutes += minutes;
      streak.activityLogs[existingLogIndex].lecturesCompleted += lecturesCount;
      streak.activityLogs[existingLogIndex].quizzesTaken += quizzesCount;
    } else {
      streak.activityLogs.push({
        date: todayStr,
        minutes,
        lecturesCompleted: lecturesCount,
        quizzesTaken: quizzesCount,
      });
    }

    streak.totalStudyMinutes += minutes;
    const addedXp = minutes * 5 + lecturesCount * 25 + quizzesCount * 50;
    streak.totalXp += addedXp;

    // Check level up (1000 XP per level)
    const oldLevel = streak.level;
    streak.level = Math.floor(streak.totalXp / 1000) + 1;
    streak.lastActiveDate = todayStr;

    if (streak.level > oldLevel) {
      streak.coins += 50; // Award 50 bonus coins on level up
      streak.achievements.push(`Reached Level ${streak.level}`);
    }

    await streak.save();

    // Emit Socket.IO real-time notification
    emitToUser(userId, "streak_updated", {
      currentStreak: streak.currentStreak,
      totalXp: streak.totalXp,
      level: streak.level,
      coins: streak.coins,
    });

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
    const attempts = await QuizAttempt.find({ studentId: userId, status: "completed" });

    return {
      learningVelocity: `${Math.round(streak.totalStudyMinutes / Math.max(1, streak.activityLogs.length))} mins/day average`,
      totalXp: streak.totalXp,
      level: streak.level,
      totalQuizzesCompleted: attempts.length,
    };
  }

  // Resume & Career Profile
  static async getResumeProfile(userId) {
    await this.ensureStudentRecords(userId);
    const resume = await StudentResume.findOne({ userId });

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
