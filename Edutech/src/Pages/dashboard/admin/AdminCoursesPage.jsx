import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCoursesAdmin, updateCourseStatusAdmin } from "../../../slices/adminSlice";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle } from "lucide-react";

const AdminCoursesPage = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.admin || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAllCoursesAdmin({ search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  const handleStatusUpdate = async (courseId, status) => {
    const res = await dispatch(updateCourseStatusAdmin({ courseId, status }));
    if (!res.error) {
      toast.success(`Course ${status.toLowerCase()} successfully`);
      dispatch(fetchAllCoursesAdmin({ search: searchTerm, status: statusFilter }));
    }
  };

  return (
    <DashboardLayout title="Course Management">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-xs">
                <th className="py-3 px-4 font-semibold">Course Name</th>
                <th className="py-3 px-4 font-semibold">Instructor</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Loading courses...</td>
                </tr>
              ) : courses?.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-4 font-medium flex items-center gap-3">
                      <img src={course.thumbnail} alt="" className="w-12 h-10 rounded-md object-cover" />
                      <span className="truncate max-w-[200px]">{course.courseName}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </td>
                    <td className="py-4 px-4">₹{course.price}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        course.courseStatus === "Published" ? "bg-green-100 text-green-600" :
                        "bg-amber-100 text-amber-600"
                      }`}>
                        {course.courseStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {course.courseStatus === "Draft" ? (
                        <button 
                          onClick={() => handleStatusUpdate(course._id, "Published")}
                          className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-semibold flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle size={16} /> Publish
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusUpdate(course._id, "Draft")}
                          className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-semibold flex items-center gap-1 ml-auto"
                        >
                          <XCircle size={16} /> Unpublish
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">No courses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCoursesPage;
