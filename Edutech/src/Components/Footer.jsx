import React from 'react'
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Leftmost Column - Branding and Social Media */}
          <div className="space-y-6">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
             <img
              src="/Images/logo.png"
              alt="EduLerns Logo"
              className="w-15 h-15 object-contain"
            />
            </div>

            {/* Tagline */}
            <p className="text-white text-sm leading-relaxed">
              Get 26,000+ best online courses from us
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
                <FaTwitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
                <FaFacebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
                <FaLinkedin className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors duration-200">
                <FaInstagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Second Column - Explore Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  News & Articles
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Sign In/Registration
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Coming Soon
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Contacts
                </a>
              </li>
            </ul>
          </div>

          {/* Third Column - Additional Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Instructor
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-cyan-400 transition-colors duration-200 text-sm">
                  Instructor Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Rightmost Column - Contact Information and Subscription */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">Contact</h3>

            {/* Contact Details */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <FaPhone className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm">+92 (0088) 6823</span>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <FaEnvelope className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm">needhelp@company.com</span>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm">80 Broklyn Golden Street. New York. USA</span>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="space-y-3">
              <div className="flex rounded-xl">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 px-4 py-3 bg-white text-gray-800 rounded-l-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button className="px-4 py-3 bg-pink-500 hover:bg-pink-600 rounded-r-lg transition-colors duration-200 flex items-center justify-center">
                  <FaArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © Copyright reserved by Athanni-Softtech.com
            </p>
            <a src=""  rel='noopener norefer'></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer