import React from 'react';
import * as FiIcons from 'react-icons/fi';

// Safe Icon Component
export const SafeIcon = ({ icon, name, ...props }) => {
  let IconComponent;
  try {
    IconComponent = icon || (name && FiIcons[`Fi${name}`]);
  } catch (e) {
    IconComponent = null;
  }
  return IconComponent ? React.createElement(IconComponent, props) : <FiIcons.FiAlertTriangle {...props} />;
};

// Analytics Functions
export const trackEvent = (eventName, eventCategory, eventLabel, value = null) => {
  console.log('Track Event:', { eventName, eventCategory, eventLabel, value });
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    const eventData = { event_category: eventCategory, event_label: eventLabel };
    if (value !== null) eventData.value = value;
    window.gtag('event', eventName, eventData);
  }
};

export const trackButtonClick = (buttonName, buttonLocation) => {
  trackEvent('click', 'engagement', buttonName, { button_location: buttonLocation });
};

export const trackFormSubmission = (formName, formLocation) => {
  trackEvent('form_submit', 'engagement', formName, { form_location: formLocation });
};

// Navigation Helper
export const scrollToSection = (sectionId, navigate, isHomePage) => {
  if (isHomePage) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  } else {
    navigate(`/#${sectionId}`);
  }
};

// Quest Config
export const questConfig = {
  QUEST_FEEDBACK_QUESTID: 'c-greta-feedback-workflow',
  USER_ID: 'u-42772559-8e5f-474b-8c9e-759b68594fd8',
  APIKEY: 'k-9090809f-12d1-46e7-8b8d-f58b987bd018',
  ENTITYID: 'e-8d368c3f-3085-4b50-992a-f8a026795118',
  PRIMARY_COLOR: '#2563eb'
};