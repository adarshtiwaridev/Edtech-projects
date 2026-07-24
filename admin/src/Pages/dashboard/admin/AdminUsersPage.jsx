import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../../slices/adminSlice";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Trash2, Search } from "lucide-react";

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ search: searchTerm, role: roleFilter }));
  }, [dispatch, searchTerm, roleFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const res = await dispatch(deleteUser(id));
      if (!res.error) {
        toast.success("User deleted successfully");
      }
    }
  };

  return (
    <DashboardLayout title="User Management">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Student">Students</option>
            <option value="Teacher">Teachers</option>
            <option value="Admin">Admins</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-xs">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Loading users...</td>
                </tr>
              ) : users?.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="py-4 px-4 text-slate-500">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.accountType === "Admin" ? "bg-violet-100 text-violet-600" :
                        user.accountType === "Teacher" ? "bg-emerald-100 text-emerald-600" :
                        "bg-blue-100 text-blue-600"
                      }`}>
                        {user.accountType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Approved" ? "bg-green-100 text-green-600" :
                        user.status === "Pending" ? "bg-amber-100 text-amber-600" :
                        "bg-red-100 text-red-600"
                      }`}>
                        {user.status || "Approved"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
