'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What types of courses do you offer?',
    answer:
      'We offer a wide range of courses including Coding Bootcamps, Online Degrees, Certification Programs, and Expert-led Workshops covering technologies like Web Development, Data Science, AI, and Cloud Computing.',
  },
  {
    question: 'Can I learn at my own pace?',
    answer:
      'Absolutely! Our platform is designed for flexible learning. You can access course materials 24/7, study at your own speed, and revisit lessons whenever you need.',
  },
  {
    question: 'Do you provide certification?',
    answer:
      'Yes, upon successful completion, you will receive industry-recognized digital certifications that can be instantly shared to LinkedIn or your professional portfolio.',
  },
  {
    question: 'Are the courses industry-recognized?',
    answer:
      'Our curriculum is built in partnership with tech leads from top companies, ensuring the skills you learn are exactly what recruiters are looking for in 2026.',
  },
];

const Question = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white dark:bg-black w-full py-32 px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        
        {/* Left Side - Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2"
        >
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
            <Sparkles size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Support Center</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tighter mb-8">
            Common <span className="text-blue-600">Queries.</span>
          </h2>
          
          <p className="text-gray-500 dark:text-neutral-400 text-lg mb-12 leading-relaxed max-w-lg">
            Everything you need to know about the platform, certifications, and our professional learning paths.
          </p>

          <div className="hidden lg:block relative group">
             <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-all" />
             <div className="relative z-10 p-10 bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2.5rem]">
                <HelpCircle className="text-blue-600 mb-4" size={40} />
                <h4 className="text-xl font-bold dark:text-white mb-2">Still have questions?</h4>
                <p className="text-gray-500 text-sm mb-6">Our support team is available 24/7 to help you with your journey.</p>
                <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                    Contact Support <ChevronDown className="-rotate-90" size={16} />
                </button>
             </div>
          </div>
        </motion.div>

        {/* Right Side - Accordion */}
        <div className="lg:w-1/2 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group border rounded-[1.8rem] transition-all duration-500 ${
                  isOpen 
                  ? "bg-gray-50 dark:bg-neutral-900 border-blue-500/50 shadow-xl shadow-blue-500/5" 
                  : "bg-white dark:bg-black border-gray-100 dark:border-neutral-900 hover:border-blue-500/30"
                }`}
              >
                <button
                  className="w-full px-8 py-7 flex justify-between items-center text-left outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`text-lg font-bold transition-colors duration-300 ${
                    isOpen ? "text-blue-600 dark:text-blue-400" : "text-black dark:text-neutral-300 group-hover:text-blue-600"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full transition-all duration-500 ${
                    isOpen ? "bg-blue-600 text-white rotate-180" : "bg-gray-100 dark:bg-neutral-800 text-gray-500"
                  }`}>
                    <ChevronDown size={18} strokeWidth={3} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-gray-500 dark:text-neutral-400 leading-relaxed text-[15px]">
                        <div className="pt-2 border-t border-gray-200/50 dark:border-neutral-800">
                           {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Question;