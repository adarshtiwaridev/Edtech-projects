import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, Github, Linkedin, Globe, CheckCircle2, 
  Award, Code2, Sparkles, ExternalLink, Edit3, Save 
} from "lucide-react";
import { useDispatch } from "react-redux";
import { updateStudentResumeThunk } from "../../../slices/studentSlice";

const StudentPlacementDashboard = ({ resumeData, isDark }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const resume = resumeData?.resume || {};
  const readinessScore = resumeData?.placementReadinessScore || 78;

  const [form, setForm] = useState({
    githubUrl: resume.githubUrl || "https://github.com",
    linkedinUrl: resume.linkedinUrl || "https://linkedin.com",
    portfolioUrl: resume.portfolioUrl || "https://portfolio.dev",
    placementStatus: resume.placementStatus || "Actively Looking for Internships / SDE Roles",
    dsaProgress: resume.dsaProgress || 65,
    systemDesignProgress: resume.systemDesignProgress || 55,
  });

  const handleSave = () => {
    dispatch(updateStudentResumeThunk(form));
    setIsEditing(false);
  };

  const cardBg = isDark ? "bg-slate-900/80 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl mb-8 ${cardBg}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Career & Placement Hub
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase size={22} className="text-indigo-400" /> SDE Placement Readiness Tracker
          </h2>
          <p className="text-xs text-slate-400">
            Real-time resume readiness score based on verified DSA, System Design, Projects, and Certificates.
          </p>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white transition shadow-lg shadow-indigo-500/20"
        >
          {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
          {isEditing ? "Save Placement Profile" : "Edit Portfolio Links"}
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Ring */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-3">
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
                strokeDasharray={`${readinessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-indigo-400">{readinessScore}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Readiness</span>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-200">Interview Ready Candidate</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <CheckCircle2 size={12} /> Eligible for Off-Campus Drives
          </div>
        </div>

        {/* Technical Proficiency Bars */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Code2 size={16} className="text-amber-400" /> Core Technical Mastery
          </h3>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Data Structures & Algorithms</span>
              <span className="text-amber-400">{form.dsaProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${form.dsaProgress}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Full-Stack Web Engineering</span>
              <span className="text-emerald-400">85%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `85%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>System Design & Architecture</span>
              <span className="text-cyan-400">{form.systemDesignProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${form.systemDesignProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Portfolio & Social Links */}
        <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-400" /> Recruiter Portfolio Connections
            </h3>

            {isEditing ? (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={form.linkedinUrl}
                    onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <a
                  href={form.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs font-semibold hover:border-indigo-500/50 transition"
                >
                  <span className="flex items-center gap-2">
                    <Github size={16} className="text-slate-200" /> GitHub Code Repositories
                  </span>
                  <ExternalLink size={14} className="text-slate-400" />
                </a>

                <a
                  href={form.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs font-semibold hover:border-indigo-500/50 transition"
                >
                  <span className="flex items-center gap-2">
                    <Linkedin size={16} className="text-blue-400" /> LinkedIn Professional Network
                  </span>
                  <ExternalLink size={14} className="text-slate-400" />
                </a>

                <a
                  href={form.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs font-semibold hover:border-indigo-500/50 transition"
                >
                  <span className="flex items-center gap-2">
                    <Globe size={16} className="text-emerald-400" /> Live Developer Portfolio
                  </span>
                  <ExternalLink size={14} className="text-slate-400" />
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Status: <strong className="text-indigo-400">{form.placementStatus}</strong></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentPlacementDashboard;
