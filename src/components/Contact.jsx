import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiPhone, FiCalendar, FiCheckCircle, FiSend, FiAlertCircle } = FiIcons;

function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    inquiryType: '',
    firstName: '',
    lastName: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Create URLSearchParams for form data
      const formDataParams = new URLSearchParams();
      formDataParams.append('form-name', 'contact');
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataParams.append(key, formData[key]);
      });

      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataParams.toString()
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          inquiryType: '',
          firstName: '',
          lastName: '',
          title: '',
          company: '',
          phone: '',
          email: '',
          message: ''
        });
        
        // Track successful form submission
        if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
          window.gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'contact_form_success'
          });
        }
        
        setTimeout(() => setIsSubmitted(false), 8000);
      } else {
        // Fallback to mailto
        const subject = `Workplace Mapping Inquiry: ${formData.inquiryType}`;
        const body = `
Inquiry Type: ${formData.inquiryType}
Name: ${formData.firstName} ${formData.lastName}
Title: ${formData.title}
Company: ${formData.company}
Phone: ${formData.phone}
Email: ${formData.email}

Message:
${formData.message}

---
This message was sent from the Workplace Mapping contact form.
Please respond to: ${formData.email}
        `;
        
        const mailtoLink = `mailto:team@workplacemapping.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        
        setIsSubmitted(true);
        // Reset form
        setFormData({
          inquiryType: '',
          firstName: '',
          lastName: '',
          title: '',
          company: '',
          phone: '',
          email: '',
          message: ''
        });
        
        setTimeout(() => setIsSubmitted(false), 8000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Fallback to mailto
      const subject = `Workplace Mapping Inquiry: ${formData.inquiryType}`;
      const body = `
Inquiry Type: ${formData.inquiryType}
Name: ${formData.firstName} ${formData.lastName}
Title: ${formData.title}
Company: ${formData.company}
Phone: ${formData.phone}
Email: ${formData.email}

Message:
${formData.message}

---
This message was sent from the Workplace Mapping contact form.
Please respond to: ${formData.email}
      `;
      
      const mailtoLink = `mailto:team@workplacemapping.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      
      setIsSubmitted(true);
      // Reset form
      setFormData({
        inquiryType: '',
        firstName: '',
        lastName: '',
        title: '',
        company: '',
        phone: '',
        email: '',
        message: ''
      });
      
      setTimeout(() => setIsSubmitted(false), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const inquiryTypes = [
    "Schedule a Consultation",
    "Communications Diagnostic",
    "Fractional Internal Communications Strategist",
    "Complete Workplace Mapping",
    "Workshops & Team Training",
    "Speaking Engagements",
    "Press Inquiries & Interviews",
    "Other Inquiry"
  ];

  return (
    <section id="contact-form" className="py-20 bg-white" ref={ref}>
      {/* Hidden Netlify form for form detection */}
      <form name="contact" netlify="true" netlify-honeypot="bot-field" hidden>
        <input type="text" name="inquiryType" />
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
        <input type="text" name="title" />
        <input type="text" name="company" />
        <input type="text" name="phone" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
      </form>

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
            Stop losing critical information in communication gaps
          </motion.h2>

          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <motion.button
                onClick={() => {
                  const element = document.getElementById('contact-form');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Your 20-Day Diagnostic
                <SafeIcon icon={FiMail} className="h-5 w-5" />
              </motion.button>

              <motion.a
                href="https://tidycal.com/jamesbrowntv/workplace-mapping-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiCalendar} className="h-5 w-5" />
                Book Discovery Call
              </motion.a>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiMail} className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <a
                        href="mailto:team@workplacemapping.com"
                        className="text-blue-600 hover:underline"
                      >
                        team@workplacemapping.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiCalendar} className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Schedule a Call</h4>
                      <a
                        href="https://tidycal.com/jamesbrowntv/workplace-mapping-consultation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Book consultation
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                  <p className="text-gray-700">We'll respond to your inquiry within 24 hours.</p>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>

                  {isSubmitted && (
                    <motion.div
                      className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <SafeIcon icon={FiCheckCircle} className="h-6 w-6 text-green-600" />
                      <span className="text-green-800 font-medium">
                        Thank you for your inquiry! We'll respond within 24 hours.
                      </span>
                    </motion.div>
                  )}

                  {submitError && (
                    <motion.div
                      className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <SafeIcon icon={FiAlertCircle} className="h-6 w-6 text-red-600" />
                      <span className="text-red-800 font-medium">
                        {submitError}
                      </span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div hidden>
                      <input name="bot-field" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Company *
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message/Details *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell us about your communication challenges and what you're looking to achieve..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 ${
                        isSubmitting 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      <SafeIcon icon={FiSend} className="h-5 w-5" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;