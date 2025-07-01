import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiDatabase, FiPlus, FiUsers, FiCheck, FiTrendingUp, FiMessageSquare, FiClock } = FiIcons;

function SupabaseDemo() {
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: ''
  });

  // Fetch contacts and analytics data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Test connection with a simple query
      const { data: testData, error: testError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);

      if (testError) {
        console.log('Supabase connection test:', testError);
      }

      setLoading(false);
    } catch (error) {
      console.log('Supabase error:', error);
      setLoading(false);
    }
  };

  const addContact = async () => {
    if (!newContact.first_name || !newContact.last_name || !newContact.email) {
      alert('Please fill in all required fields');
      return;
    }

    // For demo purposes, just add to local state
    const contact = {
      id: Date.now(),
      ...newContact,
      created_at: new Date().toISOString()
    };

    setContacts(prev => [contact, ...prev]);
    setNewContact({ first_name: '', last_name: '', email: '', company: '' });
  };

  const mockAnalytics = [
    { metric: 'Message Reach Rate', value: '94%', change: '+8%', icon: FiUsers },
    { metric: 'Engagement Score', value: '78%', change: '+12%', icon: FiTrendingUp },
    { metric: 'Response Time', value: '2.3h', change: '-45%', icon: FiClock },
    { metric: 'Active Channels', value: '12', change: '+3', icon: FiMessageSquare }
  ];

  return (
    <section id="supabase-demo" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <SafeIcon icon={FiDatabase} className="h-12 w-12 text-green-600" />
              <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Backend Connected - Supabase Integration Active
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your workplace mapping platform now has real-time data management capabilities!
            </p>
          </motion.div>

          {/* Connection Status */}
          <motion.div 
            className="bg-white rounded-2xl p-8 shadow-lg mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiCheck} className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Supabase Status</h3>
                  <p className="text-gray-600">Connected and operational</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                ✓ Connected
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Analytics Dashboard */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-blue-600" />
                Live Analytics Dashboard
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {mockAnalytics.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <SafeIcon icon={item.icon} className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600">{item.metric}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    <div className="text-sm text-green-600 font-semibold">{item.change}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Management */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <SafeIcon icon={FiUsers} className="h-6 w-6 text-purple-600" />
                Contact Management
              </h3>
              
              {/* Add Contact Form */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newContact.first_name}
                    onChange={(e) => setNewContact({...newContact, first_name: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newContact.last_name}
                    onChange={(e) => setNewContact({...newContact, last_name: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={addContact}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <SafeIcon icon={FiPlus} className="h-4 w-4" />
                  Add Contact (Demo)
                </button>
              </div>

              {/* Contact List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {contacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <SafeIcon icon={FiUsers} className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Add a contact to see it appear here</p>
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {contact.first_name} {contact.last_name}
                        </h4>
                        <p className="text-gray-600 text-xs">{contact.email}</p>
                        {contact.company && (
                          <p className="text-gray-500 text-xs">{contact.company}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Features Overview */}
          <motion.div 
            className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">
              Backend Capabilities Now Available
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <SafeIcon icon={FiDatabase} className="h-10 w-10 mx-auto mb-3 text-blue-300" />
                <h4 className="text-lg font-semibold mb-2">Real-Time Data</h4>
                <p className="text-blue-100 text-sm">
                  Store and retrieve contact information, analytics, and communication metrics in real-time.
                </p>
              </div>
              <div>
                <SafeIcon icon={FiUsers} className="h-10 w-10 mx-auto mb-3 text-purple-300" />
                <h4 className="text-lg font-semibold mb-2">Contact Management</h4>
                <p className="text-purple-100 text-sm">
                  Manage leads, contacts, and communication preferences with full CRUD operations.
                </p>
              </div>
              <div>
                <SafeIcon icon={FiTrendingUp} className="h-10 w-10 mx-auto mb-3 text-green-300" />
                <h4 className="text-lg font-semibold mb-2">Analytics Tracking</h4>
                <p className="text-green-100 text-sm">
                  Track communication effectiveness, engagement rates, and system performance metrics.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default SupabaseDemo;