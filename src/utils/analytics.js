// Analytics utility functions - simplified for development
export const trackEvent = (eventName, eventCategory, eventLabel, value = null) => {
  console.log('Track Event:', { eventName, eventCategory, eventLabel, value });
};

export const trackPageView = (pagePath, pageTitle) => {
  console.log('Track Page View:', { pagePath, pageTitle });
};

export const trackFormSubmission = (formName, formLocation) => {
  console.log('Track Form Submission:', { formName, formLocation });
};

export const trackButtonClick = (buttonName, buttonLocation) => {
  console.log('Track Button Click:', { buttonName, buttonLocation });
};

export const trackSectionView = (sectionName) => {
  console.log('Track Section View:', sectionName);
};

export const trackExternalLink = (linkUrl, linkText) => {
  console.log('Track External Link:', { linkUrl, linkText });
};

export const trackDownload = (fileName, fileType) => {
  console.log('Track Download:', { fileName, fileType });
};

export const trackVideoPlay = (videoTitle, videoLocation) => {
  console.log('Track Video Play:', { videoTitle, videoLocation });
};

export const trackScrollDepth = (percentage) => {
  console.log('Track Scroll Depth:', `${percentage}%`);
};

export const trackTimeOnPage = (timeInSeconds) => {
  console.log('Track Time on Page:', `${timeInSeconds} seconds`);
};