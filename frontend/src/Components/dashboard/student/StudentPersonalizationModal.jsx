import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Moon, Sun, Layout, Check, X } from "lucide-react";
import { updatePreferencesThunk } from "../../../slices/studentSlice";

const StudentPersonalizationModal = ({ isOpen, onClose, isDark }) => {
  const dispatch = useDispatch();
  const { preferences } = useSelector((state) => state.student);

  const [accent, setAccent] = useState(preferences?.accentColor || "emerald");
  const [theme, setTheme] = useState(preferences?.theme || "dark");

  if (!isOpen) return null;

  const handleSave = () => {
    dispatch(updatePreferencesThunk({ theme, accentColor: accent }));
    onClose();
  };

  const accents = [
    { id: "emerald", label: "Emerald Green", color: "bg-emerald-500" },
    { id: "indigo", label: "Indigo Blue", color: "bg-indigo-500" },
    { id: "violet", label: "Violet Purple", color: "bg-purple-500" },
    { id: "amber", label: "Amber Gold", color: "bg-amber-500" },
    { id: "cyan", label: "Cyan Tech", color: "bg-cyan-500" },
  ];

  const cardBg = isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-6 ${cardBg}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/40 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Palette size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Dashboard Personalization</h2>
                <p className="text-xs text-slate-400">Customize theme & accent color stored in database</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Accent Pickers */}
          <div className="space-y-4 mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Accent Theme Color</label>
            <div className="grid grid-cols-5 gap-2">
              {accents.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAccent(acc.id)}
                  className={`h-12 rounded-2xl flex items-center justify-center transition border ${acc.color} ${
                    accent === acc.id ? "ring-2 ring-white border-white scale-105" : "opacity-80 border-transparent"
                  }`}
                  title={acc.label}
                >
                  {accent === acc.id && <Check size={18} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-700/40 flex justify-end gap-2 text-xs">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold">
              Cancel
            </button>
            <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-semibold text-white">
              Save Preferences
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentPersonalizationModal;
