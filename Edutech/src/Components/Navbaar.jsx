import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Sun, Moon, ShoppingCart, Menu, X, Search, ArrowRight 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ProfileDropdown from "./Auth/ProfileDropdown";

const Navbaar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { token } = useSelector((state) => state.auth || {});
  const { user } = useSelector((state) => state.profile || {});
  const { totalItems } = useSelector((state) => state.cart || {});

  // 1. Initial Theme Check
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 2. Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Toggle Function
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const navItems = [
  
    { label: "Shop", path: "/shop" },
    { label: "Blogs", path: "/blogs" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
      { label: "Courses", path: "/courses" },
    { label: "Quiz", path: "/quiz" },
  ];

  return (
    // Note the use of 'dark:bg-black' for that pitch black premium feel
    <nav className={`sticky top-0 z-[100] w-full transition-all duration-500 ${
      scrolled 
      ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl py-2 shadow-lg border-b border-gray-200/50 dark:border-white/10" 
      : "bg-white dark:bg-black py-4 border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          
          {/* Logo Section */}
          <Link to="/" className="relative group">
            <img 
              src="/Images/logo2.png" 
              alt="Logo" 
              className="w-24 h-auto dark:invert dark:brightness-200 transition-all duration-300" 
            />
          </Link>

          {/* Desktop Nav - Floating Pill */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-1 rounded-full transition-colors duration-300">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  location.pathname === item.path 
                  ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm" 
                  : "text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
         

            {/* THEME TOGGLE TRACK */}
            <div 
              onClick={toggleTheme}
              className="relative w-14 h-7 bg-gray-200 dark:bg-neutral-800 rounded-full cursor-pointer p-1 transition-colors duration-500 ring-1 ring-inset ring-black/5 dark:ring-white/10"
            >
              <div className={`absolute top-1 left-1 w-5 h-5 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${
                isDark ? "translate-x-7 bg-blue-600" : "translate-x-0 bg-white"
              }`}>
                {isDark ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-yellow-500" />}
              </div>
            </div>

            {/* CART */}
            {user?.accountType !== "Instructor" && token && (
              <Link to="/dashboard/cart" className="relative p-2 text-gray-600 dark:text-gray-300">
                <ShoppingCart size={22} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-[10px] text-white font-bold h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-black">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* AUTH SECTION */}
            {!token ? (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/signup" 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  Join Now <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <ProfileDropdown />
            )}

            {/* MOBILE MENU TOGGLE */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden p-2 text-gray-700 dark:text-white"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 top-0 bg-white dark:bg-black z-[110] transition-all duration-500 ease-in-out ${
        isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } lg:hidden`}>
        <div className="flex justify-end p-6">
          <button onClick={() => setIsOpen(false)} className="dark:text-white"><X size={32} /></button>
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-10 pb-20">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              to={item.path} 
              onClick={() => setIsOpen(false)}
              className="text-4xl font-bold dark:text-white tracking-tighter hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {!token && (
            <button 
              onClick={() => {navigate("/login"); setIsOpen(false);}} 
              className="text-xl font-medium text-gray-500 dark:text-gray-400 underline underline-offset-8"
            >
              Sign In to Account
            </button>
          )}
        </div>
      </div>

      <Toaster />
    </nav>
  );
};

export default Navbaar;