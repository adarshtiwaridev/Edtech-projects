import React from "react";
import { Menu, Search, Bell, Sun, Moon, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import useTheme from "../../hooks/useTheme";
import ProfileDropdown from "../Auth/ProfileDropdown";

const Topbar = ({ toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Global Search Input */}
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-950/60 rounded-2xl px-3.5 py-2 border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 transition-all shadow-inner">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, instructors, lectures..."
            className="bg-transparent border-none outline-none ml-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 w-56 md:w-72"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Instant Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
        </button>

        {/* Notification Bell */}
        <button
          title="System Notifications"
          className="relative p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div className="ml-1">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
