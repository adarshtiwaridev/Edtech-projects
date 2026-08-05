import React from "react";
import { motion } from "framer-motion";
import { Server, Database, HardDrive, Cpu, Activity, ShieldCheck, Zap } from "lucide-react";

const SystemMetric = ({ label, value, status, percent, color, icon: Icon }) => (
  <div className="p-3.5 rounded-2xl bg-slate-800/30 border border-slate-700/40">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Icon size={16} className={color} />
        {label}
      </div>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {status}
      </span>
    </div>
    <div className="text-sm font-bold">{value}</div>
    {percent !== undefined && (
      <div className="w-full bg-slate-700/40 rounded-full h-1.5 mt-2 overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${percent}%` }} />
      </div>
    )}
  </div>
);

const AdminSystemHealth = ({ isDark }) => {
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
            <Server size={20} className="text-emerald-500" /> Infrastructure & System Health Monitor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time status of backend services, database, & cloud storage</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck size={14} /> 100% Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <SystemMetric
          label="REST API"
          value="200 OK (38ms latency)"
          status="Healthy"
          percent={98}
          color="text-emerald-400"
          icon={Activity}
        />
        <SystemMetric
          label="MongoDB Atlas"
          value="Connected (12ms ping)"
          status="Online"
          percent={95}
          color="text-blue-400"
          icon={Database}
        />
        <SystemMetric
          label="Cloudinary CDN"
          value="14.2 GB / 50 GB"
          status="Normal"
          percent={28}
          color="text-indigo-400"
          icon={HardDrive}
        />
        <SystemMetric
          label="Server CPU"
          value="18% Usage (4 Cores)"
          status="Optimal"
          percent={18}
          color="text-purple-400"
          icon={Cpu}
        />
        <SystemMetric
          label="Redis Cache"
          value="99.4% Hit Rate"
          status="Active"
          percent={99}
          color="text-amber-400"
          icon={Zap}
        />
      </div>
    </motion.div>
  );
};

export default AdminSystemHealth;
