import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaUserCircle, FaSignOutAlt, FaCog, FaTachometerAlt, FaChevronDown } from "react-icons/fa";
import { logout } from "../../slices/authSlice";

const ProfileDropdown = () => {
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
   
   console.log("ProfileDropdown - user:", user);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!token) return null; 

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
    setIsDropdownOpen(false);
  };

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt className="text-blue-500" />,
      // lowercase path matches App.jsx route definition
      path: "/dashboard"
    },
    {
      key: "profile",
      label: "My Profile",
      icon: <FaUserCircle className="text-blue-500" />,
      path: "/dashboard/my-profile"
    },
    {
      key: "settings",
      label: "Settings",
      icon: <FaCog className="text-blue-500" />,
      path: "/dashboard/setting"
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-x-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
      >
        <img
          src={user?.profilePicture }
          alt={user?.firstName}
          className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/20"
        />
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">
            {user?.firstName}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-tighter">
            {user?.accountType}
          </span>
        </div>
        <FaChevronDown size={10} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-56 origin-top-right bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
          
          {/* User Header Info (Mobile Friendly) */}
          <div className="px-4 py-3 bg-gray-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Signed in as</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.email}</p>
          </div>

          <div className="p-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  navigate(item.path);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
              >
                <span className="opacity-80">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="my-1 border-t dark:border-slate-800" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;