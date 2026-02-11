import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  PlayCircle, 
  ArrowUpRight,
  LayoutGrid,
  List
} from 'lucide-react';

const dummyCourses = [
  { id: 1, title: 'React Modern Architecture', instructor: 'John Doe', price: 49, rating: 4.8, students: '12k', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop' },
  { id: 2, title: 'JavaScript Engine Internals', instructor: 'Jane Smith', price: 59, rating: 4.9, students: '8k', level: 'Advanced', image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop' },
  { id: 3, title: 'Applied Python for Data', instructor: 'Alice Johnson', price: 79, rating: 4.7, students: '15k', level: 'Beginner', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop' },
  { id: 4, title: 'Next.js 15 Fullstack Pro', instructor: 'Bob Brown', price: 99, rating: 5.0, students: '5k', level: 'Advanced', image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop' },
  { id: 5, title: 'Neural Networks Basics', instructor: 'Charlie Lee', price: 89, rating: 4.6, students: '3k', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop' },
  { id: 6, title: 'Design Systems with CSS', instructor: 'Diana Adams', price: 39, rating: 4.8, students: '22k', level: 'Beginner', image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop' },
];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
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
              className="text-5xl md:text-7xl font-bold text-black dark:text-white mt-4 tracking-tighter"
            >
              Master New <span className="text-blue-600">Skills.</span>
            </motion.h1>
          </div>

          {/* Realistic Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="pl-12 pr-6 py-4 bg-gray-100 dark:bg-neutral-900 border-none rounded-2xl w-full md:w-64 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-4 bg-gray-100 dark:bg-neutral-900 rounded-2xl dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {dummyCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                   <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     <PlayCircle size={18} /> Quick Preview
                   </button>
                </div>
                <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{course.level}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-500 gap-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-black dark:text-white">{course.rating}</span>
                  </div>
                  <span className="text-gray-300 dark:text-neutral-700">|</span>
                  <span className="text-xs text-gray-400 font-medium">{course.students} Learners</span>
                </div>

                <h3 className="text-2xl font-bold text-black dark:text-white leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700" />
                  <span className="text-sm text-gray-500 dark:text-neutral-400 font-medium">by {course.instructor}</span>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-neutral-900">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Full Course</span>
                    <span className="text-2xl font-black text-black dark:text-white">${course.price}</span>
                  </div>
                  
                  <button className="flex items-center justify-center w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight size={22} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Realistic Button */}
        <div className="mt-20 text-center">
           <button className="px-12 py-5 border border-gray-200 dark:border-neutral-800 dark:text-white rounded-full font-bold hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all">
             View All 124 Courses
           </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;