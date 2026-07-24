import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  PlayCircle, 
  ArrowUpRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '../slices/cartSlices';
import { fetchAllCourses, fetchCategories } from "../slices/courseSlice";
import SkeletonCard from "./common/SkeletonCard";

const Courses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth || {});
  const { allCourses, categories, loading, error } = useSelector((state) => state.course || {});
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    dispatch(fetchAllCourses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddToCart = (course) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart(course));
    toast.success('Course added to cart');
  };

  const filteredCourses = useMemo(() => {
    if (!Array.isArray(allCourses)) return [];
    return allCourses.filter((course) => {
      const title = (course.title || course.courseName || '').toLowerCase();
      const description = (course.description || course.courseDescription || '').toLowerCase();
      const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase()) || description.includes(searchQuery.toLowerCase());
      
      const catId = course.category?._id || course.category || course.categories?._id || course.categories;
      const matchesCategory = !selectedCategory || String(catId) === String(selectedCategory);
      
      const matchesLevel = !selectedLevel || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [allCourses, searchQuery, selectedCategory, selectedLevel]);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs"
            >
              Curated Curriculum
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-black dark:text-white mt-2 tracking-tighter"
            >
              Master New <span className="text-blue-600">Skills.</span>
            </motion.h1>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-neutral-900 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-neutral-900 rounded-2xl text-sm border-none dark:text-white outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName || cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-neutral-900 rounded-2xl text-sm border-none dark:text-white outline-none"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-12 text-center">
            <h3 className="text-xl font-bold text-black dark:text-white">No Courses Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => {
              const courseId = course._id || course.id;
              const title = course.title || course.courseName || "Untitled Course";
              const description = course.description || course.courseDescription || "";
              const thumbnail = course.thumbnail || course.Thumbnails || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800";
              const price = course.price !== undefined ? course.price : 0;
              const instructor = course.instructorName || "Instructor";
              const existingCartItem = cartItems.find((item) => String(item.id || item._id) === String(courseId));

              return (
                <motion.div
                  key={courseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-52 overflow-hidden bg-gray-200 dark:bg-neutral-900">
                      <img 
                        src={thumbnail} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">{course.level || "Beginner"}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-blue-600 dark:text-blue-400">By {instructor}</span>
                        <span>{course.studentsCount || 0} Students</span>
                      </div>

                      <h3 
                        onClick={() => navigate(`/dashboard/student/course/${courseId}`)}
                        className="text-xl font-bold text-black dark:text-white leading-snug hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                      >
                        {title}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-900">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Price</span>
                        <span className="text-xl font-black text-black dark:text-white">₹{price}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/student/course/${courseId}`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleAddToCart(course)}
                          className="flex items-center justify-center w-9 h-9 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all"
                          aria-label="Add course to cart"
                        >
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                    {existingCartItem && (
                      <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ In cart ({existingCartItem.quantity})
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;