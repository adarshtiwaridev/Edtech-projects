import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Flame, Trophy, Zap, Target, BookOpen, Clock, 
  Award, Sparkles, Star, TrendingUp, Compass 
} from "lucide-react";

const StudentOverviewHeader = ({ user, isDark }) => {
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17) setGreeting("Good Evening");
    else setGreeting("Good Morning");
  }, []);

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Student Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`lg:col-span-2 p-6 rounded-3xl border shadow-xl backdrop-blur-xl relative overflow-hidden ${cardBg}`}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Level 14 Scholar
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Flame size={14} className="fill-amber-500 text-amber-500 animate-pulse" /> 7 Day Learning Streak 🔥
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {greeting}, {user?.firstName || "Student"}! 🚀
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              "Consistency is the key to mastering code and cracking dream tech offers."
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <Trophy size={28} className="text-amber-400" />
            <div>
              <div className="text-xs text-slate-400">Global Rank</div>
              <div className="text-lg font-black text-amber-400">#4 Top 1%</div>
            </div>
          </div>
        </div>

        {/* Student Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 pt-4 border-t border-slate-700/40">
          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={14} className="text-blue-400" /> Hours Studied
            </div>
            <div className="text-xl font-extrabold mt-1">42.5 Hrs</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Zap size={14} className="text-amber-400" /> Total XP
            </div>
            <div className="text-xl font-extrabold mt-1">8,450 XP</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <BookOpen size={14} className="text-emerald-400" /> Courses Active
            </div>
            <div className="text-xl font-extrabold mt-1">3 Courses</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/30">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Award size={14} className="text-purple-400" /> Certificates
            </div>
            <div className="text-xl font-extrabold mt-1">4 Earned</div>
          </div>
        </div>
      </motion.div>

      {/* Learning Progress Ring Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" /> Weekly Goal Progress
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            84% Done
          </span>
        </div>

        <div className="flex items-center justify-around my-3">
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
                className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                strokeDasharray="84, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black">84%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Weekly Goal</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span>Target: 10 Lectures</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-indigo-400" />
              <span>Completed: 8/10</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-700/40 text-xs text-slate-400 flex justify-between items-center">
          <span>Next Milestone: Level 15</span>
          <span className="font-semibold text-indigo-400">+150 XP needed</span>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentOverviewHeader;
