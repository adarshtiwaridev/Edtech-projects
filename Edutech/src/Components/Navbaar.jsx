import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  FaTimes
} from 'react-icons/fa';
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button } from "@heroui/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img src="/Images/logo2.png" alt="EduLerns Logo" className="w-28 h-20 object-contain" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <div className="flex items-center space-x-2 text-gray-700 group relative">
              <FaFileAlt className="w-5 h-5 text-gray-600" />
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button variant="bordered" className="text-gray-700 font-medium">
                    Pages
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Pages Navigation" variant="faded" className="bg-white rounded-lg shadow-lg p-4 min-w-[200px] font-sans text-gray-800">
                  <DropdownItem key="courses" href="/Courses" className="hover:bg-blue-50 rounded-md px-3 py-2">Courses</DropdownItem>
                  <DropdownItem key="policy" href="#" className="hover:bg-blue-50 rounded-md px-3 py-2">Policy</DropdownItem>
                  <DropdownItem key="educator-offers" href="#" className="hover:bg-blue-50 rounded-md px-3 py-2">Educator Offers</DropdownItem>
                  <DropdownItem key="coupon-codes" href="#" className="hover:bg-blue-50 rounded-md px-3 py-2">Coupon Codes</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <Link to="/courses" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
              <FaGraduationCap className="w-4 h-4" />
              <span>Courses</span>
            </Link>

            <Link to="/shop" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
              <FaStore className="w-4 h-4" />
              <span>Shop</span>
            </Link>

            <Link to="/about" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
              <FaInfoCircle className="w-4 h-4" />
              <span>About</span>
            </Link>

            <Link to="/contact" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 font-medium">
              <FaEnvelope className="w-4 h-4" />
              <span>Contact</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <FaSearch className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg relative">
              <FaShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium">
              <FaUser className="w-4 h-4" />
            </button>

            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 flex items-center space-x-2">
              <FaSignInAlt className="w-4 h-4" />
              <span>Try for Free</span>
            </button>
          </div>

          {/* Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

   {isOpen && (
  <div className="md:hidden bg-white shadow-lg border-t border-gray-200 rounded-b-lg p-6 space-y-4 animate-slide-down">
    <Link to="/" className="block text-gray-800 font-medium hover:text-blue-600 transition duration-200">
      Home
    </Link>

    <Link to="/courses" className="block text-gray-800 font-medium hover:text-blue-600 transition duration-200">
      Courses
    </Link>

    <Link to="/shop" className="block text-gray-800 font-medium hover:text-blue-600 transition duration-200">
      Shop
    </Link>

    <Link to="/about" className="block text-gray-800 font-medium hover:text-blue-600 transition duration-200">
      About
    </Link>

    <Link to="/contact" className="block text-gray-800 font-medium hover:text-blue-600 transition duration-200">
      Contact
    </Link>

    <Link to="/login" className="block text-gray-800 font-medium hover:text-blue-600 transition duration-200">
      Login
    </Link>
  </div>
)}

    </nav>
  );
};

export default Navbar;
