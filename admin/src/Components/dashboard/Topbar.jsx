import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import useTheme from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import ProfileDropdown from '../Auth/ProfileDropdown';

const Topbar = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.profile);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-6 shrink-0 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 lg:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center bg-gray-100 dark:bg-neutral-800 rounded-full px-4 py-2 border border-transparent focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none ml-2 text-sm text-gray-900 dark:text-gray-100 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition-colors"
        >
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="ml-2">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
