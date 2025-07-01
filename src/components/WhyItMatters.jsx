import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiAlertTriangle, FiMessageCircle, FiClock } = FiIcons;

function WhyItMatters() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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

  return (
    <section id="why-it-matters" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            Why It Matters
          </motion.h2>

          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 mb-16 border-l-4 border-red-500"
          >
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

          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-blue-50 rounded-xl p-8 text-center"
            >
              <SafeIcon icon={FiMessageCircle} className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Informal Networks</h4>
              <p className="text-gray-700">
                Teams create their own communication channels when official ones fail, leading to inconsistent messaging and information gaps.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-orange-50 rounded-xl p-8 text-center"
            >
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

export default WhyItMatters;