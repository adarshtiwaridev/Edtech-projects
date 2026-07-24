import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AdminQuiz() {
  const [step, setStep] = useState(1);
  const [quizInfo, setQuizInfo] = useState({ name: "", category: "", coverImage: "" });
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question: "",
    type: "mcq", // mcq or numerical
    options: ["", "", "", ""],
    answer: ""
  });

  // handle quiz metadata
  const handleQuizChange = (e) =>
    setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });

  // handle question input
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOption = (idx, val) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm({ ...form, options: opts });
  };

  const handleAnswer = (idx) => setForm({ ...form, answer: idx });

  const handleAddQuestion = (e) => {
    e.preventDefault();
    setQuestions([...questions, { ...form }]);
    setForm({ question: "", type: "mcq", options: ["", "", "", ""], answer: "" });
  };

  const handleSubmitQuiz = async () => {
    const payload = { ...quizInfo, questions };
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      alert("✅ Quiz saved successfully!");
      setQuizInfo({ name: "", category: "", coverImage: "" });
      setQuestions([]);
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving quiz!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-blue-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-10"
      >
        {/* Step Header */}
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          {step === 1 ? "🎯 Create New Quiz" : "📝 Add Questions"}
        </h2>

        {/* Step 1: Quiz Info */}
        {step === 1 && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <input
              name="name"
              value={quizInfo.name}
              onChange={handleQuizChange}
              placeholder="Quiz Name"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="category"
              value={quizInfo.category}
              onChange={handleQuizChange}
              placeholder="Category"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400"
            />
            <input
              name="coverImage"
              value={quizInfo.coverImage}
              onChange={handleQuizChange}
              placeholder="Cover Image URL"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 mt-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
            >
              Next ➡
            </button>
          </motion.div>
        )}

        {/* Step 2: Add Questions */}
        {step === 2 && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleAddQuestion} className="space-y-5">
              <input
                name="question"
                type="text"
                value={form.question}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400"
                placeholder="Enter question"
                required
              />

              {/* Type Selector */}
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-green-400"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="numerical">Numerical</option>
              </select>

              {/* MCQ Options */}
              {form.type === "mcq" && (
                <div className="grid grid-cols-2 gap-4">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={form.answer === idx}
                        onChange={() => handleAnswer(idx)}
                        name="answer"
                        className="accent-green-600"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOption(idx, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
                        placeholder={`Option ${idx + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Numerical Answer */}
              {form.type === "numerical" && (
                <input
                  type="number"
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-green-400"
                  placeholder="Correct numerical value"
                  required
                />
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
                >
                  ➕ Add Question
                </button>
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                >
                  💾 Save Quiz
                </button>
              </div>
            </form>

            {/* Current Questions */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4 text-gray-700">📋 Current Questions</h3>
              <ul className="space-y-3">
                {questions.map((q, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-50 rounded-xl p-4 border shadow-sm"
                  >
                    <span className="font-semibold">Q{i + 1}:</span> {q.question}{" "}
                    <span className="text-sm text-gray-500">({q.type})</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
