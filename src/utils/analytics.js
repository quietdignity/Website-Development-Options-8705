// Analytics utility functions with Google Analytics 4 integration

// Track events with Google Analytics 4
export const trackEvent = (eventName, eventCategory, eventLabel, value = null) => {
  console.log('Track Event:', { eventName, eventCategory, eventLabel, value });
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    const eventData = {
      event_category: eventCategory,
      event_label: eventLabel
    };
    
    if (value !== null) {
      eventData.value = value;
    }
    
    window.gtag('event', eventName, eventData);
  }
};

export const trackPageView = (pagePath, pageTitle) => {
  console.log('Track Page View:', { pagePath, pageTitle });
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-LX0W4B0RSH', {
      page_title: pageTitle,
      page_location: window.location.href
    });
  }
};

export const trackFormSubmission = (formName, formLocation) => {
  console.log('Track Form Submission:', { formName, formLocation });
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'form_submit', {
      event_category: 'engagement',
      event_label: formName,
      form_location: formLocation
    });
  }
};

export const trackButtonClick = (buttonName, buttonLocation) => {
  console.log('Track Button Click:', { buttonName, buttonLocation });
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'click', {
      event_category: 'engagement',
      event_label: buttonName,
      button_location: buttonLocation
    });
  }
};

export const trackSectionView = (sectionName) => {
  console.log('Track Section View:', sectionName);
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'section_view', {
      event_category: 'engagement',
      event_label: sectionName
    });
  }
};

export const trackExternalLink = (linkUrl, linkText) => {
  console.log('Track External Link:', { linkUrl, linkText });
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: linkText,
      transport_type: 'beacon',
      external_url: linkUrl
    });
  }
};

export const trackDownload = (fileName, fileType) => {
  console.log('Track Download:', { fileName, fileType });
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'file_download', {
      event_category: 'engagement',
      event_label: fileName,
      file_extension: fileType
    });
  }
};

export const trackVideoPlay = (videoTitle, videoLocation) => {
  console.log('Track Video Play:', { videoTitle, videoLocation });
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'video_play', {
      event_category: 'engagement',
      event_label: videoTitle,
      video_location: videoLocation
    });
  }
};

export const trackScrollDepth = (percentage) => {
  console.log('Track Scroll Depth:', `${percentage}%`);
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      scroll_depth: percentage
    });
  }
};

export const trackTimeOnPage = (timeInSeconds) => {
  console.log('Track Time on Page:', `${timeInSeconds} seconds`);
  
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'timing_complete', {
      event_category: 'engagement',
      event_label: 'time_on_page',
      value: timeInSeconds
    });
  }
};