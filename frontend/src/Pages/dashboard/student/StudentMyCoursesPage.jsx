import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import CourseCard from "../../../Components/course/CourseCard";
import SkeletonCard from "../../../Components/common/SkeletonCard";
import { fetchEnrolledCourses } from "../../../slices/courseSlice";

const StudentMyCoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enrolledCourses, loading } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  return (
    <DashboardLayout title="My Courses">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">No enrolled courses yet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Buy a course to unlock learning content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              detailPath={`/dashboard/student/learn/${course.id}`}
              actionSlot={
                <button
                  onClick={() => navigate(`/dashboard/student/learn/${course.id}`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Continue Learning
                </button>
              }
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentMyCoursesPage;
