import { useEffect } from 'react';

const usePageTracking = () => {
  useEffect(() => {
    // Track page views on route changes
    console.log('Page tracking initialized');
  }, []);

  useEffect(() => {
    // Track scroll depth
    let maxScrollDepth = 0;
    
    const trackScrollDepth = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      // Track at 25%, 50%, 75%, and 100% scroll depths
      if (scrollDepth >= 25 && maxScrollDepth < 25) {
        maxScrollDepth = 25;
        console.log('Scroll depth: 25%');
      } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
        maxScrollDepth = 50;
        console.log('Scroll depth: 50%');
      } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
        maxScrollDepth = 75;
        console.log('Scroll depth: 75%');
      } else if (scrollDepth >= 100 && maxScrollDepth < 100) {
        maxScrollDepth = 100;
        console.log('Scroll depth: 100%');
      }
    };

    window.addEventListener('scroll', trackScrollDepth);
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, []);

  useEffect(() => {
    // Track time on page
    const startTime = Date.now();
    
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 10) {
        console.log(`Time on page: ${timeSpent} seconds`);
      }
    };

    window.addEventListener('beforeunload', trackTimeOnPage);
    return () => {
      window.removeEventListener('beforeunload', trackTimeOnPage);
      trackTimeOnPage();
    };
  }, []);
};

export default usePageTracking;