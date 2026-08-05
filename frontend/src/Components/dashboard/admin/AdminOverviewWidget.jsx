import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sun, Flame, Trophy, CheckSquare, Bell, Sparkles, 
  TrendingUp, Award, Target, Calendar, Clock, CloudSun 
} from "lucide-react";

const AdminOverviewWidget = ({ user, isDark }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Welcome & Time Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`lg:col-span-2 p-6 rounded-3xl border shadow-xl relative overflow-hidden backdrop-blur-xl ${cardBg}`}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                Enterprise Admin
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Flame size={14} className="fill-amber-500" /> 14 Day Admin Streak
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              👋 Welcome back, {user?.firstName || "Admin"}!
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              "The secret of getting ahead is getting started."
            </p>
          </div>

          {/* Time & Weather */}
          <div className="flex items-center gap-4 bg-slate-800/40 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-amber-400 border-r border-slate-700/60 pr-3.5">
              <CloudSun size={24} />
              <div>
                <div className="text-xs text-slate-400 font-medium">New Delhi</div>
                <div className="text-sm font-bold">28°C Sunny</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {formattedDate}
              </div>
              <div className="text-base font-mono font-bold flex items-center gap-1 text-indigo-400">
                <Clock size={14} /> {formattedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 pt-4 border-t border-slate-700/40">
          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <CheckSquare size={14} className="text-emerald-400" /> Tasks Pending
            </div>
            <div className="text-xl font-extrabold mt-1">8 Tasks</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Bell size={14} className="text-sky-400" /> Notifications
            </div>
            <div className="text-xl font-extrabold mt-1">12 Unread</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Target size={14} className="text-purple-400" /> Weekly Goal
            </div>
            <div className="text-xl font-extrabold mt-1">85% Done</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Award size={14} className="text-amber-400" /> Admin Level
            </div>
            <div className="text-xl font-extrabold mt-1">Tier 4 ⭐</div>
          </div>
        </div>
      </motion.div>

      {/* Daily Productivity & Streak Progress Ring Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between backdrop-blur-xl relative overflow-hidden ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-500" /> Productivity Score
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +14% vs Last Week
          </span>
        </div>

        <div className="flex items-center justify-around my-2">
          {/* SVG Progress Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700/40"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 stroke-current transition-all duration-1000 ease-out"
                strokeDasharray="92, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black">92%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Efficiency</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-400" />
              <div>
                <div className="text-xs text-slate-400">Total XP</div>
                <div className="text-sm font-bold">14,250 XP</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-rose-500" />
              <div>
                <div className="text-xs text-slate-400">Longest Streak</div>
                <div className="text-sm font-bold">28 Days</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-700/40 text-xs text-slate-400 flex justify-between items-center">
          <span>Daily Goal: 10 Audits</span>
          <span className="font-semibold text-emerald-400">9/10 Completed</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverviewWidget;
