import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email.trim())) {
      errors.email = 'Invalid email format';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setSuccessMessage(data.message || "Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setFormErrors({});

        setTimeout(() => {
          setIsSubmitted(false);
          setSuccessMessage('');
        }, 5000);
      } else {
        setErrorMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
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
                {/* Error Alert */}
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 flex gap-3"
                  >
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-300">Error</p>
                      <p className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}

                {/* Success Alert */}
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-4 flex gap-3"
                  >
                    <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">Success</p>
                      <p className="text-green-700 dark:text-green-400 text-sm">{successMessage}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-white dark:bg-black border rounded-2xl py-4 px-6 text-sm focus:ring-2 outline-none transition-all dark:text-white ${
                        formErrors.name 
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-neutral-800 focus:ring-blue-500'
                      }`}
                      placeholder="John Doe"
                      disabled={isLoading}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs font-semibold">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-white dark:bg-black border rounded-2xl py-4 px-6 text-sm focus:ring-2 outline-none transition-all dark:text-white ${
                        formErrors.email 
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-neutral-800 focus:ring-blue-500'
                      }`}
                      placeholder="john@example.com"
                      disabled={isLoading}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs font-semibold">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full bg-white dark:bg-black border rounded-2xl py-4 px-6 text-sm focus:ring-2 outline-none transition-all dark:text-white ${
                      formErrors.subject 
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 dark:border-neutral-800 focus:ring-blue-500'
                    }`}
                    placeholder="Inquiry about Pro Courses"
                    disabled={isLoading}
                  />
                  {formErrors.subject && (
                    <p className="text-red-500 text-xs font-semibold">{formErrors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Your Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-white dark:bg-black border rounded-2xl py-4 px-6 text-sm focus:ring-2 outline-none transition-all dark:text-white resize-none ${
                      formErrors.message 
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                        : 'border-gray-200 dark:border-neutral-800 focus:ring-blue-500'
                    }`}
                    placeholder="Tell us more about how we can help..."
                    disabled={isLoading}
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-xs font-semibold">{formErrors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`w-full py-5 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Dispatch Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Info & Map Section */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info Cards */}
              {[
                { icon: MapPin, title: "Headquarters", detail: "New Delhi, India" },
                { icon: Phone, title: "Direct Line", detail: "+91 94733362794" },
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
src="https://www.google.com/maps?q=New+Delhi,India&output=embed"
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