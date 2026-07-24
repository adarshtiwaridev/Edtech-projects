import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import LecturePlayer from "../../../Components/course/LecturePlayer";
import { fetchCourseById, fetchEnrolledCourses } from "../../../slices/courseSlice";

const StudentLearnCoursePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { singleCourse, enrolledCourses, loading } = useSelector((state) => state.course);
  const isEnrolled = enrolledCourses.some((course) => String(course.id) === String(id));

  useEffect(() => {
    dispatch(fetchCourseById(id));
    dispatch(fetchEnrolledCourses());
  }, [dispatch, id]);

  return (
    <DashboardLayout title="Learn Course">
      {loading || !singleCourse ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading content...</p>
        </div>
      ) : !isEnrolled ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold">Course Locked</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Buy this course first to watch lectures and access learning content.
          </p>
          <button
            onClick={() => navigate(`/dashboard/student/course/${id}`)}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Go To Course Details
          </button>
        </div>
      ) : (
        <LecturePlayer course={singleCourse} />
      )}
    </DashboardLayout>
  );
};

export default StudentLearnCoursePage;
