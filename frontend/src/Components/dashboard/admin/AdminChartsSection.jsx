import React from "react";
import { motion } from "framer-motion";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminChartsSection = ({ charts, isDark }) => {
  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  // Revenue & Student Growth Line Chart Data
  const growthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Students Registered",
        data: [120, 190, 300, 500, 620, 850, 1100, 1420],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Revenue (₹ in 10k)",
        data: [15, 22, 38, 52, 68, 92, 120, 155],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Top Courses Sales Data
  const courseSalesData = {
    labels: charts?.courseSales?.map((c) => c.name) || ["Full Stack MERN", "React Masterclass", "DSA Bootcamp", "Python AI/ML", "DevOps Pro"],
    datasets: [
      {
        label: "Course Revenue (₹)",
        data: charts?.courseSales?.map((c) => c.revenue) || [185000, 124000, 98000, 76000, 54000],
        backgroundColor: [
          "rgba(99, 102, 241, 0.85)",
          "rgba(16, 185, 129, 0.85)",
          "rgba(245, 158, 11, 0.85)",
          "rgba(236, 72, 153, 0.85)",
          "rgba(14, 165, 233, 0.85)",
        ],
        borderRadius: 8,
      },
    ],
  };

  // Category Distribution Doughnut Data
  const categoryData = {
    labels: ["Web Development", "Data Structure & Algorithms", "Data Science & AI", "Cloud & DevOps", "Design & UI/UX"],
    datasets: [
      {
        data: [42, 24, 18, 10, 6],
        backgroundColor: [
          "#6366F1",
          "#10B981",
          "#F59E0B",
          "#EC4899",
          "#0EA5E9",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#94A3B8" : "#475569",
          font: { family: "Inter, sans-serif", size: 12 },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? "#64748B" : "#64748B" },
      },
      y: {
        grid: { color: isDark ? "rgba(51, 65, 85, 0.3)" : "rgba(226, 232, 240, 0.6)" },
        ticks: { color: isDark ? "#64748B" : "#64748B" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#94A3B8" : "#475569",
          boxWidth: 12,
          padding: 15,
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Student Growth & Revenue Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`lg:col-span-2 p-6 rounded-3xl border shadow-xl backdrop-blur-xl ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> Platform Growth & Revenue Trend
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time student registration and revenue accumulation</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
              2026 Analytics
            </span>
          </div>
        </div>

        <div className="h-72">
          <Line data={growthData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Category Breakdown Doughnut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <PieChart size={20} className="text-indigo-500" /> Course Categories
          </h2>
          <span className="text-xs text-slate-400">By Enrollment %</span>
        </div>

        <div className="h-56 relative flex items-center justify-center">
          <Doughnut data={categoryData} options={doughnutOptions} />
          <div className="absolute flex flex-col items-center pointer-events-none">
            <span className="text-2xl font-black">100%</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Distribution</span>
          </div>
        </div>
      </motion.div>

      {/* Top Course Revenue Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`lg:col-span-3 p-6 rounded-3xl border shadow-xl backdrop-blur-xl ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-500" /> Top Performing Courses by Revenue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Revenue breakdown of highest converting courses</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
            Top 5 Courses
          </span>
        </div>

        <div className="h-64">
          <Bar data={courseSalesData} options={chartOptions} />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminChartsSection;
