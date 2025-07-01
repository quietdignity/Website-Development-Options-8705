import React, { useState } from 'react';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import questConfig from '../config/questConfig';

const { FiChevronUp, FiChevronDown } = FiIcons;

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const EventTracking = () => {
    // Track feedback button click event
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'feedback_button_click', {
        event_category: 'engagement',
        event_label: 'feedback_workflow'
      });
    }
  };

  const handleToggle = () => {
    EventTracking();
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={handleToggle}
        style={{ 
          background: questConfig.PRIMARY_COLOR,
          writingMode: 'vertical-rl',
          textOrientation: 'mixed'
        }}
        className="fixed top-1/2 -right-2 transform -translate-y-1/2 flex items-center justify-center px-3 py-4 text-white z-50 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-right-0 group"
        aria-label="Open feedback form"
      >
        <div className="flex items-center gap-2">
          <div className="transform rotate-0 transition-transform duration-300">
            <SafeIcon 
              icon={isOpen ? FiChevronDown : FiChevronUp} 
              className="h-4 w-4 transform rotate-90" 
            />
          </div>
          <span className="text-sm font-medium tracking-wider">
            FEEDBACK
          </span>
        </div>
      </button>

      {/* Feedback Workflow Component */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative max-w-md w-full">
            <FeedbackWorkflow
              uniqueUserId={localStorage.getItem('userId') || questConfig.USER_ID}
              questId={questConfig.QUEST_FEEDBACK_QUESTID}
              isOpen={isOpen}
              accent={questConfig.PRIMARY_COLOR}
              onClose={() => setIsOpen(false)}
              style={{
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >
              <FeedbackWorkflow.ThankYou />
            </FeedbackWorkflow>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;