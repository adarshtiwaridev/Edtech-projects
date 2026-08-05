import React from "react";
import { motion } from "framer-motion";
import { Code, Cpu, Database, Layout, Terminal, MessageSquare, Layers } from "lucide-react";

const skills = [
  { name: "React 18 & Redux", percent: 90, color: "bg-cyan-500", icon: Layout },
  { name: "JavaScript ES6+", percent: 88, color: "bg-amber-400", icon: Code },
  { name: "Node.js & Express", percent: 82, color: "bg-emerald-500", icon: Terminal },
  { name: "MongoDB & Mongoose", percent: 85, color: "bg-green-500", icon: Database },
  { name: "Data Structures & Algo", percent: 78, color: "bg-indigo-500", icon: Cpu },
  { name: "HTML5 & Tailwind CSS", percent: 95, color: "bg-sky-400", icon: Layers },
  { name: "Communication & Leadership", percent: 86, color: "bg-purple-500", icon: MessageSquare },
];

const StudentSkillMatrix = ({ isDark }) => {
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
            <Cpu size={20} className="text-indigo-500" /> Skill Proficiency & Tech Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Verified skill levels across frontend, backend, and core CS</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
          7 Skills Audited
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold flex items-center gap-2">
                  <Icon size={16} className="text-slate-400" />
                  {s.name}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">{s.percent}%</span>
              </div>
              <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.percent}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`h-full rounded-full ${s.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StudentSkillMatrix;
