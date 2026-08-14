"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../slices/profileSlice";
import { fetchDashboardStats, fetchRevenueCharts } from "../slices/adminSlice";
import { 
  fetchStudentOverview, 
  fetchStudentResume, 
  fetchNotificationsThunk, 
  fetchPreferencesThunk 
} from "../slices/studentSlice";
import useTheme from "../hooks/useTheme";
import DashboardLayout from "../Components/dashboard/DashboardLayout";

// Student Components
import StudentFrontPageShowcase from "../Components/dashboard/student/StudentFrontPageShowcase";
import StudentOverviewHeader from "../Components/dashboard/student/StudentOverviewHeader";
import StudentQuickActions from "../Components/dashboard/student/StudentQuickActions";
import StudentContinueLearning from "../Components/dashboard/student/StudentContinueLearning";
import StudentLearningHeatmap from "../Components/dashboard/student/StudentLearningHeatmap";
import StudentChartsSection from "../Components/dashboard/student/StudentChartsSection";
import StudentPlacementDashboard from "../Components/dashboard/student/StudentPlacementDashboard";
import StudentSkillMatrix from "../Components/dashboard/student/StudentSkillMatrix";
import StudentPomodoroTimer from "../Components/dashboard/student/StudentPomodoroTimer";
import StudentAiAssistantWidget from "../Components/dashboard/student/StudentAiAssistantWidget";

// Modals
import StudentLoginAnalyticsModal from "../Components/dashboard/student/StudentLoginAnalyticsModal";
import StudentNotificationCenter from "../Components/dashboard/student/StudentNotificationCenter";
import StudentPersonalizationModal from "../Components/dashboard/student/StudentPersonalizationModal";

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
  const reduxToken = useSelector((state) => state.auth.token);
  const localToken = localStorage.getItem("token");
  const token = reduxToken || localToken;
  const loading = useSelector((state) => state.profile.loading);
  const profileError = useSelector((state) => state.profile.error);
  const adminState = useSelector((state) => state.admin || {});
  const studentState = useSelector((state) => state.student || {});
  const { isDark } = useTheme();

  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);

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
    if (token && isStudent) {
      dispatch(fetchStudentOverview());
      dispatch(fetchStudentResume());
      dispatch(fetchNotificationsThunk());
      dispatch(fetchPreferencesThunk());
    }
  }, [token, userData, loading, isAdmin, isStudent, dispatch]);

  if (!token) return null;

  if (loading && !userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-sm font-semibold text-slate-400">Loading Student Dashboard Portal...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 text-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-white">Unable to Load Student Profile</h2>
          <p className="text-xs text-slate-400">
            {profileError || "Your session credentials could not be verified with the backend."}
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => dispatch(fetchProfile())}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
            >
              Retry Loading
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
            >
              Re-login
            </button>
          </div>
        </div>
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

  // Render Dynamic Student View (Default)
  return (
    <DashboardLayout title="Enterprise Student Learning Portal">
      <div className="space-y-6 pb-12">
        {/* Recruiter Architecture Showcase */}
        <StudentFrontPageShowcase isDark={isDark} />

        {/* Student Welcome Banner, Streaks, & Progress Ring */}
        <StudentOverviewHeader
          user={userData}
          overview={studentState.overview}
          isDark={isDark}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          onToggleNotifications={() => setIsNotificationOpen(true)}
          unreadNotifCount={studentState.unreadNotificationsCount || 0}
        />

        {/* Quick Launch Commands */}
        <StudentQuickActions isDark={isDark} />

        {/* Continue Learning & Active Lectures */}
        <StudentContinueLearning isDark={isDark} />

        {/* Dynamic 52-Week Heatmap & Streak Engine */}
        <StudentLearningHeatmap streak={studentState.overview?.streak} isDark={isDark} />

        {/* Dynamic Telemetry Activity & Skill Velocity Charts */}
        <StudentChartsSection weeklyActivity={studentState.overview?.weeklyActivity} isDark={isDark} />

        {/* Career & Placement Readiness Hub */}
        <StudentPlacementDashboard resumeData={studentState.resumeData} isDark={isDark} />

        {/* Technical Proficiency Grid */}
        <StudentSkillMatrix isDark={isDark} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Pomodoro Focus Timer with DB Sync */}
          <StudentPomodoroTimer isDark={isDark} />

          {/* AI Learning Assistant */}
          <StudentAiAssistantWidget isDark={isDark} />
        </div>

        {/* Security & Device Session Modal */}
        <StudentLoginAnalyticsModal
          isOpen={isSecurityModalOpen}
          onClose={() => setIsSecurityModalOpen(false)}
          isDark={isDark}
        />

        {/* Smart Notifications Drawer */}
        <StudentNotificationCenter
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          isDark={isDark}
        />

        {/* Dashboard Customization Modal */}
        <StudentPersonalizationModal
          isOpen={isPrefModalOpen}
          onClose={() => setIsPrefModalOpen(false)}
          isDark={isDark}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
