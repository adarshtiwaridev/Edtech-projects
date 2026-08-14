import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Cpu, Activity } from "lucide-react";

const StudentChartsSection = ({ weeklyActivity, isDark }) => {
  const days = weeklyActivity || [
    { day: "Sun", minutes: 30 },
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 60 },
    { day: "Wed", minutes: 25 },
    { day: "Thu", minutes: 90 },
    { day: "Fri", minutes: 50 },
    { day: "Sat", minutes: 40 },
  ];

  const maxMinutes = Math.max(...days.map((d) => d.minutes), 90);

  const cardBg = isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Weekly Activity Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-400" /> Weekly Learning Minutes (Live Database)
            </h2>
            <p className="text-xs text-slate-400">Daily study time telemetry parsed from video watching & focus sessions.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Avg 51 Mins/Day
          </span>
        </div>

        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
          {days.map((item, idx) => {
            const heightPercent = Math.round((item.minutes / maxMinutes) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">
                  {item.minutes}m
                </div>
                <div className="w-full bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden p-1">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-700 ease-out group-hover:from-emerald-500 group-hover:to-emerald-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400">{item.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Skill Growth Velocity Trend */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Activity size={20} className="text-indigo-400" /> Learning Velocity & Skill Growth
            </h2>
            <p className="text-xs text-slate-400">Weekly progress velocity against cohort benchmark.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            +18% Speed Growth
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1"><Cpu size={14} className="text-cyan-400" /> Data Structures & Algorithms</span>
              <span className="text-cyan-400">65% Target Mastery</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full transition-all duration-1000" style={{ width: "65%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1"><TrendingUp size={14} className="text-emerald-400" /> Full-Stack Architecture</span>
              <span className="text-emerald-400">85% Target Mastery</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: "85%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1"><BarChart3 size={14} className="text-amber-400" /> System Design & Databases</span>
              <span className="text-amber-400">72% Target Mastery</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: "72%" }} />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/40 text-xs text-slate-400 flex justify-between items-center">
          <span>Weekly Accuracy: <strong className="text-emerald-400">92%</strong></span>
          <span>Cohort Rank: <strong className="text-amber-400">Top 1%</strong></span>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentChartsSection;
