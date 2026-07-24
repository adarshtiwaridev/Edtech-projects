import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaTachometerAlt,
  FaChevronDown,
  FaBookOpen,
  FaPlusSquare,
  FaGraduationCap,
} from "react-icons/fa";
import { logout } from "../../slices/authSlice";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const profileUser = useSelector((state) => state.profile?.user);
  const authUser = useSelector((state) => state.auth?.user);
  const user = profileUser || authUser;
  const role = user?.accountType || user?.role;
  const { token } = useSelector((state) => state.auth);
  const [avatarVersion, setAvatarVersion] = useState(Date.now());

  useEffect(() => {
    if (user?.profilePicture) {
      setAvatarVersion(Date.now());
    }
  }, [user?.profilePicture]);

  const profilePicSrc = user?.profilePicture
    ? `${user.profilePicture}?t=${avatarVersion}`
    : "/Images/default-avatar.png";

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

  const menuItems = useMemo(() => {
    const base = [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: <FaTachometerAlt className="text-blue-500" />,
        path: "/dashboard",
      },
      {
        key: "profile",
        label: "My Profile",
        icon: <FaUserCircle className="text-blue-500" />,
        path: "/dashboard/my-profile",
      },
      {
        key: "settings",
        label: "Settings",
        icon: <FaCog className="text-blue-500" />,
        path: "/dashboard/setting",
      },
    ];

    if (role === "Teacher") {
      return [
        ...base,
        {
          key: "teacherCourses",
          label: "My Courses",
          icon: <FaBookOpen className="text-blue-500" />,
          path: "/dashboard/teacher/courses",
        },
        {
          key: "teacherCreateCourse",
          label: "Create Course",
          icon: <FaPlusSquare className="text-blue-500" />,
          path: "/dashboard/teacher/courses/create",
        },
      ];
    }

    if (role === "Student") {
      return [
        ...base,
        {
          key: "studentBrowse",
          label: "Browse Courses",
          icon: <FaGraduationCap className="text-blue-500" />,
          path: "/dashboard/student/browse",
        },
        {
          key: "studentMyCourses",
          label: "My Courses",
          icon: <FaBookOpen className="text-blue-500" />,
          path: "/dashboard/student/my-courses",
        },
      ];
    }

    return base;
  }, [role]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-x-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
      >
        <img
          src={profilePicSrc}
          alt={user?.firstName || "User"}
          className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/20"
        />
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">
            {user?.firstName || "User"}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-tighter">
            {role}
          </span>
        </div>
        <FaChevronDown
          size={10}
          className={`text-gray-400 transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-56 origin-top-right bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
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
