import React, { useState } from "react";
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Award,
  Sparkles,
  Save,
  ArrowRight,
} from "lucide-react";
import apiClient, { postWithFallback } from "../services/apiClient";
import toast from "react-hot-toast";

const AdminQuizCreator = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const [quizInfo, setQuizInfo] = useState({
    title: "",
    description: "",
    category: "Technical Assessment",
    durationMinutes: 30,
    passingMarks: 40,
    negativeMarkingEnabled: false,
    perWrongAnswer: 0.25,
  });

  const [questions, setQuestions] = useState([
    {
      questionText: "What is the primary function of Virtual RAM in modern Operating Systems?",
      questionType: "mcq_single",
      options: [
        "To extend physical RAM using secondary storage swap space",
        "To accelerate GPU rendering speed",
        "To provide hardware encryption for disk drives",
        "To compress network packets",
      ],
      correctAnswer: 0,
      explanation: "Virtual memory maps virtual addresses to physical RAM or secondary storage swap space.",
      marks: 10,
      topic: "Operating Systems",
      difficulty: "medium",
    },
  ]);

  const [currentQ, setCurrentQ] = useState({
    questionText: "",
    questionType: "mcq_single",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    marks: 10,
    topic: "General",
    difficulty: "medium",
  });

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfFile(file);
    const formData = new FormData();
    formData.append("pdfFile", file);

    try {
      setLoading(true);
      toast.loading("Analyzing PDF paper locally...", { id: "pdf-ocr" });

      const data = await postWithFallback(
        ["/v1/quiz/pdf-extract", "/quiz/pdf-extract"],
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const extracted = data?.data;
      if (extracted) {
        setQuizInfo((prev) => ({
          ...prev,
          title: extracted.title || prev.title,
          category: extracted.category || prev.category,
        }));
        if (extracted.questions && extracted.questions.length > 0) {
          setQuestions(extracted.questions);
        }
        toast.success(`Successfully extracted ${extracted.questions?.length || 0} questions!`, {
          id: "pdf-ocr",
        });
        setStep(2);
      }
    } catch (err) {
      toast.error(err.message || "Failed to extract PDF question paper", { id: "pdf-ocr" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!currentQ.questionText.trim()) {
      toast.error("Please enter a question description.");
      return;
    }
    setQuestions((prev) => [...prev, { ...currentQ }]);
    setCurrentQ({
      questionText: "",
      questionType: "mcq_single",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      marks: 10,
      topic: "General",
      difficulty: "medium",
    });
    toast.success("Question added!");
  };

  const handleRemoveQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async () => {
    if (!quizInfo.title.trim()) {
      toast.error("Please specify a quiz title.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...quizInfo,
        negativeMarking: {
          enabled: quizInfo.negativeMarkingEnabled,
          perWrongAnswer: quizInfo.perWrongAnswer,
        },
        questions,
      };

      await postWithFallback(
        ["/v1/quiz/createQuiz"],
        payload
      );
      toast.success("Enterprise Quiz Created & Published! 🎉");
      setStep(1);
    } catch (err) {
      toast.error(err.message || "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 flex flex-col items-center transition-colors">
      <div className="max-w-5xl w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5 w-fit mb-2">
              <Sparkles size={12} /> AI Assessment Builder
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Enterprise Quiz & Examination Creator
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Upload PDF question papers for instant AI auto-parsing or build custom assessments manually.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(1)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                step === 1
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              1. Config & PDF Upload
            </button>
            <button
              onClick={() => setStep(2)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                step === 2
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              2. Questions ({questions.length})
            </button>
          </div>
        </div>

        {/* Step 1: Configuration & PDF Drag-and-Drop */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI PDF Uploader Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">AI PDF Question Parser</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Upload exam question paper (PDF/DOCX)
                    </p>
                  </div>
                </div>

                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500/50 bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group">
                  <Upload size={36} className="text-slate-400 group-hover:text-amber-500 transition mb-2" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {pdfFile ? pdfFile.name : "Click to select or drag PDF file here"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    Supports text & scanned PDFs up to 50MB
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sparkles size={14} className="text-amber-500 shrink-0" />
                <span>
                  Gemini AI automatically parses question statements, options, answer keys, and topic tags.
                </span>
              </div>
            </div>

            {/* Quiz Configuration Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                Assessment Metadata & Rules
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizInfo.title}
                  onChange={(e) => setQuizInfo({ ...quizInfo, title: e.target.value })}
                  placeholder="e.g. Data Structures & Algorithms Final Assessment"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={quizInfo.durationMinutes}
                    onChange={(e) =>
                      setQuizInfo({ ...quizInfo, durationMinutes: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={quizInfo.passingMarks}
                    onChange={(e) =>
                      setQuizInfo({ ...quizInfo, passingMarks: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Negative Marking Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quizInfo.negativeMarkingEnabled}
                    onChange={(e) =>
                      setQuizInfo({ ...quizInfo, negativeMarkingEnabled: e.target.checked })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Enable Negative Marking (-0.25 per wrong answer)
                  </span>
                </label>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20"
              >
                Proceed to Questions <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Question Editor & Review */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Add Question Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Plus size={18} className="text-indigo-600 dark:text-indigo-400" /> Add Assessment Question
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Question Statement
                  </label>
                  <input
                    type="text"
                    value={currentQ.questionText}
                    onChange={(e) => setCurrentQ({ ...currentQ, questionText: e.target.value })}
                    placeholder="Enter question prompt..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Topic Category
                  </label>
                  <input
                    type="text"
                    value={currentQ.topic}
                    onChange={(e) => setCurrentQ({ ...currentQ, topic: e.target.value })}
                    placeholder="e.g. Data Structures"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={currentQ.correctAnswer === idx}
                      onChange={() => setCurrentQ({ ...currentQ, correctAnswer: idx })}
                      className="accent-indigo-600"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const opts = [...currentQ.options];
                        opts[idx] = e.target.value;
                        setCurrentQ({ ...currentQ, options: opts });
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold rounded-xl transition"
                >
                  + Add Question to Pool
                </button>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Questions Pool ({questions.length})
                </h3>
                <button
                  onClick={handleSaveQuiz}
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Save size={14} /> Save & Publish Assessment
                </button>
              </div>

              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        <span className="text-indigo-600 dark:text-indigo-400">Q{idx + 1}.</span> {q.questionText}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                        <span className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md">
                          Topic: {q.topic}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-md">
                          Correct: Option {q.correctAnswer + 1}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizCreator;
