import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  ShieldAlert,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import apiClient from "../services/apiClient";
import toast from "react-hot-toast";

const StudentQuizAttemptScreen = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1800); // 30 mins default
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Initialize Quiz Attempt
  useEffect(() => {
    const initAttempt = async () => {
      try {
        setLoading(true);
        // Fetch details
        const detailsRes = await apiClient.get(`/v1/quiz/${quizId}`);
        const { quiz, questions: fetchedQuestions } = detailsRes.data?.data || {};

        setQuizData(quiz);
        setQuestions(fetchedQuestions || []);
        setTimeLeftSeconds((quiz?.durationMinutes || 30) * 60);

        // Start Attempt
        const attemptRes = await apiClient.post(`/v1/quiz/${quizId}/start`);
        const resData = attemptRes.data;

        if (resData?.alreadyCompleted && resData?.data?._id) {
          toast.success("Redirecting to completed attempt results...", { id: "attempt-init" });
          navigate(`/quiz-result/${resData.data._id}`);
          return;
        }

        if (resData?.data?._id) {
          setAttemptId(resData.data._id);
        }
      } catch (err) {
        toast.error(err.message || "Failed to initialize quiz attempt");
      } finally {
        setLoading(false);
      }
    };
    if (quizId) initAttempt();
  }, [quizId, navigate]);

  // Timed Countdown Clock
  useEffect(() => {
    if (loading || !quizData) return;
    if (timeLeftSeconds <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeftSeconds, loading, quizData]);

  // Anti-Cheat Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          toast.error(`⚠️ Warning: Tab switch detected! (${nextCount}/5 allowed)`, {
            icon: "🚨",
            duration: 5000,
          });
          return nextCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 10-Second Auto-Save Progress
  useEffect(() => {
    if (!attemptId) return;
    const autoSaveInterval = setInterval(async () => {
      try {
        const payloadAnswers = Object.entries(userAnswers).map(([qId, ans]) => ({
          questionId: qId,
          selectedAnswer: ans,
        }));
        await apiClient.put(`/v1/quiz/attempt/${attemptId}/save`, {
          answers: payloadAnswers,
          tabSwitchCount,
        });
      } catch (_) {}
    }, 10000);
    return () => clearInterval(autoSaveInterval);
  }, [attemptId, userAnswers, tabSwitchCount]);

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const toggleBookmark = (qId) => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      toast.loading("Evaluating answers & generating AI analysis report...", {
        id: "eval-quiz",
      });

      const payloadAnswers = Object.entries(userAnswers).map(([qId, ans]) => ({
        questionId: qId,
        selectedAnswer: ans,
      }));

      const res = await apiClient.post(`/v1/quiz/attempt/${attemptId}/submit`, {
        answers: payloadAnswers,
        tabSwitchCount,
      });

      toast.success("Exam submitted & evaluated successfully!", { id: "eval-quiz" });
      navigate(`/quiz-result/${attemptId}`);
    } catch (err) {
      toast.error(err.message || "Failed to submit exam", { id: "eval-quiz" });
      setSubmitting(false);
    }
  };

  if (loading || !quizData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
          Initializing Secure Anti-Cheat Exam Portal...
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || {};
  const currentQId = currentQ._id || currentIndex;
  const isAnswered = userAnswers[currentQId] !== undefined;
  const isBookmarked = markedForReview.has(currentQId);

  const formatTime = (secs) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top Fixed Exam Navigation Bar */}
      <header className="px-6 py-4 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {quizData.title}
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Live Secure Exam
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Category: {quizData.category} | Passing Threshold: {quizData.passingMarks}%
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-600 dark:text-amber-400 font-mono font-bold text-sm">
            <Clock size={16} />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Anti-Cheat Tab Switch Counter */}
          {tabSwitchCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl font-bold">
              <ShieldAlert size={14} /> Tab Switches: {tabSwitchCount}/5
            </div>
          )}

          <button
            onClick={handleFinalSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
          >
            <Send size={14} /> Submit Exam
          </button>
        </div>
      </header>

      {/* Main Question & Navigator Body */}
      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left Column: Question Card */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Topic: {currentQ.topic || "General"}
                </span>
              </div>

              <button
                onClick={() => toggleBookmark(currentQId)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  isBookmarked
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? "Marked for Review" : "Mark Review"}
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
              {currentQ.questionText || "Loading question statement..."}
            </h2>

            {/* MCQ Options */}
            <div className="space-y-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = userAnswers[currentQId] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQId, idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-700 dark:text-indigo-200 font-semibold"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs">
                      <strong className="mr-2 text-indigo-600 dark:text-indigo-400">
                        {String.fromCharCode(65 + idx)}.
                      </strong>
                      {opt}
                    </span>
                    {isSelected && <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Previous / Next Actions */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 mt-8">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1 transition"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
              }
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition shadow-lg shadow-indigo-600/20"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              Question Palette
            </h3>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const qId = q._id || idx;
                const answered = userAnswers[qId] !== undefined;
                const bookmarked = markedForReview.has(qId);
                const isCurrent = idx === currentIndex;

                let btnClass = "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400";
                if (isCurrent) btnClass = "ring-2 ring-indigo-500 bg-indigo-600 text-white";
                else if (answered) btnClass = "bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:text-emerald-400";
                else if (bookmarked) btnClass = "bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-400";

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl font-mono text-xs font-bold border transition ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette Legend */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500"></span>
              <span>Answered ({Object.keys(userAnswers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500"></span>
              <span>Marked for Review ({markedForReview.size})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800"></span>
              <span>Unanswered ({Math.max(0, questions.length - Object.keys(userAnswers).length)})</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentQuizAttemptScreen;
