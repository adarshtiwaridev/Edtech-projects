import React, { useState } from "react";

// Example quiz data (replace/fetch from backend in real app)
const sampleQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    answer: 2
  },
  {
    id: 2,
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Jane Austen"],
    answer: 0
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: 1
  }
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleOption = (idx) => {
    const newSelected = [...selected];
    newSelected[current] = idx;
    setSelected(newSelected);
  };

  const handleNext = () => setCurrent((c) => c + 1);
  const handlePrev = () => setCurrent((c) => c - 1);

  const handleSubmit = () => setSubmitted(true);

  const score = selected.filter((opt, i) => opt === sampleQuestions[i].answer).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Quiz</h2>
        {!submitted ? (
          <>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">{sampleQuestions[current].question}</h3>
              <div className="space-y-3">
                {sampleQuestions[current].options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition focus:outline-none ${selected[current] === idx ? 'bg-indigo-200 border-indigo-400' : 'bg-gray-50 border-gray-200 hover:bg-indigo-50'}`}
                    onClick={() => handleOption(idx)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                disabled={current === 0}
                onClick={handlePrev}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
              >
                Previous
              </button>
              {current < sampleQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-green-600 text-white font-semibold"
                  disabled={selected.length < sampleQuestions.length}
                >
                  Submit
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-green-600">Quiz Submitted!</h3>
            <p className="mb-2">Your Score: <span className="font-bold">{score} / {sampleQuestions.length}</span></p>
            <button className="mt-4 px-6 py-2 rounded bg-indigo-500 text-white font-semibold" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
