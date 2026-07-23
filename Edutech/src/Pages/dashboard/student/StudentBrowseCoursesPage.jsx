import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../Components/dashboard/DashboardLayout";
import CourseCard from "../../../Components/course/CourseCard";
import SkeletonCard from "../../../Components/common/SkeletonCard";
import { fetchAllCourses, fetchCategories } from "../../../slices/courseSlice";

const StudentBrowseCoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allCourses, categories, loading } = useSelector((state) => state.course);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    dispatch(fetchAllCourses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const title = (course.title || course.courseName || "").toLowerCase();
      const description = (course.description || course.courseDescription || "").toLowerCase();
      const matchesSearch = !search || title.includes(search.toLowerCase()) || description.includes(search.toLowerCase());
      const categoryId = course?.category?._id || course?.category || course?.categories?._id || course?.categories;
      const matchesCategory = !categoryFilter || String(categoryId) === String(categoryFilter);
      const matchesLevel = !levelFilter || course.level === levelFilter;
      const matchesPrice = !maxPrice || Number(course.price) <= Number(maxPrice);
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }, [allCourses, search, categoryFilter, levelFilter, maxPrice]);

  return (
    <DashboardLayout title="Browse Courses">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search courses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.categoryName || category.name}</option>
          ))}
        </select>

        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              detailPath={`/dashboard/student/course/${course.id}`}
              actionSlot={
                <button
                  onClick={() => navigate(`/dashboard/student/course/${course.id}`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Buy Course
                </button>
              }
            />
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default StudentBrowseCoursesPage;
