import React from "react";
import { motion } from "framer-motion";
import { 
  Users, UserCheck, Activity, DollarSign, BookOpen, Layers, 
  TrendingUp, Award, Star, Clock, CheckCircle2 
} from "lucide-react";

const StatCard = ({ icon: Icon, title, value, change, isPositive, color, isDark, index }) => {
  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 hover:border-indigo-500/50" 
    : "bg-white border-slate-200 hover:border-indigo-500/50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg backdrop-blur-md group ${cardBg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
          }`}>
            <TrendingUp size={12} className={isPositive ? "" : "transform rotate-180"} />
            {change}
          </span>
        )}
      </div>

      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
        {value !== undefined ? value : "0"}
      </h3>
    </motion.div>
  );
};

const AdminAnalyticsGrid = ({ stats, isDark }) => {
  const cards = [
    {
      icon: Users,
      title: "Total Users",
      value: stats?.totalUsers !== undefined ? stats.totalUsers : 0,
      change: stats?.rangeNewUsers ? `+${stats.rangeNewUsers} new` : "Live",
      isPositive: true,
      color: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    },
    {
      icon: UserCheck,
      title: "Active Students",
      value: stats?.totalStudents !== undefined ? stats.totalStudents : 0,
      change: "Enrolled",
      isPositive: true,
      color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    },
    {
      icon: Activity,
      title: "Instructors",
      value: stats?.totalTeachers !== undefined ? stats.totalTeachers : 0,
      change: "Approved",
      isPositive: true,
      color: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
    },
    {
      icon: DollarSign,
      title: "Total Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: "Gross",
      isPositive: true,
      color: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    },
    {
      icon: BookOpen,
      title: "Total Courses",
      value: stats?.totalCourses !== undefined ? stats.totalCourses : 0,
      change: `${stats?.publishedCourses || 0} Pub.`,
      isPositive: true,
      color: "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20",
    },
    {
      icon: Layers,
      title: "Categories",
      value: stats?.totalCategories !== undefined ? stats.totalCategories : 0,
      change: "Active",
      isPositive: true,
      color: "bg-sky-500/10 text-sky-500 border border-sky-500/20",
    },
    {
      icon: TrendingUp,
      title: "Monthly Revenue",
      value: `₹${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      change: "30-Day",
      isPositive: true,
      color: "bg-teal-500/10 text-teal-500 border border-teal-500/20",
    },
    {
      icon: CheckCircle2,
      title: "Today's Enrollments",
      value: stats?.todayEnrollments !== undefined ? stats.todayEnrollments : 0,
      change: "Today",
      isPositive: true,
      color: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
    },
    {
      icon: Award,
      title: "Certificates Issued",
      value: stats?.certificatesIssued !== undefined ? stats.certificatesIssued : 0,
      change: "Verified",
      isPositive: true,
      color: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    },
    {
      icon: Activity,
      title: "Completion Rate",
      value: `${stats?.completionRate !== undefined ? stats.completionRate : 0}%`,
      change: "Average",
      isPositive: true,
      color: "bg-violet-500/10 text-violet-500 border border-violet-500/20",
    },
    {
      icon: Star,
      title: "Average Rating",
      value: `${stats?.avgRating !== undefined ? stats.avgRating : 5.0} / 5.0`,
      change: "Positive",
      isPositive: true,
      color: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    },
    {
      icon: Clock,
      title: "Pending Approvals",
      value: stats?.pendingTeachers !== undefined ? stats.pendingTeachers : 0,
      change: "Pending",
      isPositive: false,
      color: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} isDark={isDark} index={idx} />
      ))}
    </div>
  );
};

export default AdminAnalyticsGrid;
