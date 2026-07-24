// NotFound.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 px-6">
      
      <div className="text-center max-w-lg">
        
        {/* Big 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text animate-pulse">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          The page you’re looking for doesn’t exist or has been moved.
          Let’s get you back on track.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300"
        >
          <FaHome />
          Go Back Home
        </button>

        {/* Decorative blur circle */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse hidden md:block"></div>

      </div>
    </div>
  );
};

export default NotFound;
