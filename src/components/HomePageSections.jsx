import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SafeIcon, trackButtonClick, scrollToSection } from '../utils/common.jsx';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiCalendar, FiAlertTriangle, FiMessageCircle, FiClock, FiSearch, FiBarChart, FiTool, FiTrendingUp, FiDollarSign, FiAward, FiMic, FiUsers, FiExternalLink } = FiIcons;

// Hero Section
export function Hero() {
  const navigate = useNavigate();
  
  const scrollToContact = () => {
    trackButtonClick('get_diagnostic', 'hero_section');
    const element = document.getElementById('contact-form');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWhy = () => {
    scrollToSection('why-it-matters', navigate, true);
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
            Critical updates reach your office team but get lost before they reach people working on factory floors, in retail stores, and at customer sites. We trace how information actually moves through your organization, then work with you to build communication systems that reach everyone who needs them.
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

// Why It Matters Section
export function WhyItMatters() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="why-it-matters" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Why It Matters
          </motion.h2>
          
          <motion.div variants={itemVariants} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 mb-16 border-l-4 border-red-500">
            <div className="flex items-start gap-4">
              <SafeIcon icon={FiAlertTriangle} className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Critical Gap</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Safety alerts, policy changes or urgent notices can stall or stray off course. When that happens, your teams create workarounds using group chats and word of mouth. The result? Critical safety updates reach some workers hours or days late, creating unnecessary risk and operational confusion.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="bg-blue-50 rounded-xl p-8 text-center">
              <SafeIcon icon={FiMessageCircle} className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Informal Networks</h4>
              <p className="text-gray-700">
                Teams create their own communication channels when official ones fail, leading to inconsistent messaging and information gaps.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-orange-50 rounded-xl p-8 text-center">
              <SafeIcon icon={FiClock} className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Delayed Updates</h4>
              <p className="text-gray-700">
                Critical information reaches frontline workers hours or days late, creating safety risks and operational confusion.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Process Section
export function Process() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const steps = [
    { icon: FiSearch, title: "Discover", description: "We survey and interview members of your team and follow how messages are shared through the channels your teams actually use.", color: "blue" },
    { icon: FiBarChart, title: "Analyze", description: "We compare your official channels to the informal networks that spring up on the ground. We map where information flows, where it gets stuck and where it disappears.", color: "green" },
    { icon: FiTool, title: "Design", description: "Together, we build a communication system that fits your team and organization, setting up main channels with backup options and ways to get feedback so nothing important gets missed.", color: "purple" },
    { icon: FiTrendingUp, title: "Sustain", description: "We train your team and set up simple processes so your new system works long-term. You will learn to spot new problems and adjust as your organization changes.", color: "orange" }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="process" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            Our Four-Step Process
          </motion.h2>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 ${getColorClasses(step.color)} mb-4`}>
                        <SafeIcon icon={step.icon} className="h-8 w-8" />
                      </div>
                      <div className="text-sm font-semibold text-gray-500 mb-2">Step {index + 1}</div>
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2 z-10"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Services Section
export function Services() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToContact = () => {
    trackButtonClick('Contact for Quote', 'services_section');
    const element = document.getElementById('contact-form');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      image: "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386112924-IMG_4231.jpg",
      title: "20-Day Diagnostic",
      price: "Starting at $10,000",
      features: [
        "Surveys across all workforce segments",
        "Following important updates through real channels",
        "Map of communication gaps",
        "Clear recommendations in 20 business days"
      ]
    },
    {
      image: "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386118747-blob",
      title: "Fractional Communications Strategist",
      price: "Contact for quote",
      features: [
        "Monthly strategy sessions",
        "Quarterly system health checks",
        "Crisis guidance when you need it",
        "Team training and development"
      ]
    },
    {
      image: "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386140488-IMG_5606.jpg",
      title: "Infrastructure Rebuild",
      price: "Contact for quote",
      features: [
        "In-depth investigation",
        "Custom system design",
        "Hands-on implementation support",
        "Change management training"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            Service Options
          </motion.h2>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: index * 0.2 }}
                  className={`bg-white rounded-2xl shadow-lg border-2 hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="h-48 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <div className="flex items-center justify-center gap-2 text-lg font-semibold text-blue-600">
                        <SafeIcon icon={FiDollarSign} className="h-5 w-5" />
                        {service.price}
                      </div>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      onClick={scrollToContact}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        index === 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Contact for Quote
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.6 }}
              className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center border border-amber-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Limited Partnerships Available</h3>
              <p className="text-lg text-gray-700 mb-6">
                Pricing is based on scope and complexity of your project. We work with a select number of clients to ensure dedicated attention and results.
              </p>
              <motion.button
                onClick={scrollToContact}
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Availability
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Experience Section
export function Experience() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToContact = () => {
    trackButtonClick('Book James to Speak', 'experience_section');
    const element = document.getElementById('contact-form');
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const achievements = [
    {
      image: "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386649549-blob",
      icon: FiAward,
      title: "Award-Winning Expertise",
      description: "Developed by award-winning journalist James A. Brown with 20 years of experience across marketing, journalism, web development, change management, and crisis communications."
    },
    {
      image: "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386674705-blob",
      icon: FiUsers,
      title: "Proven Scale",
      description: "Successfully managed internal and employee messaging for thousands of distributed employees across government, private, and non-profit sectors."
    },
    {
      image: "https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751386713631-IMG_8514.jpg",
      icon: FiMic,
      title: "Industry Recognition",
      description: "Featured speaker at leading employee communications conferences, sharing insights on the future of workforce communication."
    }
  ];

  const conferences = [
    { name: "Elevating Employee Communications: Shaping the Future of the Modern Employee Experience Conference", url: "https://www.aliconferences.com/events/the-future-of-employee-communications/" },
    { name: "3rd Annual Internal Communications for a Deskless, Frontline & Hybrid Workforce", url: "https://www.aliconferences.com/events/3rd-annual-internal-communications-for-a-deskless-frontline-hybrid-workforce/" }
  ];

  return (
    <section id="experience" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            Experience That Counts
          </motion.h2>
          
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              className="text-center mb-16"
            >
              <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                Workplace Mapping was developed by award winning journalist James A. Brown. Our unique approach is based on 20 years in marketing, journalism, web development, change management, crisis communications, and managing internal and employee messaging for thousands of distributed employees across government, private, and non-profit sectors.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={achievement.image} alt={achievement.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                      <SafeIcon icon={achievement.icon} className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{achievement.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-48 h-48 mb-8 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                  <img src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751387299465-me.jpg" alt="James A. Brown" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Featured Speaker</h3>
                <div className="w-full flex justify-center mb-6">
                  <p className="text-2xl font-bold text-purple-600">James A. Brown</p>
                </div>
                <p className="text-lg text-gray-700 max-w-3xl leading-relaxed mb-12">
                  James has been a featured speaker at Advanced Learning Institute's premier employee communications conferences, sharing insights on the future of workforce communication and distributed team management.
                </p>
              </div>

              <div className="max-w-4xl mx-auto mb-10">
                <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">Speaking Engagements</h4>
                <div className="space-y-4">
                  {conferences.map((conference, index) => (
                    <motion.a
                      key={index}
                      href={conference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group border border-blue-100"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-blue-800 font-semibold group-hover:text-blue-900 text-lg">
                            {conference.name}
                          </span>
                        </div>
                        <div className="ml-4 bg-blue-600 p-2 rounded-full group-hover:bg-blue-700 transition-colors">
                          <SafeIcon icon={FiExternalLink} className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <motion.button
                  onClick={scrollToContact}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiMic} className="h-6 w-6" />
                  Book James to Speak or Deliver a Workshop
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}