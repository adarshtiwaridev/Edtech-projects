import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  PlusSquare, FolderPlus, UserCheck, FileText, Tag, 
  Send, Megaphone, Download, Upload, BarChart2 
} from "lucide-react";
import toast from "react-hot-toast";

const QuickActionButton = ({ icon: Icon, label, colorClass, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="p-4 rounded-2xl border border-slate-700/40 bg-slate-800/40 hover:bg-slate-800/80 transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 group backdrop-blur-md shadow-sm"
  >
    <div className={`p-3 rounded-xl ${colorClass} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
      <Icon size={20} />
    </div>
    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{label}</span>
  </motion.button>
);

const AdminQuickActions = ({ isDark }) => {
  const navigate = useNavigate();

  const handleExportData = (type) => {
    toast.success(`Exporting platform ${type} report...`);
  };

  const handleBroadcast = () => {
    toast.success("Broadcast notification sent to all active users!");
  };

  const actions = [
    {
      icon: PlusSquare,
      label: "Create Course",
      colorClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      onClick: () => navigate("/dashboard/teacher/courses/create"),
    },
    {
      icon: FileText,
      label: "Create AI Quiz",
      colorClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      onClick: () => navigate("/admin-quiz-builder"),
    },
    {
      icon: BarChart2,
      label: "Quiz Records",
      colorClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      onClick: () => navigate("/dashboard/admin/quiz-records"),
    },
    {
      icon: FolderPlus,
      label: "Add Category",
      colorClass: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
      onClick: () => navigate("/dashboard/admin/categories"),
    },
    {
      icon: UserCheck,
      label: "Approve Teachers",
      colorClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      onClick: () => navigate("/dashboard/admin/teachers"),
    },
    {
      icon: Tag,
      label: "Manage Coupons",
      colorClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      onClick: () => toast.info("Coupon Management Opened"),
    },
    {
      icon: Send,
      label: "Broadcast Alert",
      colorClass: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
      onClick: handleBroadcast,
    },
    {
      icon: Download,
      label: "Export CSV",
      colorClass: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
      onClick: () => handleExportData("CSV"),
    },
    {
      icon: FileText,
      label: "Export PDF",
      colorClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      onClick: () => handleExportData("PDF"),
    },
  ];

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl mb-8 ${cardBg}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BarChart2 size={20} className="text-indigo-500" /> Admin Command Center & Quick Actions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Instant operational shortcuts for platform administration</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
          8 Quick Actions
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {actions.map((act, idx) => (
          <QuickActionButton key={idx} {...act} />
        ))}
      </div>
    </motion.div>
  );
};

export default AdminQuickActions;
