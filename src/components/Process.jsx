import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiBarChart, FiTool, FiTrendingUp } = FiIcons;

function Process() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const steps = [
    {
      icon: FiSearch,
      title: "Discover",
      description: "We survey and interview members of your team and follow how messages are shared through the channels your teams actually use.",
      color: "blue"
    },
    {
      icon: FiBarChart,
      title: "Analyze",
      description: "We compare your official channels to the informal networks that spring up on the ground. We map where information flows, where it gets stuck and where it disappears.",
      color: "green"
    },
    {
      icon: FiTool,
      title: "Design",
      description: "Together, we build a communication system that fits your team and organization, setting up main channels with backup options and ways to get feedback so nothing important gets missed.",
      color: "purple"
    },
    {
      icon: FiTrendingUp,
      title: "Sustain",
      description: "We train your team and set up simple processes so your new system works long-term. You will learn to spot new problems and adjust as your organization changes.",
      color: "orange"
    }
  ];

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
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16"
          >
            Our Four-Step Process
          </motion.h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 ${getColorClasses(step.color)} mb-4`}>
                        <SafeIcon icon={step.icon} className="h-8 w-8" />
                      </div>
                      <div className="text-sm font-semibold text-gray-500 mb-2">
                        Step {index + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connection Line */}
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

export default Process;