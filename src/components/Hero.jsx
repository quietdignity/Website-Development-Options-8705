import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowRight, FiCalendar } = FiIcons;

function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWhy = () => {
    const element = document.getElementById('why-it-matters');
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 pt-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your office staff get every memo but what about your{' '}
            <span className="text-blue-600">frontline workers?</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Critical updates reach your office team but get lost before they reach people working 
            on factory floors, in retail stores, and at customer sites. We trace how information 
            actually moves through your organization, then work with you to build communication 
            systems that reach everyone who needs them.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={scrollToContact}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Your 20-Day Diagnostic
              <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
            </motion.button>

            <motion.button
              onClick={scrollToContact}
              className="bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiCalendar} className="h-5 w-5" />
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Fixed Scroll Indicator - Now properly targets why-it-matters */}
      <motion.button
        onClick={scrollToWhy}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-6 h-10 border-2 border-blue-600 rounded-full flex justify-center cursor-pointer">
          <div className="w-1 h-3 bg-blue-600 rounded-full mt-2"></div>
        </div>
      </motion.button>
    </section>
  );
}

export default Hero;