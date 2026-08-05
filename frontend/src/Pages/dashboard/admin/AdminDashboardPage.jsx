import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import { fetchDashboardStats, fetchRevenueCharts } from "../../../slices/adminSlice";
import useTheme from "../../../hooks/useTheme";

import AdminOverviewWidget from "../../../Components/dashboard/admin/AdminOverviewWidget";
import AdminAnalyticsGrid from "../../../Components/dashboard/admin/AdminAnalyticsGrid";
import AdminChartsSection from "../../../Components/dashboard/admin/AdminChartsSection";
import AdminQuickActions from "../../../Components/dashboard/admin/AdminQuickActions";
import AdminRecentTables from "../../../Components/dashboard/admin/AdminRecentTables";
import AdminSystemHealth from "../../../Components/dashboard/admin/AdminSystemHealth";
import AdminAiAssistantWidget from "../../../Components/dashboard/admin/AdminAiAssistantWidget";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, charts, loading } = useSelector((state) => state.admin || {});
  const user = useSelector((state) => state.auth.user || state.profile.user);
  const { isDark } = useTheme();

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRevenueCharts());
  }, [dispatch]);

  return (
    <DashboardLayout title="Enterprise Admin Command Center">
      <div className="space-y-6">
        {/* Top Header & Productivity Card */}
        <AdminOverviewWidget user={user} isDark={isDark} />

        {/* Quick Command Shortcuts Toolbar */}
        <AdminQuickActions isDark={isDark} />

        {/* 12 Metric Analytics Cards */}
        <AdminAnalyticsGrid stats={stats} isDark={isDark} />

        {/* Interactive Charts Section */}
        <AdminChartsSection charts={charts} isDark={isDark} />

        {/* Live Transaction & Enrollment Tables */}
        <AdminRecentTables isDark={isDark} />

        {/* Infrastructure & System Health Monitor */}
        <AdminSystemHealth isDark={isDark} />

        {/* AI Analytics Assistant Widget */}
        <AdminAiAssistantWidget isDark={isDark} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
