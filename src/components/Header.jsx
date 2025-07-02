import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiX } = FiIcons;

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.header
      className={`fixed top-12 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={scrollToTop}
            className="text-2xl font-bold text-blue-900"
            whileHover={{ scale: 1.05 }}
          >
            Workplace Mapping
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('why-it-matters')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Why It Matters
            </button>
            <button
              onClick={() => scrollToSection('process')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Process
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Experience
            </button>
            <motion.button
              onClick={scrollToContact}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col space-y-4 px-4">
              <button
                onClick={() => scrollToSection('why-it-matters')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Why It Matters
              </button>
              <button
                onClick={() => scrollToSection('process')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Process
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('blog')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Blog
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Experience
              </button>
              <button
                onClick={scrollToContact}
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

export default Header;