import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, UserPlus, Search, Filter, CheckCircle2, 
  Clock, AlertTriangle, ArrowUpRight, ShieldAlert 
} from "lucide-react";

const mockPayments = [
  { id: "PAY-1001", student: "Aarav Sharma", course: "Full Stack MERN Bootcamp", amount: "₹4,999", status: "Success", date: "2026-08-05", method: "Razorpay (UPI)" },
  { id: "PAY-1002", student: "Priya Patel", course: "React Masterclass 2026", amount: "₹2,499", status: "Success", date: "2026-08-05", method: "Credit Card" },
  { id: "PAY-1003", student: "Rohan Verma", course: "Data Structures & Algo", amount: "₹3,999", status: "Pending", date: "2026-08-04", method: "Net Banking" },
  { id: "PAY-1004", student: "Sneha Gupta", course: "Python for AI & ML", amount: "₹5,499", status: "Success", date: "2026-08-04", method: "Razorpay (UPI)" },
  { id: "PAY-1005", student: "Vikram Malhotra", course: "DevOps & Kubernetes", amount: "₹6,999", status: "Failed", date: "2026-08-03", method: "Debit Card" },
];

const mockEnrollments = [
  { id: "ENR-801", student: "Ananya Roy", course: "React Masterclass", instructor: "Dr. Ramesh Kumar", date: "2026-08-05", status: "Active" },
  { id: "ENR-802", student: "Karan Singh", course: "Full Stack MERN", instructor: "Adarsh Tiwari", date: "2026-08-05", status: "Active" },
  { id: "ENR-803", student: "Divya Nair", course: "Python AI & ML", instructor: "Prof. Priya Mehta", date: "2026-08-04", status: "Active" },
  { id: "ENR-804", student: "Amitabh Joshi", course: "DSA Bootcamp", instructor: "Adarsh Tiwari", date: "2026-08-04", status: "Completed" },
];

const AdminRecentTables = ({ isDark }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const cardBg = isDark 
    ? "bg-slate-900/80 border-slate-800 text-white" 
    : "bg-white border-slate-200 text-slate-900";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recent Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${cardBg}`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard size={20} className="text-emerald-500" /> Recent Transactions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Live payment status across Razorpay gateway</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              5 Recent
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/40">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30 text-xs">
                {mockPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold">{p.student}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-[140px] truncate">{p.course}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{p.amount}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                        p.status === "Success" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : p.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {p.status === "Success" && <CheckCircle2 size={10} />}
                        {p.status === "Pending" && <Clock size={10} />}
                        {p.status === "Failed" && <AlertTriangle size={10} />}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Recent Enrollments Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${cardBg}`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-500" /> Recent Enrollments
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Newly joined students & assigned courses</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              4 Recent
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/40">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Instructor</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30 text-xs">
                {mockEnrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold">{e.student}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-[140px] truncate">{e.course}</td>
                    <td className="py-3 px-3 text-slate-400">{e.instructor}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRecentTables;
