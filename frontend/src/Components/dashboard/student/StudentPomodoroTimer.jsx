import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer, Coffee, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const StudentPomodoroTimer = ({ isDark }) => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("work"); // 'work' or 'break'

  useEffect(() => {
    let timer = null;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    } else if (secondsLeft === 0) {
      clearInterval(timer);
      setIsActive(false);
      if (mode === "work") {
        toast.success("Pomodoro Session Complete! Take a 5-minute break. 🎉");
        setMode("break");
        setSecondsLeft(5 * 60);
      } else {
        toast.success("Break Over! Ready for next focus session? 💪");
        setMode("work");
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl mb-8 flex flex-col justify-between ${cardBg}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Timer size={20} className="text-rose-500" /> Pomodoro Focus Timer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">25-minute deep work cycles for maximum coding productivity</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
          mode === "work" 
            ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        }`}>
          {mode === "work" ? "🔥 Focus Mode (25m)" : "☕ Short Break (5m)"}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center my-4">
        <div className="text-5xl font-black font-mono tracking-wider text-slate-100 my-2">
          {formatTime(secondsLeft)}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-2.5 rounded-2xl text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
              isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? "Pause Focus" : "Start Session"}
          </button>

          <button
            onClick={resetTimer}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-700/40 text-xs text-slate-400 flex justify-between items-center">
        <span>Today's Sessions: 4/6 Completed</span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <CheckCircle2 size={12} /> 100 Mins Deep Work
        </span>
      </div>
    </motion.div>
  );
};

export default StudentPomodoroTimer;
