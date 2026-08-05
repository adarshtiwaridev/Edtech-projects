"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../slices/profileSlice";
import { fetchDashboardStats, fetchRevenueCharts } from "../slices/adminSlice";
import useTheme from "../hooks/useTheme";
import DashboardLayout from "../Components/dashboard/DashboardLayout";

// Student Components
import StudentOverviewHeader from "../Components/dashboard/student/StudentOverviewHeader";
import StudentContinueLearning from "../Components/dashboard/student/StudentContinueLearning";
import StudentLearningHeatmap from "../Components/dashboard/student/StudentLearningHeatmap";
import StudentSkillMatrix from "../Components/dashboard/student/StudentSkillMatrix";
import StudentPlacementDashboard from "../Components/dashboard/student/StudentPlacementDashboard";
import StudentPomodoroTimer from "../Components/dashboard/student/StudentPomodoroTimer";
import StudentAiAssistantWidget from "../Components/dashboard/student/StudentAiAssistantWidget";

// Teacher Components
import TeacherDashboardView from "../Components/dashboard/teacher/TeacherDashboardView";

// Admin Components
import AdminOverviewWidget from "../Components/dashboard/admin/AdminOverviewWidget";
import AdminAnalyticsGrid from "../Components/dashboard/admin/AdminAnalyticsGrid";
import AdminChartsSection from "../Components/dashboard/admin/AdminChartsSection";
import AdminQuickActions from "../Components/dashboard/admin/AdminQuickActions";
import AdminRecentTables from "../Components/dashboard/admin/AdminRecentTables";
import AdminSystemHealth from "../Components/dashboard/admin/AdminSystemHealth";
import AdminAiAssistantWidget from "../Components/dashboard/admin/AdminAiAssistantWidget";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.profile.user || state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.profile.loading);
  const adminState = useSelector((state) => state.admin || {});
  const { isDark } = useTheme();

  const role = userData?.accountType || userData?.role || "Student";
  const isAdmin = role === "Admin";
  const isTeacher = role === "Teacher" || role === "Instructor";
  const isStudent = role === "Student";

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token && !userData && !loading) {
      dispatch(fetchProfile());
    }
    if (token && isAdmin) {
      dispatch(fetchDashboardStats());
      dispatch(fetchRevenueCharts());
    }
  }, [token, userData, loading, isAdmin, dispatch]);

  if (!token) return null;

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Render Admin View
  if (isAdmin) {
    return (
      <DashboardLayout title="Enterprise Admin Command Center">
        <div className="space-y-6">
          <AdminOverviewWidget user={userData} isDark={isDark} />
          <AdminQuickActions isDark={isDark} />
          <AdminAnalyticsGrid stats={adminState.stats} isDark={isDark} />
          <AdminChartsSection charts={adminState.charts} isDark={isDark} />
          <AdminRecentTables isDark={isDark} />
          <AdminSystemHealth isDark={isDark} />
          <AdminAiAssistantWidget isDark={isDark} />
        </div>
      </DashboardLayout>
    );
  }

  // Render Teacher View
  if (isTeacher) {
    return (
      <DashboardLayout title="Instructor Management Portal">
        <TeacherDashboardView user={userData} isDark={isDark} />
      </DashboardLayout>
    );
  }

  // Render Student View (Default)
  return (
    <DashboardLayout title="Student Learning Hub">
      <div className="space-y-6">
        {/* Student Welcome Banner, Streaks, & Progress Ring */}
        <StudentOverviewHeader user={userData} isDark={isDark} />

        {/* Continue Learning & Pending Quizzes */}
        <StudentContinueLearning isDark={isDark} />

        {/* Learning Contribution Heatmap (GitHub Style) */}
        <StudentLearningHeatmap isDark={isDark} />

        {/* Career & Placement Readiness Hub */}
        <StudentPlacementDashboard isDark={isDark} />

        {/* Skill Proficiency & Tech Matrix */}
        <StudentSkillMatrix isDark={isDark} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pomodoro Focus Timer */}
          <StudentPomodoroTimer isDark={isDark} />

          {/* AI Learning Tutor Assistant */}
          <StudentAiAssistantWidget isDark={isDark} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
