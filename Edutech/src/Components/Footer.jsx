import React from 'react';
import { Link } from 'react-router-dom';
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send
} from 'lucide-react'; // Using Lucide to match the Navbar

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 border-t border-gray-100 dark:border-neutral-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Brand & Identity */}
          <div className="space-y-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="/Images/logo2.png" // Using the same logo as Navbar
                alt="EduLerns Logo"
                className="w-32 h-auto dark:brightness-200"
              />
            </Link>
            
            <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed max-w-xs">
              Empowering learners worldwide with over 26,000 premium courses taught by industry experts. Your future starts here.
            </p>

            <div className="flex space-x-4">
              {[Twitter, Facebook, Linkedin, Instagram].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="p-2.5 bg-gray-100 dark:bg-neutral-900 rounded-full hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all duration-300 group"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Platform</h3>
            <ul className="space-y-4">
              {['All Courses', 'Learning Paths', 'Instructor Pro', 'Enterprise', 'Scholarships'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white text-sm transition-colors duration-200 flex items-center group">
                    <span className="w-0 group-hover:w-4 transition-all duration-300 overflow-hidden text-blue-500">→</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Support</h3>
            <ul className="space-y-4">
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'Community', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white text-sm transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Newsletter</h3>
            
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-4 bg-gray-100 dark:bg-neutral-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
              <button className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                <Send size={18} />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 text-sm text-gray-500 dark:text-neutral-400">
                <MapPin size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <span>80 Brooklyn Golden Street, <br />New York, NY 11201</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-neutral-400">
                <Phone size={18} className="text-blue-600 shrink-0" />
                <span>+1 (212) 555-0198</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 dark:text-neutral-600 text-xs">
            © {currentYear} Athanni Softtech. All rights reserved. Built for the future of education.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors">Cookie Settings</a>
            <a href="#" className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;