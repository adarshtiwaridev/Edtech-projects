import React from "react";
import { motion } from "framer-motion";
import { Briefcase, FileCheck, Code2, Video, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

const StudentPlacementDashboard = ({ isDark }) => {
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
            <Briefcase size={20} className="text-emerald-500" /> Career & Placement Readiness Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Resume score, DSA progress, and mock interview evaluation</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
          <Sparkles size={14} /> 91% Job Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Resume Score */}
        <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <FileCheck size={16} className="text-blue-400" /> Resume Score
            </span>
            <span className="text-xs text-emerald-400 font-bold">Top 5%</span>
          </div>
          <div className="text-2xl font-black text-slate-100 mt-1">88 / 100</div>
          <p className="text-[11px] text-slate-400 mt-2">ATS Compatible • MERN Projects Included</p>
        </div>

        {/* LeetCode / DSA */}
        <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Code2 size={16} className="text-amber-400" /> LeetCode Solved
            </span>
            <span className="text-xs text-amber-400 font-bold">142 Problems</span>
          </div>
          <div className="text-2xl font-black text-slate-100 mt-1">142 Solved</div>
          <p className="text-[11px] text-slate-400 mt-2">82 Easy • 50 Medium • 10 Hard</p>
        </div>

        {/* Mock Interview */}
        <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Video size={16} className="text-purple-400" /> Mock Interview
            </span>
            <span className="text-xs text-purple-400 font-bold">Cleared</span>
          </div>
          <div className="text-2xl font-black text-slate-100 mt-1">92% Score</div>
          <p className="text-[11px] text-slate-400 mt-2">System Design & Technical Round</p>
        </div>

        {/* Job Readiness */}
        <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <TrendingUp size={16} className="text-emerald-400" /> Hiring Status
            </span>
            <span className="text-xs text-emerald-400 font-bold">Placement Ready</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">Tier 1 Target</div>
          <p className="text-[11px] text-slate-400 mt-2">Eligible for Campus Drives</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentPlacementDashboard;
