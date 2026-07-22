import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserStatus } from "../../../slices/adminSlice";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { CheckCircle, XCircle, PauseCircle } from "lucide-react";

const AdminTeachersPage = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin || {});
  const [activeTab, setActiveTab] = useState("Pending");
  const [rejectionModal, setRejectionModal] = useState({ open: false, userId: null, reason: "" });

  useEffect(() => {
    dispatch(fetchUsers({ role: "Teacher", status: activeTab }));
  }, [dispatch, activeTab]);

  const handleStatusUpdate = async (userId, status, reason = "") => {
    const res = await dispatch(updateUserStatus({ userId, status, rejectionReason: reason }));
    if (!res.error) {
      toast.success(`Teacher ${status.toLowerCase()} successfully`);
      if (status === "Rejected") {
        setRejectionModal({ open: false, userId: null, reason: "" });
      }
      // Refresh list
      dispatch(fetchUsers({ role: "Teacher", status: activeTab }));
    }
  };

  return (
    <DashboardLayout title="Teacher Verification">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
          {["Pending", "Approved", "Rejected", "Suspended"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors ${
                activeTab === tab 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-xs">
                <th className="py-3 px-4 font-semibold">Teacher Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Joined On</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">Loading teachers...</td>
                </tr>
              ) : users?.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="py-4 px-4 text-slate-500">{user.email}</td>
                    <td className="py-4 px-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right flex justify-end gap-2">
                      {activeTab !== "Approved" && (
                        <button 
                          onClick={() => handleStatusUpdate(user._id, "Approved")}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-semibold"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                      )}
                      {activeTab !== "Rejected" && (
                        <button 
                          onClick={() => setRejectionModal({ open: true, userId: user._id, reason: "" })}
                          className="flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-sm font-semibold"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      )}
                      {activeTab === "Approved" && (
                        <button 
                          onClick={() => handleStatusUpdate(user._id, "Suspended")}
                          className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-sm font-semibold"
                        >
                          <PauseCircle size={16} /> Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No {activeTab.toLowerCase()} teachers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejectionModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Reject Teacher</h3>
            <textarea
              className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:outline-blue-500 mb-4"
              rows={4}
              placeholder="Reason for rejection..."
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setRejectionModal({ open: false, userId: null, reason: "" })}
                className="px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleStatusUpdate(rejectionModal.userId, "Rejected", rejectionModal.reason)}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminTeachersPage;
