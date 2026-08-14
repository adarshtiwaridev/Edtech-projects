import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Timer, Zap, CheckCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { logActivityThunk } from "../../../slices/studentSlice";

const StudentPomodoroTimer = ({ isDark }) => {
  const dispatch = useDispatch();
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("work"); // work (25m), shortBreak (5m), longBreak (15m)
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      clearInterval(interval);
      setIsActive(false);

      if (mode === "work") {
        setCompletedSessions((prev) => prev + 1);
        // Log study activity to backend!
        dispatch(logActivityThunk({ minutes: 25, lecturesCount: 1, quizzesCount: 0 }));
        alert("🎉 Pomodoro Session Completed! 25 study minutes & +125 XP logged to database!");
        setMode("shortBreak");
        setSecondsLeft(5 * 60);
      } else {
        setMode("work");
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode, dispatch]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === "work") setSecondsLeft(25 * 60);
    else if (mode === "shortBreak") setSecondsLeft(5 * 60);
    else setSecondsLeft(15 * 60);
  };

  const changeMode = (newMode, minutes) => {
    setMode(newMode);
    setIsActive(false);
    setSecondsLeft(minutes * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
  };

  const cardBg = isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${cardBg}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Timer size={20} className="text-indigo-400" /> Deep Work Pomodoro Focus Timer
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Zap size={12} /> Syncs XP Live
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center gap-2 mb-6 bg-slate-800/40 p-1.5 rounded-2xl border border-slate-700/40">
          <button
            onClick={() => changeMode("work", 25)}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${
              mode === "work" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            25M Deep Work
          </button>
          <button
            onClick={() => changeMode("shortBreak", 5)}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${
              mode === "shortBreak" ? "bg-emerald-500 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            5M Break
          </button>
          <button
            onClick={() => changeMode("longBreak", 15)}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${
              mode === "longBreak" ? "bg-cyan-500 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            15M Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="text-6xl font-black tracking-tighter text-indigo-400 font-mono">
            {formatTime(secondsLeft)}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 size={14} className="text-emerald-400" /> Completed Sessions Today: {completedSessions}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-700/40">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-extrabold text-sm transition shadow-lg ${
            isActive
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
              : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20"
          }`}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          {isActive ? "Pause Focus" : "Start Focus Session"}
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default StudentPomodoroTimer;
