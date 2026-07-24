import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllCoursesAdmin, updateCourseStatusAdmin, deleteCourseAdmin } from "../../../slices/adminSlice";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, Edit, Archive, RotateCcw, Trash2 } from "lucide-react";

const AdminCoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading } = useSelector((state) => state.admin || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAllCoursesAdmin({ search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  const handleStatusUpdate = async (courseId, status) => {
    const res = await dispatch(updateCourseStatusAdmin({ courseId, status }));
    if (!res.error) {
      toast.success(`Course status updated to ${status}`);
      dispatch(fetchAllCoursesAdmin({ search: searchTerm, status: statusFilter }));
    } else {
      toast.error(res.payload || "Failed to update status");
    }
  };

  return (
    <DashboardLayout title="Admin Course Management">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search all courses by title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm dark:bg-slate-900"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-xs">
                <th className="py-3 px-4 font-semibold">Course Name</th>
                <th className="py-3 px-4 font-semibold">Instructor</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">Loading courses...</td>
                </tr>
              ) : courses?.length > 0 ? (
                courses.map((course) => {
                  const categoryName = course.category?.categoryName || course.category?.name || "Uncategorized";
                  const instructorName = course.instructor
                    ? `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() || course.instructor.email
                    : "Unknown";

                  return (
                    <tr key={course._id} className="border-b border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                      <td className="py-4 px-4 font-medium flex items-center gap-3">
                        <img
                          src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"}
                          alt=""
                          className="w-12 h-10 rounded-md object-cover"
                        />
                        <span className="truncate max-w-[200px] text-sm font-semibold">{course.courseName}</span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">{instructorName}</td>
                      <td className="py-4 px-4 text-xs text-slate-500">{categoryName}</td>
                      <td className="py-4 px-4 text-sm font-bold">₹{course.price}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          course.courseStatus === "Published" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                          course.courseStatus === "Archived" ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {course.courseStatus || "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/dashboard/teacher/courses/${course._id}/edit`, { state: { course } })}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Edit size={13} /> Edit
                          </button>

                          {course.courseStatus === "Draft" ? (
                            <button
                              onClick={() => handleStatusUpdate(course._id, "Published")}
                              className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <CheckCircle size={13} /> Publish
                            </button>
                          ) : course.courseStatus === "Published" ? (
                            <button
                              onClick={() => handleStatusUpdate(course._id, "Draft")}
                              className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <XCircle size={13} /> Unpublish
                            </button>
                          ) : null}

                          {course.courseStatus !== "Archived" ? (
                            <button
                              onClick={() => handleStatusUpdate(course._id, "Archived")}
                              className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                              title="Archive Course"
                            >
                              <Archive size={13} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusUpdate(course._id, "Draft")}
                              className="px-2 py-1 bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                              title="Restore Course"
                            >
                              <RotateCcw size={13} />
                            </button>
                          )}

                          <button
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to permanently delete "${course.courseName}"?`)) {
                                const res = await dispatch(deleteCourseAdmin(course._id));
                                if (!res.error) toast.success("Course deleted by admin");
                              }
                            }}
                            className="px-2.5 py-1 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">No courses found matching criteria</td>
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
