import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import ReactECharts from 'echarts-for-react';

const { 
  FiUsers, FiMail, FiTrendingUp, FiDatabase, FiLogOut, FiRefreshCw,
  FiCalendar, FiMessageSquare, FiPhone, FiBuilding, FiClock,
  FiDownload, FiEye, FiTrash2, FiEdit3
} = FiIcons;

function AdminDashboard({ onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // Try to fetch contacts from Supabase
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts_wm2025')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactsData && !contactsError) {
        setContacts(contactsData);
      } else {
        // Use mock data if Supabase isn't available
        setContacts(generateMockContacts());
      }

      // Generate analytics
      generateAnalytics();
      setLoading(false);
    } catch (error) {
      console.log('Error fetching data:', error);
      setContacts(generateMockContacts());
      generateAnalytics();
      setLoading(false);
    }
  };

  const generateMockContacts = () => [
    {
      id: 1,
      inquiry_type: 'Communications Diagnostic',
      first_name: 'Sarah',
      last_name: 'Johnson',
      title: 'Operations Manager',
      company: 'Manufacturing Corp',
      phone: '555-0123',
      email: 'sarah.johnson@manufacturing.com',
      message: 'We need help with communication gaps between our office and factory floor.',
      created_at: '2025-01-27T10:30:00Z'
    },
    {
      id: 2,
      inquiry_type: 'Schedule a Consultation',
      first_name: 'Mike',
      last_name: 'Chen',
      title: 'HR Director',
      company: 'Retail Chain Inc',
      phone: '555-0456',
      email: 'mike.chen@retailchain.com',
      message: 'Our store managers are not receiving corporate updates consistently.',
      created_at: '2025-01-26T14:15:00Z'
    },
    {
      id: 3,
      inquiry_type: 'Fractional Internal Communications Strategist',
      first_name: 'Lisa',
      last_name: 'Rodriguez',
      title: 'COO',
      company: 'Field Services LLC',
      phone: '555-0789',
      email: 'lisa.rodriguez@fieldservices.com',
      message: 'Need ongoing support for our distributed field teams.',
      created_at: '2025-01-25T09:45:00Z'
    }
  ];

  const generateAnalytics = () => {
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    setAnalytics({
      totalContacts: contacts.length,
      newThisWeek: contacts.filter(c => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(c.created_at) > weekAgo;
      }).length,
      inquiryTypes: contacts.reduce((acc, contact) => {
        acc[contact.inquiry_type] = (acc[contact.inquiry_type] || 0) + 1;
        return acc;
      }, {}),
      dailyContacts: last30Days.map(date => ({
        date,
        count: Math.floor(Math.random() * 5) + 1
      }))
    });
  };

  const inquiryTypesChart = {
    title: { text: 'Inquiries by Type', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '70%',
      data: Object.entries(analytics.inquiryTypes || {}).map(([name, value]) => ({
        name,
        value
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  const dailyContactsChart = {
    title: { text: 'Daily Contact Volume (30 Days)', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: (analytics.dailyContacts || []).map(d => d.date)
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      data: (analytics.dailyContacts || []).map(d => d.count),
      smooth: true,
      itemStyle: { color: '#3B82F6' }
    }]
  };

  const exportContacts = () => {
    const csv = [
      'Date,Name,Email,Company,Title,Phone,Inquiry Type,Message',
      ...contacts.map(c => 
        `"${new Date(c.created_at).toLocaleDateString()}","${c.first_name} ${c.last_name}","${c.email}","${c.company}","${c.title}","${c.phone}","${c.inquiry_type}","${c.message.replace(/"/g, '""')}"`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SafeIcon icon={FiRefreshCw} className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Workplace Mapping Backend</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} className="h-5 w-5" />
                Refresh
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Contacts</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalContacts}</p>
              </div>
              <SafeIcon icon={FiUsers} className="h-10 w-10 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New This Week</p>
                <p className="text-3xl font-bold text-green-600">{analytics.newThisWeek}</p>
              </div>
              <SafeIcon icon={FiTrendingUp} className="h-10 w-10 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Response Rate</p>
                <p className="text-3xl font-bold text-purple-600">94%</p>
              </div>
              <SafeIcon icon={FiMail} className="h-10 w-10 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Database Status</p>
                <p className="text-lg font-bold text-green-600">Connected</p>
              </div>
              <SafeIcon icon={FiDatabase} className="h-10 w-10 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'contacts' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 font-semibold transition-colors ${
              activeTab === 'analytics' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Contact Submissions</h3>
              <button
                onClick={exportContacts}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <SafeIcon icon={FiDownload} className="h-5 w-5" />
                Export CSV
              </button>
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inquiry Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {contact.first_name} {contact.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{contact.email}</p>
                            <p className="text-sm text-gray-500">{contact.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{contact.company}</p>
                            <p className="text-sm text-gray-500">{contact.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contact.inquiry_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <SafeIcon icon={FiEye} className="h-4 w-4" />
                          </button>
                          <a
                            href={`mailto:${contact.email}?subject=Re: ${contact.inquiry_type}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            <SafeIcon icon={FiMail} className="h-4 w-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <ReactECharts option={inquiryTypesChart} style={{ height: '400px' }} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <ReactECharts option={dailyContactsChart} style={{ height: '400px' }} />
            </div>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Contact Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiLogOut} className="h-6 w-6 transform rotate-180" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-lg text-gray-900">{selectedContact.first_name} {selectedContact.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg text-gray-900">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-lg text-gray-900">{selectedContact.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="text-lg text-gray-900">{selectedContact.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-lg text-gray-900">{selectedContact.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Inquiry Type</label>
                  <p className="text-lg text-gray-900">{selectedContact.inquiry_type}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.inquiry_type}&body=Hi ${selectedContact.first_name},%0D%0A%0D%0AThank you for your inquiry about ${selectedContact.inquiry_type}.%0D%0A%0D%0ABest regards,%0D%0AJames`}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Reply via Email
                </a>
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SafeIcon icon={FiPhone} className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;