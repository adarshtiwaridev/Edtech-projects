import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChalkboardTeacher, FaGlobe, FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const stats = [
    { value: '50K+', label: 'Students Enrolled', icon: <FaGraduationCap className="text-4xl text-blue-600" /> },
    { value: '500+', label: 'Expert Instructors', icon: <FaChalkboardTeacher className="text-4xl text-blue-600" /> },
    { value: '100+', label: 'Countries Reached', icon: <FaGlobe className="text-4xl text-blue-600" /> },
    { value: '95%', label: 'Success Rate', icon: <FaLightbulb className="text-4xl text-blue-600" /> },
  ];

  const features = [
    {
      icon: <FaRocket className="text-2xl text-blue-600" />,
      title: 'Innovative Learning',
      description: 'Cutting-edge curriculum designed by industry experts to keep you ahead of the curve.'
    },
    {
      icon: <FaUsers className="text-2xl text-blue-600" />,
      title: 'Expert Community',
      'description': 'Join a network of passionate learners and industry professionals.'
    },
    {
      icon: <FaLightbulb className="text-2xl text-blue-600" />,
      title: 'Practical Skills',
      description: 'Hands-on projects and real-world applications to build your portfolio.'
    }
  ];

  return (
    <div className="font-serif">
    {/* Hero Section */}
<section className="relative text-white py-20">
  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
   style={{ filter: 'brightness(1.6) blur(3px)' }}

  >
    <source src="/videos/event-04.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Optional Overlay for readability */}
  <div className="absolute inset-0 bg-black opacity-30 z-0"></div>

  {/* Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      className="text-center py-20"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-6"
        variants={fadeInUp}
      >
        Transforming Education, <span className="text-blue-300">Empowering Futures</span>
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto"
        variants={fadeInUp}
      >
        We believe in making quality education accessible to everyone, everywhere.
      </motion.p>
    </motion.div>
  </div>
</section>


      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To democratize education by providing high-quality, affordable, and accessible learning experiences to students worldwide. We're committed to breaking down barriers and creating opportunities for lifelong learning.
              </p>
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Core Values</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Excellence in Education</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Innovation & Creativity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Accessibility for All</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Lifelong Learning</span>
                  </li>
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-blue-100 rounded-2xl p-1 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
                  alt="Students learning"
                  className="rounded-xl w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg w-3/4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                <p className="text-gray-600">To be the world's leading platform for transformative learning experiences that empower individuals to achieve their full potential.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={fadeInUp}
              >
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students who are already advancing their careers with our courses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-300"
            >
              Explore Courses
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
            >
              Contact Us
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
