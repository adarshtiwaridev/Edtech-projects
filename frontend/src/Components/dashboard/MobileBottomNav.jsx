import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { LayoutDashboard, BookOpen, ShoppingCart, User, Settings } from "lucide-react";
import useTheme from "../../hooks/useTheme";

const MobileBottomNav = () => {
  const { user } = useSelector((state) => state.profile || {});
  const { totalItems } = useSelector((state) => state.cart || {});
  const { isDark } = useTheme();

  const role = user?.accountType || user?.role || "Student";

  const getLinks = () => {
    if (role === "Admin") {
      return [
        { label: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Courses", path: "/dashboard/admin/courses", icon: BookOpen },
        { label: "Profile", path: "/dashboard/my-profile", icon: User },
        { label: "Settings", path: "/dashboard/setting", icon: Settings },
      ];
    } else if (role === "Teacher" || role === "Instructor") {
      return [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "My Courses", path: "/dashboard/teacher/courses", icon: BookOpen },
        { label: "Profile", path: "/dashboard/my-profile", icon: User },
        { label: "Settings", path: "/dashboard/setting", icon: Settings },
      ];
    }
    // Student
    return [
      { label: "Hub", path: "/dashboard", icon: LayoutDashboard },
      { label: "Courses", path: "/dashboard/student/browse", icon: BookOpen },
      { label: "Cart", path: "/dashboard/cart", icon: ShoppingCart, badge: totalItems },
      { label: "Profile", path: "/dashboard/my-profile", icon: User },
      { label: "Settings", path: "/dashboard/setting", icon: Settings },
    ];
  };

  const navLinks = getLinks();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-3 py-2 transition-colors duration-300 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[54px] min-h-[48px] transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-1">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 w-8 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full shadow-sm" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
