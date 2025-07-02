import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyItMatters from './components/WhyItMatters';
import Process from './components/Process';
import Services from './components/Services';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import FAQ from './components/FAQ';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StickyBar from './components/StickyBar';
import FeedbackButton from './components/FeedbackButton';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import BlogAdmin from './components/BlogAdmin';
import CommentAdmin from './components/CommentAdmin';
import SEOHead from './components/SEOHead';
import usePageTracking from './hooks/usePageTracking';
import questConfig from './config/questConfig';

// Component to handle hash scrolling on home page
function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash-based scrolling when landing on home page with hash
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          const headerHeight = 80;
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
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
        <Blog />
        <FAQ />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <FeedbackButton />
    </div>
  );
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminView, setAdminView] = useState('dashboard');

  // Initialize page tracking
  usePageTracking();

  // Admin login handler
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminView('dashboard');
  };

  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <Router>
        <SEOHead />
        <Routes>
          {/* Individual Blog Post Route */}
          <Route path="/blog/:slug" element={<BlogPost />} />
          
          {/* Admin Route */}
          <Route 
            path="/admin" 
            element={
              isAdminLoggedIn ? (
                <div className="min-h-screen bg-gray-50">
                  {/* Admin Header */}
                  <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="container mx-auto px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                          <h1 className="text-2xl font-bold text-gray-900">
                            Workplace Mapping Admin
                          </h1>
                          <nav className="flex gap-6">
                            <button
                              onClick={() => setAdminView('dashboard')}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                adminView === 'dashboard'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:text-blue-600'
                              }`}
                            >
                              Dashboard
                            </button>
                            <button
                              onClick={() => setAdminView('blog')}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                adminView === 'blog'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:text-blue-600'
                              }`}
                            >
                              Blog Management
                            </button>
                            <button
                              onClick={() => setAdminView('comments')}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                adminView === 'comments'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:text-blue-600'
                              }`}
                            >
                              Comments
                            </button>
                          </nav>
                        </div>
                        <button
                          onClick={handleAdminLogout}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </header>

                  {/* Admin Content */}
                  {adminView === 'dashboard' && <AdminDashboard onLogout={handleAdminLogout} />}
                  {adminView === 'blog' && <BlogAdmin />}
                  {adminView === 'comments' && <CommentAdmin />}
                </div>
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            }
          />
          
          {/* Main Website Route */}
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </Router>
    </QuestProvider>
  );
}

export default App;