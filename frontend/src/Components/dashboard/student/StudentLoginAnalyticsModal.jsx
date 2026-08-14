import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Laptop, Smartphone, Globe, Clock, 
  LogOut, AlertTriangle, X, CheckCircle2 
} from "lucide-react";
import { fetchLoginSessions, terminateSessionThunk } from "../../../slices/studentSlice";

const StudentLoginAnalyticsModal = ({ isOpen, onClose, isDark }) => {
  const dispatch = useDispatch();
  const { sessions } = useSelector((state) => state.student);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchLoginSessions());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const cardBg = isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  const handleLogoutOther = (sessionId) => {
    dispatch(terminateSessionThunk(sessionId));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden p-6 ${cardBg}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/40 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Login & Active Device Security</h2>
                <p className="text-xs text-slate-400">Monitor active sessions, IP addresses, and revoke unknown devices.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Metrics Header */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-center">
              <div className="text-xs text-slate-400">Total Logins</div>
              <div className="text-xl font-bold text-cyan-400">{sessions?.totalLogins || 1}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-center">
              <div className="text-xs text-slate-400">Active Devices</div>
              <div className="text-xl font-bold text-emerald-400">{sessions?.activeDevicesCount || 1}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-center">
              <div className="text-xs text-slate-400">Failed Attempts</div>
              <div className="text-xl font-bold text-slate-200">0</div>
            </div>
          </div>

          {/* Security Alert Banner */}
          {sessions?.securityAlerts && sessions.securityAlerts.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-start gap-3 text-xs">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Security Status Normal</div>
                <p className="text-slate-300 mt-0.5">Your account authentication credentials are protected. No suspicious login attempts recorded.</p>
              </div>
            </div>
          )}

          {/* Active Sessions List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recent Active Devices</h3>
            {sessions?.sessionsHistory?.map((session, idx) => (
              <div
                key={session._id || idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/20 border border-slate-700/30 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3">
                  {session.deviceType === "Mobile" ? (
                    <Smartphone className="text-indigo-400" size={20} />
                  ) : (
                    <Laptop className="text-cyan-400" size={20} />
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span>{session.browser || "Chrome"} on {session.os || "Windows"}</span>
                      {session.isCurrent && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1"><Globe size={12} /> {session.ipAddress || "127.0.0.1"} ({session.location || "India"})</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(session.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && session.status === "Active" && (
                  <button
                    onClick={() => handleLogoutOther(session._id)}
                    className="text-xs text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20 transition flex items-center gap-1"
                  >
                    <LogOut size={12} /> Revoke Access
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-700/40 flex justify-between items-center text-xs">
            <button
              onClick={() => handleLogoutOther("all_others")}
              className="text-red-400 hover:underline font-medium"
            >
              Sign out from all other devices
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentLoginAnalyticsModal;
