import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";

const blogsData = [
  {
    id: 1,
    title: "AI Revolution in EdTech: 2026 Trends",
    author: "Satya Nadella",
    authorImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
    category: "Technology",
    date: "Feb 10, 2026",
    description: "Discover how Artificial Intelligence, ChatGPT, and personalized learning systems are redefining the future of education worldwide.",
  },
  {
    id: 2,
    title: "Top 10 Study Hacks from Google Engineers",
    author: "Sundar Pichai",
    authorImg: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg: "https://images.pexels.com/photos/262470/pexels-photo-262470.jpeg",
    category: "Study",
    date: "Jan 28, 2026",
    description: "Practical study strategies used by Google engineers to ace their exams, balance coding, and sharpen problem-solving skills.",
  },
  {
    id: 3,
    title: "Landing Your Dream Internship in 2026",
    author: "Elon Musk",
    authorImg: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&dpr=1",
    category: "Career",
    date: "Jan 15, 2026",
    description: "Step-by-step internship roadmap for ambitious students, with tips on networking, projects, and standing out in interviews.",
  },
  {
    id: 4,
    title: "Future of Remote Learning: Google Classrooms",
    author: "Larry Page",
    authorImg: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg: "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&dpr=1",
    category: "Education",
    date: "Dec 20, 2025",
    description: "How Google Classrooms and hybrid models are transforming the global education system post-pandemic.",
  },
  {
    id: 5,
    title: "Motivation Secrets from Successful CEOs",
    author: "Sheryl Sandberg",
    authorImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&dpr=1",
    category: "Motivation",
    date: "Nov 05, 2025",
    description: "Daily motivation habits followed by the world’s top CEOs that can keep students and professionals consistent.",
  },
];

const categories = ["All", "Technology", "Study", "Career", "Education", "Motivation"];

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBlogs =
    selectedCategory === "All"
      ? blogsData
      : blogsData.filter((blog) => blog.category === selectedCategory);

  return (
    <section className="min-h-screen bg-white dark:bg-black py-24 px-6 transition-colors duration-500">
      {/* Heading Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs"
        >
          Insights & Articles
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-black dark:text-white mt-4 tracking-tighter"
        >
          Explore Our <span className="text-blue-600">Knowledge Hub</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 dark:text-neutral-400 mt-6 text-lg leading-relaxed"
        >
          Expert-led strategies and industry updates curated to keep you ahead in your professional journey.
        </motion.p>
      </div>

      {/* Modern Category Selector */}
      <div className="flex justify-center mb-16">
        <div className="flex gap-1 bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-1 rounded-full overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-md"
                  : "text-gray-500 dark:text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          layout
          className="grid lg:grid-cols-3 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500"
              >
                {/* Image Wrapper */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={blog.coverImg}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider dark:text-white">
                    {blog.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {blog.date}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-black dark:text-white leading-tight group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-neutral-400 mt-4 line-clamp-2 text-sm leading-relaxed">
                    {blog.description}
                  </p>

                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={blog.authorImg}
                        alt={blog.author}
                        className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all"
                      />
                      <span className="text-sm font-bold text-gray-700 dark:text-neutral-300">{blog.author}</span>
                    </div>
                    
                    <div className="p-2 bg-gray-100 dark:bg-neutral-900 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}