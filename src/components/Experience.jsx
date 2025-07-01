import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAward, FiMic, FiUsers, FiExternalLink } = FiIcons;

function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
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
    {
      name: "Elevating Employee Communications: Shaping the Future of the Modern Employee Experience Conference",
      url: "https://www.aliconferences.com/events/the-future-of-employee-communications/"
    },
    {
      name: "3rd Annual Internal Communications for a Deskless, Frontline & Hybrid Workforce",
      url: "https://www.aliconferences.com/events/3rd-annual-internal-communications-for-a-deskless-frontline-hybrid-workforce/"
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            Experience That Counts
          </motion.h2>

          <div className="max-w-6xl mx-auto">
            {/* Main Description */}
            <motion.div 
              variants={itemVariants}
              className="text-center mb-16"
            >
              <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                Workplace Mapping was developed by award winning journalist James A. Brown. Our unique approach is based on 20 years in marketing, journalism, web development, change management, crisis communications, and managing internal and employee messaging for thousands of distributed employees across government, private, and non-profit sectors.
              </p>
            </motion.div>

            {/* Achievement Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Achievement Image */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={achievement.image} 
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                      <SafeIcon icon={achievement.icon} className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Speaking Engagements */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                  <SafeIcon icon={FiMic} className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Featured Speaker</h3>
                <p className="text-gray-700 mb-6">
                  James has been a featured speaker at Advanced Learning Institute's premier employee communications conferences:
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {conferences.map((conference, index) => (
                  <motion.a
                    key={index}
                    href={conference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium group-hover:text-blue-900">
                        {conference.name}
                      </span>
                      <SafeIcon icon={FiExternalLink} className="h-5 w-5 text-blue-600" />
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Book Speaking Engagement Button */}
              <div className="text-center">
                <motion.button
                  onClick={scrollToContact}
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiMic} className="h-5 w-5" />
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

export default Experience;