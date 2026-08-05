import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, Send, Code, BookOpen, Lightbulb, FileText } from "lucide-react";

const StudentAiAssistantWidget = ({ isDark }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi there! I am your AI Learning Assistant. Need help explaining a React hook, debug an Express API error, or generate lecture notes?",
    },
  ]);

  const handleSend = (presetQuery) => {
    const textToSend = presetQuery || query;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    if (!presetQuery) setQuery("");
    setLoading(true);

    setTimeout(() => {
      let reply = "Here is a quick summary: React hooks allow functional components to hook into state and lifecycle features without writing class components.";
      if (textToSend.toLowerCase().includes("express") || textToSend.toLowerCase().includes("api")) {
        reply = "In Express.js, middleware functions have access to the request object (req), response object (res), and next middleware function (next).";
      } else if (textToSend.toLowerCase().includes("mongodb") || textToSend.toLowerCase().includes("mongoose")) {
        reply = "Mongoose models provide a schema-based solution to model your application data in MongoDB with validation and type casting.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setLoading(false);
    }, 1200);
  };

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl mb-8 flex flex-col justify-between ${cardBg}`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 text-white shadow-md">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              Kodemates AI Tutor
              <Sparkles size={14} className="text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">Ask code questions & generate lecture notes</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Tutor Active
        </span>
      </div>

      {/* Preset Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "Explain React useEffect hook",
          "Summarize Node.js Async/Await",
          "Generate Mongoose Indexing Notes",
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/40 transition-colors flex items-center gap-1.5"
          >
            <Lightbulb size={12} className="text-amber-400" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="h-44 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 mb-4 text-xs font-sans">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                m.sender === "user"
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 text-slate-400 p-3 rounded-2xl text-xs animate-pulse">
              AI Tutor is generating answer...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI Tutor code questions, lecture summaries, or quiz prep..."
          className="flex-1 bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-md disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
};

export default StudentAiAssistantWidget;
