import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  PlusSquare, BookOpen, Users, DollarSign, Star, 
  Clock, TrendingUp, CheckCircle2, Eye, Edit3, Sparkles 
} from "lucide-react";
import { fetchTeacherCourses } from "../../../slices/courseSlice";

const TeacherDashboardView = ({ user, isDark }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teacherCourses = [], loading } = useSelector((state) => state.course || {});

  useEffect(() => {
    dispatch(fetchTeacherCourses());
  }, [dispatch]);

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white shadow-xl shadow-black/20" 
    : "bg-white border-slate-200 text-slate-900 shadow-md shadow-slate-200/50";

  const innerCardBg = isDark
    ? "bg-slate-800/40 border-slate-700/40 text-slate-200"
    : "bg-slate-50 border-slate-200 text-slate-800";

  const subTextColor = isDark ? "text-slate-400" : "text-slate-500";

  const totalStudents = teacherCourses.reduce((sum, c) => sum + (c.studentsEnrolled?.length || 0), 0);
  const totalEarnings = teacherCourses.reduce((sum, c) => sum + ((c.price || 0) * (c.studentsEnrolled?.length || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden backdrop-blur-xl`}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Verified Educator
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center gap-1">
                <Sparkles size={12} /> Instructor Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome Back, Professor {user?.firstName || "Teacher"}! 🎓
            </h1>
            <p className={`text-sm ${subTextColor} mt-1`}>
              Manage your published courses, track student enrollment growth, and publish new lecture content.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/teacher/courses/create")}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <PlusSquare size={18} /> Create New Course
          </button>
        </div>
      </motion.div>

      {/* Teacher Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <BookOpen size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10">Active</span>
          </div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${subTextColor}`}>My Created Courses</p>
          <h3 className="text-2xl font-black mt-1">{teacherCourses.length}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`p-5 rounded-2xl border ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10">+12%</span>
          </div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${subTextColor}`}>Total Enrolled Students</p>
          <h3 className="text-2xl font-black mt-1">{totalStudents}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-5 rounded-2xl border ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-purple-500 px-2 py-0.5 rounded-full bg-purple-500/10">Estimated</span>
          </div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${subTextColor}`}>Total Course Revenue</p>
          <h3 className="text-2xl font-black mt-1">₹{totalEarnings.toLocaleString()}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`p-5 rounded-2xl border ${cardBg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Star size={20} />
            </div>
            <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/10">4.9 / 5.0</span>
          </div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${subTextColor}`}>Instructor Rating</p>
          <h3 className="text-2xl font-black mt-1">4.9 ⭐</h3>
        </motion.div>
      </div>

      {/* Teacher's Created Courses List */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-500" /> My Published & Active Courses
            </h2>
            <p className={`text-xs ${subTextColor} mt-0.5`}>Manage sections, lectures, prices, and status</p>
          </div>

          <button
            onClick={() => navigate("/dashboard/teacher/courses")}
            className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 flex items-center gap-1"
          >
            View All Courses →
          </button>
        </div>

        {teacherCourses.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border ${innerCardBg}`}>
            <p className={`text-sm ${subTextColor} mb-3`}>You haven't created any courses yet.</p>
            <button
              onClick={() => navigate("/dashboard/teacher/courses/create")}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
            >
              + Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherCourses.slice(0, 4).map((course) => (
              <div key={course._id} className={`p-4 rounded-2xl border ${innerCardBg} flex items-center gap-4`}>
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"}
                  alt={course.courseName}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-700/40"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{course.courseName}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Price: <strong className="text-emerald-400">₹{course.price}</strong></span>
                    <span>Students: <strong className="text-blue-400">{course.studentsEnrolled?.length || 0}</strong></span>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {course.courseStatus || "Published"}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/dashboard/teacher/courses/${course._id}/edit`)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                  title="Edit Course"
                >
                  <Edit3 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDashboardView;
