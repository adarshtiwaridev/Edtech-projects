import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  LayoutDashboard, BookOpen, Settings, LogOut, X, Users, Grid, Heart, Compass
} from "lucide-react";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.profile || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.accountType || user?.role || "Student";

  const getNavLinks = () => {
    const commonLinks = [
      { name: "Learning Hub", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Profile", path: "/dashboard/my-profile", icon: <Compass size={20} /> },
      { name: "Settings", path: "/dashboard/setting", icon: <Settings size={20} /> },
    ];

    if (role === "Student") {
      return [
        ...commonLinks,
        { name: "Browse Courses", path: "/dashboard/student/browse", icon: <BookOpen size={20} /> },
        { name: "Enrolled Courses", path: "/dashboard/student/my-courses", icon: <BookOpen size={20} /> },
        { name: "Assessments & Quizzes", path: "/quiz", icon: <Grid size={20} /> },
        { name: "My Cart", path: "/dashboard/cart", icon: <Heart size={20} /> },
      ];
    } else if (role === "Teacher" || role === "Instructor") {
      return [
        ...commonLinks,
        { name: "My Courses", path: "/dashboard/teacher/courses", icon: <BookOpen size={20} /> },
        { name: "AI Quiz Builder", path: "/admin-quiz-builder", icon: <Grid size={20} /> },
        { name: "Quiz Records", path: "/dashboard/admin/quiz-records", icon: <Grid size={20} /> },
      ];
    } else if (role === "Admin") {
      return [
        { name: "Admin Dashboard", path: "/dashboard/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Manage Courses", path: "/dashboard/admin/courses", icon: <BookOpen size={20} /> },
        { name: "AI Quiz Builder", path: "/admin-quiz-builder", icon: <Grid size={20} /> },
        { name: "Quiz Records", path: "/dashboard/admin/quiz-records", icon: <Grid size={20} /> },
        { name: "Categories", path: "/dashboard/admin/categories", icon: <Grid size={20} /> },
        { name: "All Users", path: "/dashboard/admin/users", icon: <Users size={20} /> },
        { name: "Instructors", path: "/dashboard/admin/teachers", icon: <Users size={20} /> },
        { name: "Settings", path: "/dashboard/setting", icon: <Settings size={20} /> },
      ];
    }
    return commonLinks;
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/Images/logo2.png" alt="Logo" className="h-9 dark:invert transition-all" />
        </NavLink>
        <button
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Role Badge */}
      <div className="px-6 pt-4 pb-2">
        <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
          <span>{role} Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-all duration-200 border border-transparent hover:border-rose-500/20"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
