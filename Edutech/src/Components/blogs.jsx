import React, { useState } from "react";
import { motion } from "framer-motion";

const blogsData = [
  {
    id: 1,
    title: "AI Revolution in EdTech: 2025 Trends",
    author: "Satya Nadella",
    authorImg:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
    category: "Technology",
    description:
      "Discover how Artificial Intelligence, ChatGPT, and personalized learning systems are redefining the future of education worldwide.",
  },
  {
    id: 2,
    title: "Top 10 Study Hacks from Google Engineers",
    author: "Sundar Pichai",
    authorImg:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg:
      "https://images.pexels.com/photos/262470/pexels-photo-262470.jpeg",
    category: "Study",
    description:
      "Practical study strategies used by Google engineers to ace their exams, balance coding, and sharpen problem-solving skills.",
  },
  {
    id: 3,
    title: "Landing Your Dream Internship in 2025",
    author: "Elon Musk",
    authorImg:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&dpr=1",
    category: "Career",
    description:
      "Step-by-step internship roadmap for ambitious students, with tips on networking, projects, and standing out in interviews.",
  },
  {
    id: 4,
    title: "Future of Remote Learning: Google Classrooms",
    author: "Larry Page",
    authorImg:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg:
      "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&dpr=1",
    category: "Education",
    description:
      "How Google Classrooms and hybrid models are transforming the global education system post-pandemic.",
  },
  {
    id: 5,
    title: "Motivation Secrets from Successful CEOs",
    author: "Sheryl Sandberg",
    authorImg:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
    coverImg:
      "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&dpr=1",
    category: "Motivation",
    description:
      "Daily motivation habits followed by the world’s top CEOs that can keep students and professionals consistent.",
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
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 px-6">
      {/* Heading */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm"
        >
          ✨ Explore Our Knowledge Hub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-600 max-w-2xl mx-auto mt-6 text-lg"
        >
          Curated insights, strategies, and updates from industry leaders,
          educators, and innovators — crafted to keep you ahead of the curve.
        </motion.p>
      </div>

      {/* Category Buttons */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all duration-300
              ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {filteredBlogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
          >
            {/* Blog Image */}
            <div className="overflow-hidden">
              <img
                src={blog.coverImg}
                alt={blog.title}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {blog.title}
              </h3>
              <p className="text-gray-600 mt-2 line-clamp-3 text-sm">
                {blog.description}
              </p>

              {/* Author */}
              <div className="flex items-center mt-5">
                <img
                  src={blog.authorImg}
                  alt={blog.author}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {blog.author}
                  </p>
                  <span className="text-xs text-gray-500">{blog.category}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
