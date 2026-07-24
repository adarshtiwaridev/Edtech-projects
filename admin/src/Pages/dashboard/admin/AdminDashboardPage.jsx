import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  Users, BookOpen, DollarSign, Activity, 
  UserCheck, UserX, Clock 
} from "lucide-react";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import { fetchDashboardStats, fetchRevenueCharts } from "../../../slices/adminSlice";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ icon: Icon, title, value, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {value !== undefined ? value : "..."}
        </h3>
      </div>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, charts, loading } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRevenueCharts());
  }, [dispatch]);

  const chartData = {
    labels: charts?.courseSales?.map((c) => c.name) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: charts?.courseSales?.map((c) => c.revenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Top 5 Courses by Revenue' },
    },
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} title="Total Users" value={stats?.totalUsers} colorClass="bg-blue-100 text-blue-600" />
        <StatCard icon={UserCheck} title="Students" value={stats?.totalStudents} colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Activity} title="Teachers" value={stats?.totalTeachers} colorClass="bg-purple-100 text-purple-600" />
        <StatCard icon={DollarSign} title="Total Revenue" value={`₹${stats?.totalRevenue || 0}`} colorClass="bg-green-100 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Clock} title="Pending Teachers" value={stats?.pendingTeachers} colorClass="bg-amber-100 text-amber-600" />
        <StatCard icon={UserCheck} title="Approved Teachers" value={stats?.approvedTeachers} colorClass="bg-teal-100 text-teal-600" />
        <StatCard icon={UserX} title="Rejected Teachers" value={stats?.rejectedTeachers} colorClass="bg-rose-100 text-rose-600" />
        <StatCard icon={BookOpen} title="Total Courses" value={stats?.totalCourses} colorClass="bg-indigo-100 text-indigo-600" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        {charts?.courseSales && charts.courseSales.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500">
            {loading ? "Loading Chart Data..." : "No revenue data available"}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
