import React from "react";
import { motion } from "framer-motion";
import { 
  Server, ShieldCheck, Flame, BarChart2, Cpu, 
  Layers, Lock, Database, Sparkles, CheckCircle 
} from "lucide-react";

const StudentFrontPageShowcase = ({ isDark }) => {
  const highlights = [
    {
      title: "Real-Time Telemetry & Streak Engine",
      desc: "Automatic study minute tracking & 52-week activity contribution heat map backed by MongoDB schemas.",
      icon: <Flame className="text-amber-400" size={20} />,
    },
    {
      title: "Session Security & Device Monitoring",
      desc: "Device fingerprinting (IP, User-Agent, OS, Browser) with real-time remote device revocation.",
      icon: <ShieldCheck className="text-cyan-400" size={20} />,
    },
    {
      title: "SDE Placement Readiness Engine",
      desc: "Algorithmically calculates candidate interview readiness score from verified DSA & system design metrics.",
      icon: <Cpu className="text-indigo-400" size={20} />,
    },
    {
      title: "Smart Notification Center",
      desc: "Database notification tray featuring priority level tags, read/unread filters, and instant sync.",
      icon: <Layers className="text-emerald-400" size={20} />,
    },
  ];

  const cardBg = isDark 
    ? "bg-slate-950/90 border-slate-800 text-white" 
    : "bg-slate-900 border-slate-800 text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden mb-8 ${cardBg}`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 relative z-10 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Production Enterprise LMS Showcase
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Advanced Student Learning & Engineering Portal
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Designed and engineered with Next.js & Node.js REST standards, zero hardcoded values, real database session management, and live student progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            <CheckCircle size={16} /> Verified Database Connected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="p-2.5 rounded-xl bg-slate-800/60 w-fit mb-3 border border-slate-700/50">
              {item.icon}
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StudentFrontPageShowcase;
