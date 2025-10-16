import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHome,
  FaFileAlt,
  FaGraduationCap,
  FaStore,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import ProfileDropdown from "./Auth/ProfileDropdown";
const Navbaar = () => {
  const navigate = useNavigate();

const { token } = useSelector((state) => state.auth || {});
const { user } = useSelector((state) => state.profile || {});
const { totalItems } = useSelector((state) => state.cart || {});

  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path) => {
    if (!token && path !== "/login" && path !== "/signup") {
      toast.error("Please login to continue!");
      navigate("/login");
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/", icon: <FaHome /> },
    {
      label: "Pages",
      dropdown: [
        { label: "Courses", path: "/courses" },
        { label: "Policy", path: "#" },
        { label: "Educator Offers", path: "#" },
        { label: "Coupon Codes", path: "#" },
      ],
      icon: <FaFileAlt />,
    },
    { label: "Courses", path: "/courses", icon: <FaGraduationCap /> },
    { label: "Shop", path: "/shop", icon: <FaStore /> },
    { label: "About", path: "/about", icon: <FaInfoCircle /> },
    { label: "Contact", path: "/contact", icon: <FaEnvelope /> },
    { label: "Blogs", path: "/blogs", icon: <FaFileAlt /> },
    { label: "Quiz", path: "/quiz", icon: <FaGraduationCap /> },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/Images/logo2.png"
              alt="EduLerns Logo"
              className="w-28 h-20 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) =>
              item.dropdown ? (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-gray-700 group relative"
                >
                  {item.icon}
                  <Dropdown backdrop="blur">
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        className="text-gray-700 font-medium"
                      >
                        {item.label}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label={`${item.label} Navigation`}
                      variant="faded"
                      className="bg-white rounded-lg shadow-lg p-4 min-w-[200px] text-gray-800"
                    >
                      {item.dropdown.map((sub, idx) => (
                        <DropdownItem
                          key={idx}
                          onClick={() => handleNavigation(sub.path)}
                          className="hover:bg-blue-50 rounded-md px-3 py-2"
                        >
                          {sub.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart for non-instructor users */}
            {user && user.accountType !== "Instructor" && token && (
              <Link to="/dashboard/cart" className="relative">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg relative">
                  <FaShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems || 0}
                  </span>
                </button>
              </Link>
            )}

            {/* Login & Signup Buttons */}
            {!token && (
              <>
                <button
                  onClick={() => handleNavigation("/login")}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium"
                >
                  <FaUser className="w-4 h-4" />
                  <span>Login</span>
                </button>

                <Link to="/signup">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 flex items-center space-x-2 transition">
                    <FaSignInAlt className="w-4 h-4" />
                    <span>Try for Free</span>
                  </button>
                </Link>
              </>
            )}

            {/* User Dropdown */}
            {/* {token && user && (
             
            )
            } */}
         

          {/* Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200 rounded-b-lg p-6 space-y-4 animate-slide-down">
          {navItems.map((item, index) =>
            item.dropdown ? (
              <div key={index} className="space-y-2">
                <p className="font-semibold text-gray-700">{item.label}</p>
                {item.dropdown.map((sub, idx) => (
                  <Link
                    key={idx}
                    to={sub.path}
                    className="block text-gray-600 hover:text-blue-600 pl-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={index}
                to={item.path}
                className="block text-gray-800 font-medium hover:text-blue-600 transition duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}

          <div className="pt-4 border-t">
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 flex items-center justify-center space-x-2 transition"
              onClick={() => handleNavigation("/signup")}
            >
              <FaSignInAlt className="w-4 h-4" />
              <span>Try for Free</span>
            </button>
          </div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </nav>
  );
};

export default Navbaar;
