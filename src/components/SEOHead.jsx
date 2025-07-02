import React from 'react';
import { useLocation } from 'react-router-dom';

function SEOHead() {
  const location = useLocation();

  // Generate page-specific meta data
  const getPageMeta = () => {
    const hash = location.hash;
    const pathname = location.pathname;

    // Handle blog post pages
    if (pathname.startsWith('/blog/')) {
      const slug = pathname.replace('/blog/', '');
      return {
        title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Workplace Mapping Blog`,
        description: 'Expert insights on workplace communication, distributed teams, and building systems that reach everyone who needs them.',
        canonical: `https://workplacemapping.com${pathname}`
      };
    }

    // Handle hash-based navigation
    switch(hash) {
      case '#why-it-matters':
        return {
          title: 'Why Workplace Mapping Matters - Communication Gaps | Workplace Mapping',
          description: 'Safety alerts and critical updates can stall or get lost. Learn why frontline workers miss important information and how to fix communication gaps.',
          canonical: 'https://workplacemapping.com/#why-it-matters'
        };
      case '#process':
        return {
          title: 'Our Process - Workplace Mapping Methodology | 4-Step System',
          description: 'Discover, Analyze, Design, and Sustain. Our four-step process maps communication gaps and builds systems that reach everyone.',
          canonical: 'https://workplacemapping.com/#process'
        };
      case '#services':
        return {
          title: 'Services - Communication Consulting Options | Workplace Mapping',
          description: '20-Day Diagnostic, Fractional Strategist, and Infrastructure Rebuild services for distributed teams and frontline workers.',
          canonical: 'https://workplacemapping.com/#services'
        };
      case '#blog':
        return {
          title: 'Communication Blog - Expert Insights | Workplace Mapping',
          description: 'Expert insights on workplace communication, distributed teams, and building systems that reach everyone who needs them.',
          canonical: 'https://workplacemapping.com/#blog'
        };
      case '#experience':
        return {
          title: 'Experience - James A. Brown Communications Expert | 20+ Years',
          description: 'Award-winning journalist with 20 years managing communications for thousands of distributed employees across multiple sectors.',
          canonical: 'https://workplacemapping.com/#experience'
        };
      case '#contact-form':
        return {
          title: 'Contact - Get Your Communication Diagnostic | Workplace Mapping',
          description: 'Schedule a consultation or get your 20-day communication diagnostic. Stop losing critical information in communication gaps.',
          canonical: 'https://workplacemapping.com/#contact-form'
        };
      default:
        return {
          title: 'Workplace Mapping - Internal Communications Consulting for Distributed Teams',
          description: 'Help your frontline, deskless, and virtual employees receive critical updates. We map communication gaps and build systems that reach everyone who needs them.',
          canonical: 'https://workplacemapping.com'
        };
    }
  };

  const pageMeta = getPageMeta();

  React.useEffect(() => {
    // Update document title
    document.title = pageMeta.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageMeta.description);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = pageMeta.canonical;

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (ogTitle) ogTitle.setAttribute('content', pageMeta.title);
    if (ogDescription) ogDescription.setAttribute('content', pageMeta.description);
    if (ogUrl) ogUrl.setAttribute('content', pageMeta.canonical);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');

    if (twitterTitle) twitterTitle.setAttribute('content', pageMeta.title);
    if (twitterDescription) twitterDescription.setAttribute('content', pageMeta.description);

  }, [location.hash, location.pathname, pageMeta]);

  return null; // This component doesn't render anything
}

export default SEOHead;