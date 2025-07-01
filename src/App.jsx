import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
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

function App() {
  return (
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
      </div>
    </Router>
  );
}

export default App;