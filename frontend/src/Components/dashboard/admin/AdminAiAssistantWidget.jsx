import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, Send, HelpCircle, Lightbulb, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminAiAssistantWidget = ({ isDark }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello Admin! I am your AI Platform Analytics Assistant. Ask me anything about platform metrics, student retention, course revenue, or server status.",
    },
  ]);

  const handleSend = (presetQuery) => {
    const textToSend = presetQuery || query;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!presetQuery) setQuery("");
    setLoading(true);

    setTimeout(() => {
      let reply = "Based on current platform telemetry, student engagement has grown by +18.4% this week. MERN Stack Bootcamp holds the highest retention at 92.5%.";
      if (textToSend.toLowerCase().includes("revenue")) {
        reply = "Monthly revenue reached ₹84,500 (+14.3% YoY). Razorpay conversion rate is holding strong at 98.2%.";
      } else if (textToSend.toLowerCase().includes("teacher") || textToSend.toLowerCase().includes("instructor")) {
        reply = "There are currently 3 pending instructor applications awaiting admin review in the approval queue.";
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
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              Kodemates AI Analytics Assistant
              <Sparkles size={14} className="text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">Powered by Enterprise LLM Telemetry</p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          v2.4 Active
        </span>
      </div>

      {/* Preset Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "Analyze revenue trend",
          "Check pending instructor count",
          "Suggest platform improvements",
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

      {/* Chat Messages Log */}
      <div className="h-44 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 mb-4 text-xs font-sans">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
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
              AI is analyzing telemetry data...
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
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
          placeholder="Ask AI about platform metrics, course sales, or system performance..."
          className="flex-1 bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
};

export default AdminAiAssistantWidget;
