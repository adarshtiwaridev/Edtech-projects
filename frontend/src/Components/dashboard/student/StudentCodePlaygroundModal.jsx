import React, { useState } from "react";
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Code,
  Cpu,
  Sliders,
  FileCode,
} from "lucide-react";
import apiClient from "../../../services/apiClient";
import toast from "react-hot-toast";

const DEFAULT_SNIPPETS = {
  javascript: `// Two Sum Problem (LeetCode #1)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
console.log("Input Nums:", nums);
console.log("Target Sum:", target);
console.log("Indices Found:", twoSum(nums, target));
`,
  python: `# Binary Search Algorithm
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11, 13]
print("Array:", nums)
print("Index of 7:", binary_search(nums, 7))
`,
  cpp: `// C++ Vector Sorting & Search
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};
    std::cout << "Original Array: ";
    for(int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted Array: ";
    for(int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    return 0;
}
`,
  java: `// Java Solution - Palindrome Check
public class Main {
    public static boolean isPalindrome(String str) {
        int left = 0, right = str.length() - 1;
        while(left < right) {
            if(str.charAt(left) != str.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String test = "racecar";
        System.out.println("Is '" + test + "' a palindrome? " + isPalindrome(test));
    }
}
`,
};

const StudentCodePlaygroundModal = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_SNIPPETS.javascript);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("output");

  if (!isOpen) return null;

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Executing code in sandboxed VM runner...");
    try {
      const res = await apiClient.post("/v1/enhanced/code/execute", {
        language,
        code,
        input,
      });
      const data = res.data?.data || {};
      setOutput(data.output || "Code executed with 0 output lines.");
      setStats({
        status: data.status,
        time: data.executionTimeMs,
        memory: data.memoryUsed,
      });
      toast.success("Code executed successfully!");
    } catch (err) {
      setOutput(`Runtime Error:\n${err.message || "Failed to execute code"}`);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_SNIPPETS[lang] || "// Write code here...");
    setOutput("");
    setStats(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Code size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Multi-Language DSA Playground
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  Isolated Runner
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Execute & test JS, Python, C++, and Java algorithm solutions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="javascript">JavaScript (Node.js v20)</option>
              <option value="python">Python 3.11</option>
              <option value="cpp">C++ (g++ 13)</option>
              <option value="java">Java (OpenJDK 21)</option>
            </select>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
            >
              <Play size={14} fill="currentColor" />
              {isRunning ? "Executing..." : "Run Code"}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-lg px-2 py-1 rounded-lg hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1 overflow-hidden">
          {/* Code Editor Column */}
          <div className="p-4 border-r border-slate-800 flex flex-col bg-slate-950/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code size={14} /> Editor ({language.toUpperCase()})
              </span>
              <button
                onClick={() => setCode(DEFAULT_SNIPPETS[language] || "")}
                className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition"
              >
                <RotateCcw size={12} /> Reset Template
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none leading-relaxed"
              rows={16}
            />
          </div>

          {/* Console Output & Input Tabs */}
          <div className="p-4 flex flex-col bg-slate-950/60">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("output")}
                  className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === "output"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Terminal size={13} /> Console Output
                </button>
                <button
                  onClick={() => setActiveTab("input")}
                  className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === "input"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sliders size={13} /> Custom Stdin
                </button>
              </div>

              {stats && activeTab === "output" && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={10} /> {stats.status}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Cpu size={10} /> {stats.time}
                  </span>
                </div>
              )}
            </div>

            {activeTab === "output" ? (
              <pre className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-auto whitespace-pre-wrap leading-relaxed">
                {output ||
                  "Output will appear here after clicking 'Run Code'..."}
              </pre>
            ) : (
              <div className="flex-1 flex flex-col space-y-2">
                <p className="text-xs text-slate-400">
                  Provide custom Stdin inputs to test your solution with custom test cases:
                </p>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter test inputs (e.g. 5\n1 2 3 4 5)..."
                  className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCodePlaygroundModal;
