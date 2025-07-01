import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function StickyBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 shadow-lg"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-6 text-center">
            <motion.button
              onClick={scrollToContact}
              className="font-semibold hover:underline"
              whileHover={{ scale: 1.02 }}
            >
              📞 Schedule a Free Discovery Call
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StickyBar;