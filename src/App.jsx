import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import { Header, Footer, StickyBar, FeedbackButton } from './components/Layout.jsx';
import { Hero, WhyItMatters, Process, Services, Experience } from './components/HomePageSections.jsx';
import Contact from './components/Contact.jsx';
import { questConfig } from './utils/common.jsx';

// SEO Head Component
function SEOHead() {
  const location = useLocation();

  const getPageMeta = () => {
    const hash = location.hash;
    const pathname = location.pathname;

    if (pathname.startsWith('/blog/')) {
      const slug = pathname.replace('/blog/', '');
      return {
        title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Workplace Mapping Blog`,
        description: 'Expert insights on workplace communication, distributed teams, and building systems that reach everyone who needs them.',
        canonical: `https://workplacemapping.com${pathname}`
      };
    }

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

  useEffect(() => {
    document.title = pageMeta.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageMeta.description);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = pageMeta.canonical;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageMeta.title);
    if (ogDescription) ogDescription.setAttribute('content', pageMeta.description);
    if (ogUrl) ogUrl.setAttribute('content', pageMeta.canonical);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    
    if (twitterTitle) twitterTitle.setAttribute('content', pageMeta.title);
    if (twitterDescription) twitterDescription.setAttribute('content', pageMeta.description);
  }, [location.hash, location.pathname, pageMeta]);

  return null;
}

// HomePage Component
function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          const headerHeight = 80;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-white">
      <StickyBar />
      <Header />
      <main>
        <Hero />
        <WhyItMatters />
        <Process />
        <Services />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <FeedbackButton />
    </div>
  );
}

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <Router>
        <SEOHead />
        <Routes>
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </Router>
    </QuestProvider>
  );
}

export default App;