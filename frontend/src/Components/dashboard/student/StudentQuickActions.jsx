import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  PlayCircle, Video, FileText, Code2, Bot, Award, Sparkles, BookOpen 
} from "lucide-react";

const StudentQuickActions = ({ isDark }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Continue Learning",
      subtitle: "Resume video lecture",
      icon: <PlayCircle size={22} className="text-emerald-400" />,
      bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      onClick: () => navigate("/dashboard/student/browse"),
    },
    {
      title: "Join Live Class",
      subtitle: "Interactive session",
      icon: <Video size={22} className="text-indigo-400" />,
      bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      onClick: () => navigate("/dashboard/student/browse"),
    },
    {
      title: "Resume Showcase",
      subtitle: "Update recruiter skills",
      icon: <FileText size={22} className="text-cyan-400" />,
      bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
      onClick: () => navigate("/dashboard/setting"),
    },
    {
      title: "Practice DSA Coding",
      subtitle: "Solve daily challenge",
      icon: <Code2 size={22} className="text-amber-400" />,
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      onClick: () => navigate("/quiz"),
    },
    {
      title: "Ask AI Tutor",
      subtitle: "Instant code helper",
      icon: <Bot size={22} className="text-purple-400" />,
      bg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      onClick: () => alert("🤖 AI Learning Tutor initialized! Select any code concept for instant explanation."),
    },
    {
      title: "Download Certificates",
      subtitle: "Verified credentials",
      icon: <Award size={22} className="text-rose-400" />,
      bg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      onClick: () => navigate("/dashboard/student/my-courses"),
    },
  ];

  const cardBg = isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl mb-8 ${cardBg}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles size={20} className="text-amber-400" /> Student Command Quick Actions
        </h2>
        <span className="text-xs text-slate-400 font-medium">1-Click Launch Center</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.onClick}
            className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:border-slate-600 transition flex flex-col items-center text-center group"
          >
            <div className={`p-3 rounded-2xl border mb-2 group-hover:scale-110 transition ${act.bg}`}>
              {act.icon}
            </div>
            <div className="text-xs font-bold leading-snug">{act.title}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{act.subtitle}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default StudentQuickActions;
