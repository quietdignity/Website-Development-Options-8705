import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyItMatters from './components/WhyItMatters';
import Process from './components/Process';
import Services from './components/Services';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StickyBar from './components/StickyBar';
import Chatbot from './components/Chatbot';
import FeedbackButton from './components/FeedbackButton';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import usePageTracking from './hooks/usePageTracking';
import questConfig from './config/questConfig';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Initialize page tracking
  usePageTracking();

  // Admin login handler
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <QuestProvider 
      apiKey={questConfig.APIKEY} 
      entityId={questConfig.ENTITYID} 
      apiType="PRODUCTION"
    >
      <Router>
        <Routes>
          {/* Admin Route */}
          <Route 
            path="/admin" 
            element={
              isAdminLoggedIn ? (
                <AdminDashboard onLogout={handleAdminLogout} />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            } 
          />
          
          {/* Main Website Route */}
          <Route 
            path="/*" 
            element={
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
                <Chatbot />
                <FeedbackButton />
              </div>
            } 
          />
        </Routes>
      </Router>
    </QuestProvider>
  );
}

export default App;