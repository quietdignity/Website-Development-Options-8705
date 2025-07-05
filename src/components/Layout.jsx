import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import { SafeIcon, scrollToSection, trackButtonClick, questConfig } from '../utils/common.jsx';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiX, FiArrowUp, FiMail, FiCalendar, FiChevronUp, FiChevronDown } = FiIcons;

// Header Component
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isBlogPost = location.pathname.startsWith('/blog/');
  const isHomePage = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId) => {
    setIsMenuOpen(false);
    if (sectionId === 'home') {
      isHomePage ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/');
    } else if (sectionId === 'contact') {
      if (isHomePage || isBlogPost) {
        const element = document.getElementById('contact-form');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/#contact-form');
      }
    } else {
      scrollToSection(sectionId, navigate, isHomePage);
    }
  };

  return (
    <motion.header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isBlogPost ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      } top-0`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => handleNavigation('home')}
            className="text-2xl font-bold text-blue-900"
            whileHover={{ scale: 1.05 }}
          >
            Workplace Mapping
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['why-it-matters', 'process', 'services', 'experience'].map((section) => (
              <button
                key={section}
                onClick={() => handleNavigation(section)}
                className="text-gray-700 hover:text-blue-600 transition-colors capitalize"
              >
                {section.replace('-', ' ').replace('it matters', 'It Matters')}
              </button>
            ))}
            <motion.button
              onClick={() => handleNavigation('contact')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col space-y-4 px-4">
              {['why-it-matters', 'process', 'services', 'experience'].map((section) => (
                <button
                  key={section}
                  onClick={() => handleNavigation(section)}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors capitalize"
                >
                  {section.replace('-', ' ').replace('it matters', 'It Matters')}
                </button>
              ))}
              <button
                onClick={() => handleNavigation('contact')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}

// Footer Component
export function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (sectionId) => {
    scrollToSection(sectionId, navigate, true);
  };

  return (
    <footer className="bg-gray-900 text-white py-16 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Workplace Mapping</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We help organizations build communication systems that reach everyone who needs them - from headquarters to frontline workers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="mailto:james@workplacemapping.com" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <SafeIcon icon={FiMail} className="h-5 w-5" />
                james@workplacemapping.com
              </a>
              <button onClick={() => handleNavigation('contact-form')} className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
                <SafeIcon icon={FiCalendar} className="h-5 w-5" />
                Book Discovery Call
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {['why-it-matters', 'process', 'services', 'experience'].map((section) => (
                <button
                  key={section}
                  onClick={() => handleNavigation(section)}
                  className="block text-gray-300 hover:text-white transition-colors capitalize"
                >
                  {section.replace('-', ' ').replace('it matters', 'It Matters')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <div className="space-y-3">
              <button onClick={() => handleNavigation('services')} className="block text-gray-300 hover:text-white transition-colors text-left">20-Day Diagnostic</button>
              <button onClick={() => handleNavigation('services')} className="block text-gray-300 hover:text-white transition-colors text-left">Fractional Strategist</button>
              <button onClick={() => handleNavigation('services')} className="block text-gray-300 hover:text-white transition-colors text-left">Infrastructure Rebuild</button>
              <button onClick={() => handleNavigation('contact-form')} className="block text-gray-300 hover:text-white transition-colors text-left">Speaking Engagements</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© 2025 Modern Fire Corp. All rights reserved.</p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SafeIcon icon={FiArrowUp} className="h-5 w-5" />
      </motion.button>
    </footer>
  );
}

// Sticky Bar Component
export function StickyBar() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isBlogPost = location.pathname.startsWith('/blog/');

  useEffect(() => {
    if (isBlogPost) {
      setIsVisible(false);
      return;
    }
    const handleScroll = () => setIsVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogPost]);

  const scrollToContact = () => {
    if (isBlogPost) {
      window.location.href = '/#contact-form';
      return;
    }
    const element = document.getElementById('contact-form');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && !isBlogPost && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-45 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 shadow-lg"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-6 text-center">
            <motion.button onClick={scrollToContact} className="font-semibold hover:underline" whileHover={{ scale: 1.02 }}>
              📞 Schedule a Free Discovery Call
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Feedback Button Component
export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    trackButtonClick(isOpen ? 'Close Feedback' : 'Open Feedback', 'feedback');
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={handleToggle}
        style={{ background: questConfig.PRIMARY_COLOR, writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        className="fixed top-1/2 -right-2 transform -translate-y-1/2 flex items-center justify-center px-3 py-4 text-white z-50 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-right-0"
      >
        <div className="flex items-center gap-2">
          <SafeIcon icon={isOpen ? FiChevronDown : FiChevronUp} className="h-4 w-4 transform rotate-90" />
          <span className="text-sm font-medium tracking-wider">FEEDBACK</span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative max-w-md w-full">
            <FeedbackWorkflow
              uniqueUserId={localStorage.getItem('userId') || questConfig.USER_ID}
              questId={questConfig.QUEST_FEEDBACK_QUESTID}
              isOpen={isOpen}
              accent={questConfig.PRIMARY_COLOR}
              onClose={() => setIsOpen(false)}
              style={{ borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflow: 'auto' }}
            >
              <FeedbackWorkflow.ThankYou />
            </FeedbackWorkflow>
          </div>
        </div>
      )}
    </>
  );
}