import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Play, 
  Star, 
  Award, 
  Laptop, 
  Globe, 
  Smartphone, 
  ArrowRight
} from 'lucide-react';
import Question from './Question';
import { fetchAllCourses, fetchCategories } from '../slices/courseSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allCourses, categories: dbCategories } = useSelector((state) => state.course || {});

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchAllCourses());
    dispatch(fetchCategories());
  }, [dispatch]);

  const carouselItems = [
    {
      id: 1,
      title: 'Master the Future of Tech',
      subtitle: 'Expert-led courses in AI, Full-Stack Development, and Cloud Computing.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000',
    },
    {
      id: 2,
      title: 'Learn Without Boundaries',
      subtitle: 'Production-grade education built for your software engineering career.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000',
    }
  ];

  const defaultCategoryIcons = [
    <Laptop size={32} className="text-blue-500" />,
    <Globe size={32} className="text-emerald-500" />,
    <Award size={32} className="text-amber-500" />,
    <Smartphone size={32} className="text-rose-500" />,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const publishedCourses = Array.isArray(allCourses)
    ? allCourses.filter((c) => c.courseStatus === "Published" || !c.courseStatus)
    : [];

  return (
    <div className="bg-white dark:bg-black transition-colors duration-500">
      
      {/* 1. HERO CAROUSEL SECTION */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${carouselItems[currentIndex].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl"
          >
            <span className="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Elevate Your Career
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-none mb-6">
              {carouselItems[currentIndex].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 font-light max-w-lg">
              {carouselItems[currentIndex].subtitle}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/courses")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 group shadow-xl shadow-blue-500/20"
              >
                Explore Courses <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/about")}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                About Platform
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-6 z-20 flex gap-2">
          {carouselItems.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 rounded-full ${currentIndex === i ? 'w-12 bg-blue-500' : 'w-4 bg-white/30'}`} 
            />
          ))}
        </div>
      </section>

      {/* 2. DYNAMIC CATEGORIES SECTION */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-neutral-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tighter">
                Explore by <span className="text-blue-600">Discipline</span>
              </h2>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 group"
            >
              View All <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbCategories.length > 0
              ? dbCategories.slice(0, 4).map((cat, idx) => (
                  <div
                    key={cat._id || idx}
                    onClick={() => navigate("/courses")}
                    className="group p-8 rounded-[2rem] hover:border-2 hover:border-blue-500 bg-white dark:bg-black border-gray-100 dark:border-neutral-800 transition-all duration-500 hover:shadow-2xl cursor-pointer"
                  >
                    <div className="mb-6 transition-transform group-hover:scale-110 duration-500">
                      {defaultCategoryIcons[idx % defaultCategoryIcons.length]}
                    </div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">{cat.categoryName || cat.name}</h3>
                    <p className="text-gray-500 dark:text-neutral-500 text-sm leading-relaxed line-clamp-2">
                      {cat.description || "Master industry-standard skills with hands-on projects."}
                    </p>
                  </div>
                ))
              : [1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-white dark:bg-black border border-gray-100 dark:border-neutral-800">
                    <Laptop size={32} className="text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">Web Development</h3>
                    <p className="text-gray-500 dark:text-neutral-500 text-sm">Fullstack Node & React bootcamps.</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC FEATURED COURSES SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Curated Catalog</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tighter mt-2">Featured Courses</h2>
          </div>

          {publishedCourses.length === 0 ? (
            <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-12 text-center">
              <h3 className="text-xl font-bold text-black dark:text-white">No Published Courses Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Check back soon or browse our full curriculum.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedCourses.slice(0, 3).map((course, item) => {
                const courseId = course._id || course.id;
                const title = course.title || course.courseName || "Untitled Course";
                const thumbnail = course.thumbnail || course.Thumbnails || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800";
                const price = course.price !== undefined ? course.price : 0;
                const instructor = course.instructorName || "Instructor";

                return (
                  <motion.div 
                    key={courseId}
                    whileHover={{ y: -6 }}
                    className="bg-gray-50 dark:bg-neutral-950 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-neutral-900 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-60 relative overflow-hidden bg-gray-200 dark:bg-neutral-900">
                        <img 
                          src={thumbnail} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                          alt={title}
                        />
                        <div className="absolute top-4 left-4 bg-white dark:bg-black px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest dark:text-white">
                          {course.level || "Beginner"}
                        </div>
                      </div>

                      <div className="p-8 space-y-4">
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">By {instructor}</span>
                          <span>{course.studentsCount || 0} Enrolled</span>
                        </div>

                        <h3 
                          onClick={() => navigate(`/dashboard/student/course/${courseId}`)}
                          className="text-2xl font-bold text-black dark:text-white leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-8 pt-0 flex items-center justify-between border-t dark:border-neutral-900 pt-6">
                      <div>
                        <span className="text-gray-400 text-[10px] block uppercase font-bold tracking-tighter">Price</span>
                        <span className="text-2xl font-black text-black dark:text-white">₹{price}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/dashboard/student/course/${courseId}`)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                      >
                        <Play size={14} fill="currentColor" /> View Course
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. INDUSTRY ADVANTAGES */}
      <section className="py-24 bg-gray-50 dark:bg-neutral-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tighter">The Kodemates Edge</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { img: '/Images/online.png', title: '10+ Premium Tracks' },
              { img: '/Images/industry.png', title: 'Industry Experts' },
              { img: '/Images/lifetime.png', title: 'Lifetime Access' }
            ].map((adv, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative mb-8 inline-block">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={adv.img} alt={adv.title} className="w-44 h-44 object-contain relative z-10 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-3">{adv.title}</h3>
                <p className="text-gray-500 dark:text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Engineered to provide up-to-date, practical knowledge for modern software engineers.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Question />

      {/* 5. CALL TO ACTION */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6 relative z-10">
            Your Future Starts Now.
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto font-light">
            Explore live courses and master full-stack software development.
          </p>
          <button onClick={() => navigate("/courses")} className="bg-white text-blue-600 px-8 py-4 rounded-full font-black text-base hover:bg-gray-100 transition-all shadow-xl">
            Explore All Courses
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;