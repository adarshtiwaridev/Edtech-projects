import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, CheckCheck, AlertCircle, Briefcase, Flame, 
  HelpCircle, X, ShieldAlert 
} from "lucide-react";
import { fetchNotificationsThunk, markNotificationReadThunk } from "../../../slices/studentSlice";

const StudentNotificationCenter = ({ isOpen, onClose, isDark }) => {
  const dispatch = useDispatch();
  const { notifications, unreadNotificationsCount } = useSelector((state) => state.student);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotificationsThunk());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    dispatch(markNotificationReadThunk("all"));
  };

  const handleMarkSingleRead = (id) => {
    dispatch(markNotificationReadThunk(id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Placement": return <Briefcase className="text-indigo-400" size={18} />;
      case "Streak": return <Flame className="text-amber-400" size={18} />;
      case "Security": return <ShieldAlert className="text-red-400" size={18} />;
      default: return <Bell className="text-cyan-400" size={18} />;
    }
  };

  const cardBg = isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden p-6 ${cardBg}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/40 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Smart Notification Center</h2>
                <p className="text-xs text-slate-400">{unreadNotificationsCount} unread system announcements & alerts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {notifications && notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkSingleRead(n._id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                    !n.isRead 
                      ? "bg-slate-800/50 border-amber-500/30" 
                      : "bg-slate-800/20 border-slate-700/30 opacity-75"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{n.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No notifications found. You are all caught up!
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-slate-700/40 flex justify-between items-center text-xs">
            <button
              onClick={handleMarkAllRead}
              className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
            >
              <CheckCheck size={14} /> Mark all as read
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentNotificationCenter;
