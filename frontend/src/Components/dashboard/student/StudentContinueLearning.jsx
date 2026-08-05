import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, Clock, CheckCircle2, Video, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentContinueLearning = ({ isDark }) => {
  const navigate = useNavigate();

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Resume Course Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`lg:col-span-2 p-6 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Continue Learning
            </span>
            <h2 className="text-xl font-bold mt-2">Full Stack MERN Web Development</h2>
            <p className="text-xs text-slate-400">Module 4: Advanced Node.js & Express Architecture</p>
          </div>

          <button
            onClick={() => navigate("/dashboard/student/browse")}
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg hover:scale-105 flex items-center gap-2 font-semibold text-xs"
          >
            <PlayCircle size={18} /> Resume Lecture
          </button>
        </div>

        {/* Course Progress Bar */}
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Lecture 18 of 24: Building REST APIs & Middleware</span>
            <span className="text-indigo-400">75% Completed</span>
          </div>
          <div className="w-full bg-slate-700/40 rounded-full h-2.5 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: "75%" }} />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1"><Clock size={14} /> Remaining: 45 mins</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 size={14} /> 18 Sections Passed</span>
        </div>
      </motion.div>

      {/* Pending Quizzes & Upcoming Live Class */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${cardBg}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Video size={16} className="text-rose-500" /> Upcoming Live Class
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Today 7:00 PM
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs">
            <div className="font-semibold text-slate-200">System Design & Microservices Architecture</div>
            <div className="text-slate-400 text-[11px] mt-1">Instructor: Adarsh Tiwari</div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FileText size={16} className="text-amber-400" /> Pending Assignment
            </h3>
            <span className="text-[10px] font-bold text-amber-400">Due Tomorrow</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs">
            <div className="font-semibold text-slate-200">Mongoose Schema Optimization & Indexing</div>
            <div className="text-slate-400 text-[11px] mt-1">Points: +100 XP</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentContinueLearning;
