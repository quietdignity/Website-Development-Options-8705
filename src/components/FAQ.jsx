import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackButtonClick, trackSectionView } from '../utils/analytics';

const { 
  FiSearch, 
  FiChevronDown, 
  FiChevronUp, 
  FiHelpCircle, 
  FiCalendar, 
  FiMail,
  FiSettings,
  FiClock,
  FiDollarSign,
  FiAward,
  FiX
} = FiIcons;

function FAQ() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Track section view
  React.useEffect(() => {
    if (inView) {
      trackSectionView('faq_section');
    }
  }, [inView]);

  const faqData = [
    {
      id: 1,
      category: 'services',
      question: "What exactly is workplace mapping?",
      answer: "We trace how information actually moves through your organization - from headquarters to frontline workers. Then we help you build communication systems that reach everyone who needs them, not just office staff.",
      tags: ['workplace mapping', 'communication', 'information flow']
    },
    {
      id: 2,
      category: 'services',
      question: "How is this different from regular communication consulting?",
      answer: "Most consultants focus on improving messages. We focus on building better systems. We map both your official channels AND the informal networks people actually use to share information.",
      tags: ['consulting', 'difference', 'systems', 'networks']
    },
    {
      id: 3,
      category: 'diagnostic',
      question: "What's included in the 20-day diagnostic?",
      answer: "Surveys across your workforce, interviews with team members, following important updates through real channels, mapping communication gaps, and clear recommendations. Price starts at $10,000.",
      tags: ['diagnostic', 'surveys', 'interviews', 'recommendations', 'price']
    },
    {
      id: 4,
      category: 'target',
      question: "Who is this for?",
      answer: "Organizations where critical updates reach office staff but get lost before reaching people on factory floors, in retail stores, or at customer sites. Perfect for manufacturing, retail chains, field services, and distributed teams.",
      tags: ['target audience', 'manufacturing', 'retail', 'field services', 'distributed teams']
    },
    {
      id: 5,
      category: 'process',
      question: "How long does the process take?",
      answer: "Diagnostic: 20 business days. Fractional strategist: ongoing monthly support. Complete workplace mapping: 8-16 months depending on organization size.",
      tags: ['timeline', 'duration', 'process', 'months']
    },
    {
      id: 6,
      category: 'services',
      question: "Do you work with remote teams?",
      answer: "Yes. We work with office workers, hybrid teams, and field crews. Our systems reach everyone regardless of where they work.",
      tags: ['remote teams', 'hybrid', 'field crews', 'distributed']
    },
    {
      id: 7,
      category: 'services',
      question: "What's the difference between your services?",
      answer: "Diagnostic identifies problems and gives recommendations. Fractional strategist provides ongoing monthly support. Complete mapping rebuilds your entire communication infrastructure.",
      tags: ['services', 'diagnostic', 'fractional', 'complete mapping', 'infrastructure']
    },
    {
      id: 8,
      category: 'booking',
      question: "Can I schedule a discovery call?",
      answer: "Yes! Book directly at https://tidycal.com/jamesbrowntv/workplace-mapping-consultation or use our contact form below.",
      tags: ['discovery call', 'booking', 'consultation', 'schedule']
    },
    {
      id: 9,
      category: 'pricing',
      question: "How much does this cost?",
      answer: "Diagnostic starts at $10,000. Other services vary by scope and complexity. Use our contact form for a custom quote.",
      tags: ['pricing', 'cost', 'quote', 'budget']
    },
    {
      id: 10,
      category: 'experience',
      question: "What's your experience?",
      answer: "Developed through managing communications for 3,000+ distributed employees across government and private sector organizations. Nearly twenty years across journalism, speechwriting, marketing, and internal communications.",
      tags: ['experience', 'background', 'credentials', 'expertise']
    },
    {
      id: 11,
      category: 'process',
      question: "What happens during the discovery phase?",
      answer: "We survey all workforce segments, conduct interviews with team members at different levels, follow how critical updates actually move through your organization, and map where information gets stuck or lost.",
      tags: ['discovery', 'surveys', 'interviews', 'mapping', 'analysis']
    },
    {
      id: 12,
      category: 'results',
      question: "What kind of results can we expect?",
      answer: "Typical improvements include 40-60% better message reach rates, 70% reduction in communication delays, and significant decreases in safety incidents related to missed communications.",
      tags: ['results', 'improvement', 'metrics', 'safety', 'reach rates']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: FiHelpCircle },
    { id: 'services', name: 'Services', icon: FiSettings },
    { id: 'diagnostic', name: 'Diagnostic', icon: FiSearch },
    { id: 'process', name: 'Process', icon: FiClock },
    { id: 'pricing', name: 'Pricing', icon: FiDollarSign },
    { id: 'booking', name: 'Booking', icon: FiCalendar },
    { id: 'experience', name: 'Experience', icon: FiAward },
    { id: 'target', name: 'Target Audience', icon: FiHelpCircle },
    { id: 'results', name: 'Results', icon: FiHelpCircle }
  ];

  // Filter FAQs based on search term and category
  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleItem = (id) => {
    trackButtonClick(`FAQ Toggle - ${id}`, 'faq_section');
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const handleCategoryChange = (category) => {
    trackButtonClick(`FAQ Category - ${category}`, 'faq_section');
    setSelectedCategory(category);
    setOpenItems(new Set()); // Close all items when changing category
  };

  const scrollToContact = () => {
    trackButtonClick('FAQ Contact Button', 'faq_section');
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingClick = () => {
    trackButtonClick('FAQ Booking Button', 'faq_section');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    trackButtonClick('FAQ Search', 'faq_section');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="faq" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8"
          >
            Frequently Asked Questions
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto"
          >
            Find answers to common questions about workplace mapping, our services, and how we can help your organization improve communication.
          </motion.p>

          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="relative">
                <SafeIcon 
                  icon={FiSearch} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
                    }`}
                  >
                    <SafeIcon icon={category.icon} className="h-4 w-4" />
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Search Results Count */}
            {(searchTerm || selectedCategory !== 'all') && (
              <motion.div 
                variants={itemVariants}
                className="mb-6 text-center text-gray-600"
              >
                {searchTerm ? (
                  <>Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchTerm}"</>
                ) : (
                  <>Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} in {categories.find(c => c.id === selectedCategory)?.name}</>
                )}
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={clearSearch}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            )}

            {/* FAQ Items */}
            <motion.div variants={itemVariants} className="space-y-4">
              <AnimatePresence mode="wait">
                {filteredFAQs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {searchTerm && faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                          <span dangerouslySetInnerHTML={{
                            __html: faq.question.replace(
                              new RegExp(`(${searchTerm})`, 'gi'),
                              '<mark class="bg-yellow-200">$1</mark>'
                            )
                          }} />
                        ) : (
                          faq.question
                        )}
                      </h3>
                      <SafeIcon 
                        icon={openItems.has(faq.id) ? FiChevronUp : FiChevronDown}
                        className="h-5 w-5 text-gray-500 flex-shrink-0"
                      />
                    </button>
                    
                    <AnimatePresence>
                      {openItems.has(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <p className="text-gray-700 leading-relaxed">
                              {searchTerm && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                                <span dangerouslySetInnerHTML={{
                                  __html: faq.answer.replace(
                                    new RegExp(`(${searchTerm})`, 'gi'),
                                    '<mark class="bg-yellow-200">$1</mark>'
                                  )
                                }} />
                              ) : (
                                faq.answer
                              )}
                            </p>
                            {faq.id === 8 && (
                              <div className="mt-4 flex flex-wrap gap-3">
                                <a
                                  href="https://tidycal.com/jamesbrowntv/workplace-mapping-consultation"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={handleBookingClick}
                                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                                  Book Now
                                </a>
                                <button
                                  onClick={scrollToContact}
                                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <SafeIcon icon={FiMail} className="h-4 w-4" />
                                  Contact Form
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
              <motion.div 
                variants={itemVariants}
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <SafeIcon icon={FiHelpCircle} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 
                    `No questions match "${searchTerm}". Try different keywords or browse categories.` :
                    'No questions in this category. Try selecting a different category.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearSearch}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={scrollToContact}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
                  >
                    <SafeIcon icon={FiMail} className="h-5 w-5" />
                    Ask Your Question
                  </button>
                  <a
                    href="https://tidycal.com/jamesbrowntv/workplace-mapping-consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleBookingClick}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center"
                  >
                    <SafeIcon icon={FiCalendar} className="h-5 w-5" />
                    Schedule a Call
                  </a>
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? We're here to help. Schedule a discovery call or send us a message.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://tidycal.com/jamesbrowntv/workplace-mapping-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBookingClick}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center"
                >
                  <SafeIcon icon={FiCalendar} className="h-5 w-5" />
                  Book Discovery Call
                </a>
                <button
                  onClick={scrollToContact}
                  className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors flex items-center gap-2 justify-center"
                >
                  <SafeIcon icon={FiMail} className="h-5 w-5" />
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FAQ;