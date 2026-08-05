import React from "react";
import { motion } from "framer-motion";
import { Calendar, Flame, CheckCircle2, Award } from "lucide-react";

const StudentLearningHeatmap = ({ isDark }) => {
  // Generate 52 weeks x 7 days mock contribution data
  const weeks = 24; // 24 weeks displayed for compact grid
  const daysPerWeek = 7;
  const generateData = () => {
    const grid = [];
    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const intensity = Math.floor(Math.random() * 5); // 0 (empty) to 4 (high)
        week.push(intensity);
      }
      grid.push(week);
    }
    return grid;
  };

  const dataGrid = generateData();

  const getColor = (level) => {
    switch (level) {
      case 1: return "bg-emerald-900/60 border-emerald-800";
      case 2: return "bg-emerald-700/80 border-emerald-600";
      case 3: return "bg-emerald-500 border-emerald-400";
      case 4: return "bg-emerald-400 shadow-md shadow-emerald-500/20";
      default: return isDark ? "bg-slate-800/40 border-slate-800" : "bg-slate-100 border-slate-200";
    }
  };

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl mb-8 ${cardBg}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" /> Learning Contribution Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Daily study activity & lecture completion log (Last 6 Months)</p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((l) => (
                <div key={l} className={`w-3 h-3 rounded-sm ${getColor(l)}`} />
              ))}
            </div>
            <span>More</span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/20">
            184 Submissions
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-[600px]">
          {dataGrid.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((val, dIdx) => (
                <div
                  key={dIdx}
                  title={`Study Log Day ${wIdx * 7 + dIdx}: ${val * 45} mins`}
                  className={`w-3.5 h-3.5 rounded-sm border transition-all duration-200 hover:scale-125 cursor-pointer ${getColor(val)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-700/40 text-xs">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-amber-400" />
          <div>
            <div className="text-slate-400">Current Streak</div>
            <div className="font-bold text-slate-200">7 Consecutive Days</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <div>
            <div className="text-slate-400">Active Days</div>
            <div className="font-bold text-slate-200">142 Days Total</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Award size={16} className="text-purple-400" />
          <div>
            <div className="text-slate-400">Longest Streak</div>
            <div className="font-bold text-slate-200">24 Days</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-400" />
          <div>
            <div className="text-slate-400">Average/Day</div>
            <div className="font-bold text-slate-200">1.8 Hours/Day</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentLearningHeatmap;
