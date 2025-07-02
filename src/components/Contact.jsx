import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackFormSubmission, trackButtonClick } from '../utils/analytics';
import supabase from '../lib/supabase';

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

    // Validate form data
    if (!formData.inquiryType || !formData.firstName || !formData.lastName || 
        !formData.title || !formData.company || !formData.phone || 
        !formData.email || !formData.message) {
      setSubmitError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    trackFormSubmission('contact_form', 'contact_section');

    try {
      console.log('🚀 Submitting contact form...');
      
      const emailData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        company: formData.company,
        title: formData.title,
        phone: formData.phone,
        inquiryType: formData.inquiryType,
        message: formData.message
      };

      // Method 1: Try Supabase Edge Function
      let emailSent = false;
      try {
        console.log('📧 Attempting Supabase email function...');
        const response = await fetch(`https://sdfnpskccbvilzpcpzzo.supabase.co/functions/v1/send-contact-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZm5wc2tjY2J2aWx6cGNwenpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNzUyNjEsImV4cCI6MjA2Njc1MTI2MX0.dkIxMqlYhxNNWbYhiDjelZnLzpdl0OIU84T51hHCXis`,
          },
          body: JSON.stringify(emailData),
        });

        if (response.ok) {
          const result = await response.json();
          emailSent = result.success;
          console.log('✅ Supabase email result:', emailSent ? 'SUCCESS' : 'FAILED');
        }
      } catch (error) {
        console.warn('❌ Supabase email failed:', error);
      }

      // Method 2: Try Formspree as backup
      if (!emailSent) {
        try {
          console.log('📧 Attempting Formspree backup...');
          const formspreeResponse = await fetch('https://formspree.io/f/xanydvvp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: emailData.name,
              email: emailData.email,
              company: emailData.company,
              title: emailData.title,
              phone: emailData.phone,
              inquiryType: emailData.inquiryType,
              message: emailData.message,
              subject: `New ${emailData.inquiryType} from ${emailData.name}`,
              _replyto: emailData.email
            }),
          });

          emailSent = formspreeResponse.ok;
          console.log('✅ Formspree result:', emailSent ? 'SUCCESS' : 'FAILED');
        } catch (error) {
          console.warn('❌ Formspree failed:', error);
        }
      }

      // Method 3: Try Netlify Forms as final backup
      if (!emailSent) {
        try {
          console.log('📧 Attempting Netlify Forms...');
          const netlifyFormData = new FormData();
          netlifyFormData.append('form-name', 'contact');
          netlifyFormData.append('name', emailData.name);
          netlifyFormData.append('email', emailData.email);
          netlifyFormData.append('company', emailData.company);
          netlifyFormData.append('title', emailData.title);
          netlifyFormData.append('phone', emailData.phone);
          netlifyFormData.append('inquiryType', emailData.inquiryType);
          netlifyFormData.append('message', emailData.message);

          const netlifyResponse = await fetch('/', {
            method: 'POST',
            body: netlifyFormData
          });

          emailSent = netlifyResponse.ok;
          console.log('✅ Netlify Forms result:', emailSent ? 'SUCCESS' : 'FAILED');
        } catch (error) {
          console.warn('❌ Netlify Forms failed:', error);
        }
      }

      // Save to database (secondary priority)
      try {
        const { error } = await supabase
          .from('contacts_wm2025')
          .insert([
            {
              inquiry_type: formData.inquiryType,
              first_name: formData.firstName,
              last_name: formData.lastName,
              title: formData.title,
              company: formData.company,
              phone: formData.phone,
              email: formData.email,
              message: formData.message
            }
          ]);

        if (!error) {
          console.log('✅ Database save successful');
        } else {
          console.warn('⚠️ Database save failed:', error);
        }
      } catch (dbError) {
        console.warn('⚠️ Database error:', dbError);
      }

      // Determine final result
      if (emailSent) {
        console.log('🎉 FORM SUBMISSION SUCCESS!');
        setIsSubmitted(true);
        trackFormSubmission('contact_form_success', 'contact_section');

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

        // Hide success after 10 seconds
        setTimeout(() => setIsSubmitted(false), 10000);

      } else {
        console.error('❌ ALL EMAIL METHODS FAILED');
        setSubmitError('We\'re experiencing technical difficulties. Please email us directly at james@workplacemapping.com or try again in a few minutes.');
      }

    } catch (error) {
      console.error('💥 Critical form error:', error);
      setSubmitError('Connection error. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDiscoveryCallClick = () => {
    trackButtonClick('discovery_call', 'contact_section');
  };

  const handleDiagnosticButtonClick = () => {
    trackButtonClick('diagnostic_button', 'contact_section');
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
                  handleDiagnosticButtonClick();
                  scrollToContact();
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
                onClick={handleDiscoveryCallClick}
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
                      <a href="mailto:james@workplacemapping.com" className="text-blue-600 hover:underline">
                        james@workplacemapping.com
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
                        onClick={handleDiscoveryCallClick}
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
                      className="mb-6 p-6 bg-green-100 border border-green-300 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <SafeIcon icon={FiCheckCircle} className="h-8 w-8 text-green-600" />
                        <span className="text-green-800 font-bold text-lg">
                          ✅ Message Sent Successfully!
                        </span>
                      </div>
                      <p className="text-green-700 text-base leading-relaxed">
                        Thank you for your inquiry! We've received your message and will respond within 24 hours. 
                        Check your email for a confirmation, and feel free to reach out 
                        if you have any urgent questions.
                      </p>
                    </motion.div>
                  )}

                  {submitError && (
                    <motion.div
                      className="mb-6 p-6 bg-red-100 border border-red-300 rounded-lg flex items-start gap-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <SafeIcon icon={FiAlertCircle} className="h-8 w-8 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-red-800 font-bold text-lg block mb-2">
                          ❌ Unable to Send Message
                        </span>
                        <p className="text-red-700 text-base leading-relaxed mb-3">
                          {submitError}
                        </p>
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-red-800 font-medium text-sm mb-2">Alternative Contact Methods:</p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <a 
                              href="mailto:james@workplacemapping.com" 
                              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              <SafeIcon icon={FiMail} className="h-4 w-4" />
                              Email Directly
                            </a>
                            <a
                              href="https://tidycal.com/jamesbrowntv/workplace-mapping-consultation"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                              Book Call
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
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
                      {isSubmitting ? '📧 Sending Message...' : 'Send Message'}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden Netlify form for form detection */}
      <form name="contact" netlify hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="company" />
        <input type="text" name="title" />
        <input type="tel" name="phone" />
        <input type="text" name="inquiryType" />
        <textarea name="message"></textarea>
      </form>
    </section>
  );
}

export default Contact;