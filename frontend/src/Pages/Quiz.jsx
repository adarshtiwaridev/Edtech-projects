import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  UserCheck,
  RotateCcw,
} from "lucide-react";
import apiClient from "../services/apiClient";
import toast from "react-hot-toast";

export default function Quiz() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completedQuizzes: 0,
    pendingQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/v1/quiz/student/stats");
      const data = res.data?.data || {};

      if (data.stats) {
        setStats(data.stats);
      }
      if (data.assignedQuizzes) {
        setQuizzes(data.assignedQuizzes);
      }
    } catch (err) {
      try {
        const fallbackRes = await apiClient.get("/v1/quiz");
        const list = fallbackRes.data?.data || [];
        setQuizzes(list.map((q) => ({ ...q, status: "Pending" })));
        setStats({
          totalAssigned: list.length,
          completedQuizzes: 0,
          pendingQuizzes: list.length,
          averageScore: 0,
          highestScore: 0,
        });
      } catch (fErr) {
        setError("Failed to fetch assigned quizzes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
          Loading Assigned Quizzes & Student Metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 flex flex-col items-center transition-colors">
      <div className="max-w-6xl w-full space-y-8">
        {/* Banner Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5 w-fit mb-3">
              <Sparkles size={12} /> Student Assessment Portal
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              My Assigned Assessments & Quizzes
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Attempt assigned exams, test your knowledge, and monitor real-time score updates immediately upon submission.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
          >
            <RotateCcw size={14} /> Refresh Dashboard
          </button>
        </div>

        {/* 5 Top Summary Metric Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Assigned */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Assigned</span>
              <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stats.totalAssigned}</p>
          </div>

          {/* Completed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Completed</span>
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{stats.completedQuizzes}</p>
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Pending</span>
              <AlertCircle size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{stats.pendingQuizzes}</p>
          </div>

          {/* Average Score */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Avg Score</span>
              <TrendingUp size={18} className="text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-2">{stats.averageScore}%</p>
          </div>

          {/* Highest Score */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Highest Score</span>
              <Award size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{stats.highestScore}%</p>
          </div>
        </div>

        {/* Quiz Cards List */}
        {quizzes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-3xl w-fit mx-auto">
              <BookOpen size={36} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Assigned Quizzes Found</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              You currently have no active published assessments. Check back later once your instructor publishes new quizzes!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
              Assigned Assessments ({quizzes.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => {
                const isCompleted = quiz.status === "Completed";
                const teacherName = quiz.instructor
                  ? `${quiz.instructor.firstName || ""} ${quiz.instructor.lastName || ""}`.trim()
                  : "Kodemates Faculty";

                return (
                  <div
                    key={quiz._id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl transition flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                          {quiz.category || "General Subject"}
                        </span>

                        <span
                          className={`text-[10px] uppercase font-extrabold px-3 py-0.5 rounded-full border ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {isCompleted ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                        {quiz.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {quiz.description || "Official timed assessment evaluating core concepts, problem-solving, and practical logic."}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        <span className="flex items-center gap-1">
                          <UserCheck size={14} className="text-indigo-600 dark:text-indigo-400" /> {teacherName}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock size={14} className="text-amber-600 dark:text-amber-400" /> {quiz.durationMinutes || 30} mins
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {isCompleted ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            Score: {quiz.percentage || 0}% ({quiz.score || 0} pts)
                          </span>
                        ) : (
                          <span>
                            Passing: <strong className="text-emerald-600 dark:text-emerald-400">{quiz.passingMarks || 40}%</strong>
                          </span>
                        )}
                      </div>

                      {isCompleted ? (
                        <button
                          onClick={() => navigate(`/quiz-result/${quiz.attemptId}`)}
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition"
                        >
                          <Award size={14} /> View Result
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/attempt-quiz/${quiz._id}`)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition"
                        >
                          Start Quiz <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
