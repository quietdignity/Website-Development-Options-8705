import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
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
import questConfig from './config/questConfig';

function App() {
  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <Router>
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
      </Router>
    </QuestProvider>
  );
}

export default App;