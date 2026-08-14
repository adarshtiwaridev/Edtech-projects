import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Users, BookOpen, CreditCard, ArrowUpRight, Award } from "lucide-react";
import apiClient from "../../../services/apiClient";

const TeacherEarningsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/v1/enhanced/instructor/analytics");
        setData(res.data?.data);
      } catch (err) {
        console.error("Failed to load instructor analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl animate-pulse space-y-4">
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-slate-800 rounded-2xl"></div>
          <div className="h-24 bg-slate-800 rounded-2xl"></div>
          <div className="h-24 bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Net Earnings (85%)</p>
            <h3 className="text-xl font-bold text-white">₹{data.netEarnings}</h3>
            <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-0.5">
              <TrendingUp size={10} /> After 15% Platform Cut
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Students</p>
            <h3 className="text-xl font-bold text-white">{data.totalStudentsCount}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Enrolled across courses</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Courses</p>
            <h3 className="text-xl font-bold text-white">{data.totalCoursesCount}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Published & monetization ready</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Gross Sales</p>
            <h3 className="text-xl font-bold text-white">₹{data.totalGrossRevenue}</h3>
            <p className="text-[10px] text-purple-400 mt-0.5">Platform Cut: ₹{data.platformFee}</p>
          </div>
        </div>
      </div>

      {/* Course Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          Course Sales & Revenue Ledger
        </h3>

        {data.courseBreakdown?.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No courses published yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Course Title</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Students</th>
                  <th className="p-3">Gross Revenue</th>
                  <th className="p-3 rounded-r-xl">Net Payout (85%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.courseBreakdown.map((course) => (
                  <tr key={course.courseId} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-white flex items-center gap-3">
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"}
                        alt={course.title}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="truncate max-w-xs">{course.title}</span>
                    </td>
                    <td className="p-3">₹{course.price}</td>
                    <td className="p-3">{course.studentsEnrolledCount}</td>
                    <td className="p-3 font-semibold text-slate-200">₹{course.grossRevenue}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{course.netPayout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherEarningsDashboard;
