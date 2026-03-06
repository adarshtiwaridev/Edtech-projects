"use client";
import React, { useEffect } from 'react';
import { User, Mail, Phone, Shield, BookOpen, Clock, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '../slices/profileSlice';
import useTheme from '../hooks/useTheme';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userData, loading } = useSelector(state => state.profile);
  const token = useSelector(state => state.auth.token);

  const { isDark, toggleTheme } = useTheme();

  // redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // fetch profile once when component mounts (if not already loaded)
  useEffect(() => {
    if (token && !userData && !loading) {
      dispatch(fetchProfile());
    }
  }, [token, userData, loading, dispatch]);

  const themeClass = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";
  const cardClass = isDark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200";

  if (!token) return null; // early return while redirecting

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClass} p-4 md:p-8 font-sans`}>
      {/* Header */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm mt-1`}>
            Welcome back, {userData?.firstName || 'User'}
          </p>
        </div>

        {/* theme toggle pill (same as navbar) */}
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
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <section className={`lg:col-span-1 border rounded-3xl p-6 flex flex-col items-center text-center ${cardClass} shadow-xl`}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img 
              src={userData?.profilePicture} 
              alt="Profile" 
              className="relative w-32 h-32 rounded-full object-cover border-4 border-slate-800 shadow-2xl"
            />
          </div>
          <h2 className="mt-6 text-xl font-bold">{userData?.firstName} {userData?.lastName}</h2>
          <span className="px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {userData?.accountType?.toUpperCase()}
          </span>

          <div className="w-full mt-8 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-slate-500" />
              <span className="truncate">{userData?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-slate-500" />
              <span>{userData?.mobile}</span>
            </div>
          </div>
        </section>

        {/* Stats & Activity Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stat Box 1 */}
            <div className={`p-6 border rounded-2xl ${cardClass} hover:border-blue-500/50 transition-colors`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><BookOpen /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Enrolled Courses</p>
                  <p className="text-2xl font-bold">{userData?.courses?.length || 0}</p>
                </div>
              </div>
            </div>
            {/* Stat Box 2 */}
            <div className={`p-6 border rounded-2xl ${cardClass} hover:border-purple-500/50 transition-colors`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Shield /></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Account Status</p>
                  <p className="text-2xl font-bold">Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Section */}
          <div className={`p-6 border rounded-2xl ${cardClass}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 italic">Joined on {new Date(userData?.createdAt).toLocaleDateString()}</p>
              <div className={`h-2 w-full rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="h-full bg-blue-500 rounded-full w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
              <p className="text-xs text-slate-500">Course Progress: 66% Complete</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;