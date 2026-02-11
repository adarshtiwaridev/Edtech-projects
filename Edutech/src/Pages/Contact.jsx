import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20 px-6 transition-colors duration-500">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* Header Section */}
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs">
            Connect With Us
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mt-4 tracking-tighter">
            Let’s Build Your <span className="text-blue-600">Future.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-gray-500 dark:text-neutral-400 text-lg">
            Have a question or looking to partner? Reach out and our team will get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Form Section */}
          <motion.div 
            className="bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5" 
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-black dark:text-white mb-8">Send a Message</h2>
            
            {isSubmitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <CheckCircle className="text-blue-600 dark:text-blue-400 w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">Message Sent!</h3>
                <p className="text-gray-500 dark:text-neutral-400">We'll be in touch very soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Inquiry about Pro Courses"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Your Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
                    placeholder="Tell us more about how we can help..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Dispatch Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Info & Map Section */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info Cards */}
              {[
                { icon: MapPin, title: "Headquarters", detail: "80 Brooklyn St, NY 11201" },
                { icon: Phone, title: "Direct Line", detail: "+1 (555) 123-4567" },
                { icon: Mail, title: "Support Email", detail: "help@edutech.com" },
                { icon: Clock, title: "Opening Hours", detail: "Mon-Fri: 9AM - 6PM" },
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-neutral-900/50 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800 group hover:border-blue-500/50 transition-all">
                  <item.icon className="text-blue-600 mb-4" size={24} />
                  <h3 className="text-sm font-bold dark:text-white uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Premium Google Map Integration */}
            <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-neutral-900 h-[350px] shadow-2xl">
              <div className="absolute inset-0 bg-blue-600/5 pointer-events-none z-10" />
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.221990125237!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a47df06b185%3A0xc88184715dcc7ecd!2sBrooklyn%20Bridge!5e0!3m2!1sen!2sus!4v1647100000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.5) contrast(1.2) invert(0)' }} // You can toggle invert(1) for dark mode
                allowFullScreen=""
                loading="lazy"
                className="dark:invert dark:opacity-80 transition-all duration-700"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default Contact;