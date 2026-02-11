import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaUserCircle, FaSignOutAlt, FaCog, FaTachometerAlt } from "react-icons/fa";
import { logout } from "../../slices/authSlice";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user = useSelector((state) => state?.profile?.user);
  const token = useSelector((state) => state?.auth?.token);

  if (!user || !token) return null; // Hide dropdown if not logged in

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
      icon: <FaTachometerAlt className="text-blue-500 text-sm" />,
      onClick: () => { navigate("/dashboard"); setIsDropdownOpen(false); }
    },
    {
      key: "profile",
      label: "Profile",
      icon: <FaUserCircle className="text-blue-500 text-sm" />,
      onClick: () => { navigate("/profile"); setIsDropdownOpen(false); }
    },
    {
      key: "settings",
      label: "Settings",
      icon: <FaCog className="text-blue-500 text-sm" />,
      onClick: () => { navigate("/settings"); setIsDropdownOpen(false); }
    },
    {
      key: "logout",
      label: "Logout",
      icon: <FaSignOutAlt className="text-red-500 text-sm" />,
      onClick: handleLogout,
      isDanger: true
    }
  ];

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 cursor-pointer group p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition"
      >
        <img
          src={user?.image || "/Images/defaultProfile.png"}
          alt={user?.firstName || "User"}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-white/20 group-hover:border-blue-500 transition"
        />
        <span className="hidden md:inline text-sm text-gray-700 dark:text-gray-200 font-medium group-hover:text-blue-600 transition">
          {user?.firstName || "User"}
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 z-50">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                item.isDanger
                  ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;


