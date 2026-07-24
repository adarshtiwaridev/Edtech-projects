import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import CourseCard from "../../../Components/course/CourseCard";
import SkeletonCard from "../../../Components/common/SkeletonCard";
import { deleteCourse, fetchTeacherCourses } from "../../../slices/courseSlice";

const TeacherCoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teacherCourses, loading, error } = useSelector((state) => state.course);
  const userId = useSelector(
    (state) => state.profile?.user?._id || state.auth?.user?._id || state.profile?.user?.id || state.auth?.user?.id
  );
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTeacherCourses());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const hasCourses = useMemo(() => teacherCourses.length > 0, [teacherCourses]);

  const handleDelete = async () => {
    if (!deletingCourse) return;
    setIsDeleting(true);
    const result = await dispatch(deleteCourse(deletingCourse._id));
    if (!result.error) {
      toast.success("Course deleted successfully");
    } else {
      toast.error(result.payload || "Delete failed");
    }
    setIsDeleting(false);
    setDeletingCourse(null);
  };

  return (
    <DashboardLayout title="Manage Courses">
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/dashboard/teacher/courses/create")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Create Course
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : !hasCourses ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">No courses created yet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Create your first course and start teaching.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {teacherCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isTeacherView
              onEdit={(selected) => navigate(`/dashboard/teacher/courses/${selected._id}/edit`, { state: { course: selected } })}
              onDelete={setDeletingCourse}
              detailPath={`/dashboard/student/course/${course._id}`}
            />
          ))}
        </motion.div>
      )}

      {deletingCourse && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold">Delete Course</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to delete {deletingCourse.title}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherCoursesPage;
