import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMessageCircle, FiX, FiSend } = FiIcons;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Josie, your Workplace Mapping assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const faqData = {
    "what exactly is workplace mapping": "We trace how information actually moves through your organization - from headquarters to frontline workers. Then we help you build communication systems that reach everyone who needs them, not just office staff.",
    "how is this different from regular communication consulting": "Most consultants focus on improving messages. We focus on building better systems. We map both your official channels AND the informal networks people actually use to share information.",
    "what's included in the 20-day diagnostic": "Surveys across your workforce, interviews with team members, following important updates through real channels, mapping communication gaps, and clear recommendations. Price starts at $10,000.",
    "who is this for": "Organizations where critical updates reach office staff but get lost before reaching people on factory floors, in retail stores, or at customer sites. Perfect for manufacturing, retail chains, field services, and distributed teams.",
    "how long does the process take": "Diagnostic: 20 business days. Fractional strategist: ongoing monthly support. Complete workplace mapping: 8-16 months depending on organization size.",
    "do you work with remote teams": "Yes. We work with office workers, hybrid teams, and field crews. Our systems reach everyone regardless of where they work.",
    "what's the difference between your services": "Diagnostic identifies problems and gives recommendations. Fractional strategist provides ongoing monthly support. Complete mapping rebuilds your entire communication infrastructure.",
    "can i schedule a discovery call": "Yes! Book directly at https://tidycal.com/jamesbrowntv/workplace-mapping-consultation or use our contact form below.",
    "how much does this cost": "Diagnostic starts at $10,000. Other services vary by scope and complexity. Use our contact form for a custom quote.",
    "what's your experience": "Developed through managing communications for 3,000+ distributed employees across government and private sector organizations. Nearly twenty years across journalism, speechwriting, marketing, and internal communications."
  };

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    Object.keys(faqData).forEach(question => {
      const words = question.split(' ');
      let score = 0;
      
      words.forEach(word => {
        if (input.includes(word)) {
          score++;
        }
      });
      
      if (score > maxScore && score > 0) {
        maxScore = score;
        bestMatch = question;
      }
    });

    return bestMatch ? faqData[bestMatch] : "I'm not sure about that specific question. For detailed information about our services, please use our contact form or book a discovery call at https://tidycal.com/jamesbrowntv/workplace-mapping-consultation";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user'
    };

    const botResponse = {
      id: Date.now() + 1,
      text: findBestMatch(inputText),
      sender: 'bot'
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SafeIcon icon={isOpen ? FiX : FiMessageCircle} className="h-6 w-6" />
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">J</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Josie</h4>
                    <p className="text-xs text-blue-100">Workplace Mapping Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-100 hover:text-white"
                >
                  <SafeIcon icon={FiX} className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 h-64 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiSend} className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;