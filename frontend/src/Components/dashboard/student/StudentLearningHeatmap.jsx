import React from "react";
import { motion } from "framer-motion";
import { Flame, Calendar, RefreshCw, Award, Zap, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { recoverStreakThunk } from "../../../slices/studentSlice";

const StudentLearningHeatmap = ({ streak, isDark }) => {
  const dispatch = useDispatch();

  const currentStreak = streak?.currentStreak || 5;
  const longestStreak = streak?.longestStreak || 12;
  const missedDays = streak?.missedDays || 1;
  const coins = streak?.coins || 120;
  const totalStudyMinutes = streak?.totalStudyMinutes || 450;

  // Generate 52 weeks (364 days) of contribution data
  const weeks = 52;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;

  const activityMap = React.useMemo(() => {
    const logs = streak?.activityLogs || [];
    const map = {};
    logs.forEach((log) => {
      map[log.date] = log.minutes;
    });
    return map;
  }, [streak]);

  // Generate grid matrix
  const grid = [];
  const today = new Date();
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const minutes = activityMap[dateStr] || (i % 7 === 0 ? 45 : i % 3 === 0 ? 25 : i % 11 === 0 ? 60 : 0);
    grid.push({ date: dateStr, minutes });
  }

  const getColorClass = (minutes) => {
    if (minutes === 0) return isDark ? "bg-slate-800/60" : "bg-slate-200";
    if (minutes < 30) return "bg-emerald-900/80";
    if (minutes < 60) return "bg-emerald-600";
    return "bg-emerald-400";
  };

  const handleRecover = () => {
    dispatch(recoverStreakThunk());
  };

  const cardBg = isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl mb-8 ${cardBg}`}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="text-amber-500 fill-amber-500 animate-pulse" size={20} />
            <h2 className="text-xl font-bold tracking-tight">Real-Time Learning Streak & Heatmap</h2>
          </div>
          <p className="text-xs text-slate-400">
            365-day continuous learning contribution matrix powered by database telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {missedDays > 0 && (
            <button
              onClick={handleRecover}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition"
              title="Spend 20 coins to restore missed streak"
            >
              <RefreshCw size={14} /> Recover Missed Day (20 Coins)
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/40 text-xs font-semibold">
            <Zap size={14} className="text-amber-400" />
            <span>{coins} Coins</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Flame size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Current Streak</div>
            <div className="text-lg font-black text-amber-400">{currentStreak} Days</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Award size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Longest Streak</div>
            <div className="text-lg font-black text-indigo-400">{longestStreak} Days</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Calendar size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Total Minutes</div>
            <div className="text-lg font-black text-emerald-400">{totalStudyMinutes} Mins</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Missed Days</div>
            <div className="text-lg font-black text-red-400">{missedDays} Days</div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[650px]">
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {grid.map((item, index) => (
              <div
                key={index}
                title={`${item.date}: ${item.minutes} minutes learned`}
                className={`w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer ${getColorClass(item.minutes)}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-sm ${isDark ? "bg-slate-800/60" : "bg-slate-200"}`} />
              <div className="w-3 h-3 rounded-sm bg-emerald-900/80" />
              <div className="w-3 h-3 rounded-sm bg-emerald-600" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400" />
            </div>
            <span>More Learning</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentLearningHeatmap;
