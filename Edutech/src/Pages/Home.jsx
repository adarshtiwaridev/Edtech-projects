import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Star, 
  Clock, 
  Users, 
  Award, 
  Laptop, 
  Globe, 
  Smartphone, 
  BookOpen, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Question from './Question';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const carouselItems = [
    {
      id: 1,
      title: 'Master the Future of Tech',
      subtitle: 'Expert-led courses in AI, Development, and Design.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000',
    },
    {
      id: 2,
      title: 'Learn Without Boundaries',
      subtitle: 'Premium education designed for your global career.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000',
    }
  ];

  const categories = [
    { icon: <Laptop size={32} />, title: 'Coding Bootcamps', color: 'text-blue-500' },
    { icon: <Globe size={32} />, title: 'Global Degrees', color: 'text-emerald-500' },
    { icon: <Award size={32} />, title: 'Certifications', color: 'text-amber-500' },
    { icon: <Smartphone size={32} />, title: 'Mobile Learning', color: 'text-rose-500' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
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
              Evolutionize your career
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-none mb-6">
              {carouselItems[currentIndex].title}
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-light max-w-lg">
              {carouselItems[currentIndex].subtitle}
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 group shadow-xl shadow-blue-500/20">
                Explore Hub <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all">
                Our Story
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

      {/* 2. PREMIUM CATEGORIES SECTION */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-neutral-950 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tighter">
                Explore by <span className="text-blue-600">Discipline</span>
              </h2>
            </div>
            <button className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-2 group">
              View All <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-[2rem] bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5"
              >
                <div className={`${cat.color} mb-6 transition-transform group-hover:scale-110 duration-500`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{cat.title}</h3>
                <p className="text-gray-500 dark:text-neutral-500 text-sm leading-relaxed">
                  Join a community of thousands mastering new skills daily.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Premium Selection</span>
            <h2 className="text-5xl font-bold text-black dark:text-white tracking-tighter mt-4">Featured Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                whileHover={{ y: -10 }}
                className="bg-gray-50 dark:bg-neutral-950 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-neutral-900 group"
              >
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800`} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    alt="Course"
                  />
                  <div className="absolute top-6 left-6 bg-white dark:bg-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest dark:text-white">
                    Bestseller
                  </div>
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-bold text-black dark:text-white">4.9</span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">32 Hours</span>
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-6 group-hover:text-blue-600 transition-colors">
                    Advanced Full-Stack Engineering Pro
                  </h3>
                  <div className="flex items-center justify-between border-t dark:border-neutral-800 pt-6">
                    <div>
                      <span className="text-gray-400 text-xs block uppercase font-bold tracking-tighter">Price</span>
                      <span className="text-2xl font-black text-black dark:text-white">$149</span>
                    </div>
                    <button className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all">
                      <Play size={20} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INDUSTRY ADVANTAGES (The Image Cards) */}
      <section className="py-24 bg-gray-50 dark:bg-neutral-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black dark:text-white tracking-tighter">The EduLerns Edge</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { img: '/Images/online.png', title: '13+ Premium Tracks' },
              { img: '/Images/industry.png', title: 'Industry Veterans' },
              { img: '/Images/lifetime.png', title: 'Lifetime Learning' }
            ].map((adv, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative mb-8 inline-block">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={adv.img} alt={adv.title} className="w-48 h-48 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">{adv.title}</h3>
                <p className="text-gray-500 dark:text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Engineered to provide the most relevant, up-to-date knowledge for the modern professional.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Question />

      {/* 5. CALL TO ACTION */}
      <section className="py-4 px-6">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[3rem] p-1 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-34 h-34 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 relative z-10">
            Your Future <br /> Starts Now.
          </h2>
          <p className="text-blue-100 text-xl mb-12 max-w-xl mx-auto font-light">
            Join 50,000+ students already mastering the skills of tomorrow.
          </p>
          <button onClick={()=>{}} className="bg-white text-blue-600 px-10 py-5 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-xl">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;