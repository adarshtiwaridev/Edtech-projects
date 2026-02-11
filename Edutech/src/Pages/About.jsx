import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  Globe, 
  Lightbulb, 
  Rocket, 
  Target, 
  Award,
  ChevronRight
} from 'lucide-react';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const stats = [
    { value: '50K+', label: 'Global Students', icon: <GraduationCap size={28} /> },
    { value: '500+', label: 'Industry Experts', icon: <Users size={28} /> },
    { value: '100+', label: 'Countries Reach', icon: <Globe size={28} /> },
    { value: '95%', label: 'Success Rate', icon: <Award size={28} /> },
  ];

  const features = [
    {
      icon: <Rocket size={24} />,
      title: 'Innovative Learning',
      description: 'Cutting-edge curriculum designed by industry leads to keep you ahead of the digital curve.'
    },
    {
      icon: <Users size={24} />,
      title: 'Expert Community',
      description: 'Join an exclusive network of passionate learners and elite industry professionals.'
    },
    {
      icon: <Lightbulb size={24} />,
      title: 'Practical Mastery',
      description: 'Hands-on projects and real-world simulations designed to build your professional portfolio.'
    }
  ];

  return (
    <div className="bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      
      {/* Cinematic Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 grayscale-[0.5] dark:opacity-60"
          style={{ filter: 'brightness(0.7)' }}
        >
          <source src="/videos/event-04.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white dark:to-black z-[1]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8"
              variants={fadeInUp}
            >
              Elevating <span className="text-blue-500">Human</span> Potential
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed"
              variants={fadeInUp}
            >
              We are a global community dedicated to democratizing elite education and empowering the next generation of innovators.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision: The "Impact" Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs">Our Purpose</span>
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mt-4 mb-8 tracking-tighter"> Democratizing the future of learning.</h2>
              <p className="text-lg text-gray-500 dark:text-neutral-400 mb-10 leading-relaxed">
                At EduLerns, we believe quality education shouldn't be a privilege. We've built a platform that bridges the gap between traditional theory and modern industry demands, making lifelong learning accessible to everyone, everywhere.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['Excellence', 'Innovation', 'Accessibility', 'Integrity'].map((value) => (
                  <div key={value} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800">
                    <Target className="text-blue-600" size={20} />
                    <span className="font-bold dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80" 
                  alt="Team collaboration"
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl z-20 max-w-xs hidden md:block">
                <h3 className="text-2xl font-bold text-white mb-2">The Vision</h3>
                <p className="text-blue-100 text-sm leading-relaxed">To become the global standard for transformative digital learning by 2030.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section: Glassmorphism Design */}
      <section className="py-24 bg-gray-50 dark:bg-neutral-950 border-y border-gray-100 dark:border-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="inline-flex p-4 rounded-3xl bg-white dark:bg-black text-blue-600 shadow-xl shadow-blue-500/5 mb-6 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-black dark:text-white tracking-tighter">{stat.value}</h3>
                <p className="text-gray-500 dark:text-neutral-500 text-sm mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us: Feature Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tighter">Built for <span className="text-blue-600">Performance.</span></h2>
            <p className="text-gray-500 dark:text-neutral-400 mt-4">The core pillars that make our platform the preferred choice for professionals.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="p-10 rounded-[2.5rem] bg-gray-50 dark:bg-neutral-900/50 border border-transparent hover:border-blue-500/30 transition-all duration-500 group"
                whileHover={{ y: -10 }}
              >
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-500 dark:text-neutral-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto bg-black dark:bg-white rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px]"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white dark:text-black tracking-tighter mb-8 relative z-10">
            Shape your future <br /> with the best in class.
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
              Start Your Journey <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 border border-white/20 dark:border-black/10 text-white dark:text-black rounded-full font-bold hover:bg-white/10 dark:hover:bg-black/5 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;