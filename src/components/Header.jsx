import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiX } = FiIcons;

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on a blog post page
  const isBlogPost = location.pathname.startsWith('/blog/');
  const isHomePage = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      setStickyBarVisible(scrollY > 600 && !isBlogPost);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogPost]);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      // We're on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // We're on another page, navigate to home page with hash
      navigate(`/#${sectionId}`);
    }
  };

  const scrollToTop = () => {
    setIsMenuOpen(false);
    
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const scrollToContact = () => {
    setIsMenuOpen(false);
    
    if (isBlogPost) {
      // Scroll to contact form on current blog page
      const element = document.getElementById('contact-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    if (isHomePage) {
      // We're on home page, scroll to contact
      const element = document.getElementById('contact-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page contact form
      navigate('/#contact-form');
    }
  };

  // Calculate top position based on sticky bar visibility
  const getTopPosition = () => {
    if (isBlogPost) return 'top-0';
    if (isScrolled && stickyBarVisible) return 'top-[52px]';
    if (isScrolled) return 'top-0';
    return 'top-12';
  };

  return (
    <motion.header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isBlogPost 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      } ${getTopPosition()}`}
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