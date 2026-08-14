import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Users,
  Sparkles,
  X,
} from "lucide-react";
import apiClient from "../../../services/apiClient";
import toast from "react-hot-toast";

const AdminQuizRecordsPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnalyticsQuiz, setSelectedAnalyticsQuiz] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchQuizRecords = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/v1/quiz/records");
      setQuizzes(res.data?.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch quiz records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizRecords();
  }, []);

  const handleTogglePublish = async (quizId) => {
    try {
      const res = await apiClient.patch(`/v1/quiz/${quizId}/publish`);
      toast.success(res.data?.message || "Publish status updated");
      fetchQuizRecords();
    } catch (err) {
      toast.error(err.message || "Failed to update publish status");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this assessment paper?")) return;
    try {
      await apiClient.delete(`/v1/quiz/${quizId}`);
      toast.success("Quiz deleted successfully");
      fetchQuizRecords();
    } catch (err) {
      toast.error(err.message || "Failed to delete quiz");
    }
  };

  const handleOpenAnalytics = async (quiz) => {
    setSelectedAnalyticsQuiz(quiz);
    try {
      setAnalyticsLoading(true);
      const res = await apiClient.get(`/v1/quiz/${quiz._id}/analytics`);
      setAnalyticsData(res.data?.data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch detailed analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter((q) => q.isPublished).length;
  const totalAttempts = quizzes.reduce((sum, q) => sum + (q.totalAttempts || 0), 0);
  const avgPlatformPassRate =
    quizzes.length > 0
      ? Math.round(quizzes.reduce((sum, q) => sum + (q.passRate || 0), 0) / quizzes.length)
      : 0;

  return (
    <DashboardLayout title="Assessment Records & Instructor Analytics">
      <div className="space-y-8">
        {/* Banner Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5 w-fit mb-3">
              <Sparkles size={12} /> Quiz Management Ledger
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Assessment Records & Student Performance Analytics
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Inspect all created assessments, toggle live publish status, review student attempts, and audit exam analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin-quiz-builder"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
            >
              <Plus size={16} /> Create New Quiz
            </Link>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Quizzes</span>
              <FileText size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalQuizzes}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Published</span>
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{publishedQuizzes}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Student Attempts</span>
              <Users size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{totalAttempts}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Avg Pass Rate</span>
              <TrendingUp size={18} className="text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-2">{avgPlatformPassRate}%</p>
          </div>
        </div>

        {/* Search Bar & Table Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-600 dark:text-indigo-400" /> All Quiz Records ({filteredQuizzes.length})
            </h2>

            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quiz title or category..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Quiz Records Table */}
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">Loading quiz records...</div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">No quiz records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Quiz Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4 text-center">Attempts</th>
                    <th className="py-3 px-4 text-center">Avg Score</th>
                    <th className="py-3 px-4 text-center">Pass Rate</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredQuizzes.map((quiz) => {
                    const authorName = quiz.instructor
                      ? `${quiz.instructor.firstName || ""} ${quiz.instructor.lastName || ""}`.trim()
                      : "Kodemates Admin";

                    return (
                      <tr key={quiz._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                          {quiz.title}
                        </td>
                        <td className="py-3 px-4">{quiz.category || "General"}</td>
                        <td className="py-3 px-4 font-medium text-indigo-600 dark:text-indigo-300">{authorName}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                          {quiz.totalAttempts || 0}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {quiz.averageScore || 0}%
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {quiz.passRate || 0}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublish(quiz._id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition ${
                              quiz.isPublished
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {quiz.isPublished ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenAnalytics(quiz)}
                              className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-lg transition flex items-center gap-1"
                            >
                              <Eye size={12} /> Analytics
                            </button>
                            <button
                              onClick={() => handleDeleteQuiz(quiz._id)}
                              className="p-1.5 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Analytics Modal / Drawer */}
        {selectedAnalyticsQuiz && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedAnalyticsQuiz.title}
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Live Performance Ledger
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Category: {selectedAnalyticsQuiz.category} | Passing Threshold: {selectedAnalyticsQuiz.passingMarks}%
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAnalyticsQuiz(null)}
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {analyticsLoading || !analyticsData ? (
                  <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                    Loading student attempt records & analytics...
                  </div>
                ) : (
                  <>
                    {/* Overview Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Attempted</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                          {analyticsData.overview?.totalAttempts || 0} Students
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Pass Rate</p>
                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                          {analyticsData.overview?.passRate || 0}%
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Average Score</p>
                        <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                          {analyticsData.overview?.avgScore || 0}%
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Highest Score</p>
                        <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                          {analyticsData.overview?.highestScore || 0}%
                        </p>
                      </div>
                    </div>

                    {/* Student Attempts Table */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Student Attempts Log ({analyticsData.studentAttempts?.length || 0})
                      </h4>

                      {analyticsData.studentAttempts?.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No student attempts recorded for this assessment yet.</p>
                      ) : (
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                          <table className="w-full text-left text-xs text-slate-800 dark:text-slate-300">
                            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                <th className="py-2.5 px-4">Student Name</th>
                                <th className="py-2.5 px-4">Email</th>
                                <th className="py-2.5 px-4 text-center">Score</th>
                                <th className="py-2.5 px-4 text-center">Percentage</th>
                                <th className="py-2.5 px-4 text-center">Status</th>
                                <th className="py-2.5 px-4 text-right">Submitted At</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                              {analyticsData.studentAttempts.map((att) => {
                                const st = att.studentId || {};
                                const fullName = `${st.firstName || ""} ${st.lastName || ""}`.trim() || "Student Learner";

                                return (
                                  <tr key={att._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                                    <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{fullName}</td>
                                    <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{st.email || "N/A"}</td>
                                    <td className="py-2.5 px-4 text-center font-mono font-bold text-amber-600 dark:text-amber-400">
                                      {att.totalScore} pts
                                    </td>
                                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                      {att.percentage}%
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                      <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                          att.passed
                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                            : "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
                                        }`}
                                      >
                                        {att.passed ? "PASSED" : "FAILED"}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-4 text-right text-slate-500 dark:text-slate-400">
                                      {new Date(att.submitTime || att.createdAt).toLocaleDateString()}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminQuizRecordsPage;
