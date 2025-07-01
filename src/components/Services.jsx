import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackButtonClick } from '../utils/analytics';

const { FiDollarSign } = FiIcons;

function Services() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToContact = () => {
    trackButtonClick('Contact for Quote', 'services_section');
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAvailabilityClick = () => {
    trackButtonClick('Learn More About Availability', 'services_section');
    scrollToContact();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="services" className="py-20 bg-white" ref={ref}>
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
            Service Options
          </motion.h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={itemVariants}
                  className={`bg-white rounded-2xl shadow-lg border-2 hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {/* Service Image */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
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
                        index === 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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

            {/* Limited Partnerships Notice */}
            <motion.div
              variants={itemVariants}
              className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center border border-amber-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Limited Partnerships Available</h3>
              <p className="text-lg text-gray-700 mb-6">
                Pricing is based on scope and complexity of your project. We work with a select number of clients to ensure dedicated attention and results.
              </p>
              <motion.button
                onClick={handleAvailabilityClick}
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

export default Services;