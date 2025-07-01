import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';

const { FiTrendingUp, FiUsers, FiMessageSquare, FiTarget, FiBarChart3, FiPieChart, FiActivity, FiFilter } = FiIcons;

function Analytics() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const [timeRange, setTimeRange] = useState('30d');

  // Simulated analytics data
  const metricsData = {
    engagement: {
      title: 'Communication Engagement',
      value: '78%',
      change: '+12%',
      trend: 'up',
      description: 'Average engagement across all communication channels'
    },
    reach: {
      title: 'Message Reach Rate',
      value: '94%',
      change: '+8%',
      trend: 'up',
      description: 'Percentage of employees receiving critical messages'
    },
    response: {
      title: 'Response Time',
      value: '2.3h',
      change: '-45%',
      trend: 'up',
      description: 'Average time for frontline workers to receive updates'
    },
    satisfaction: {
      title: 'Communication Satisfaction',
      value: '4.2/5',
      change: '+0.8',
      trend: 'up',
      description: 'Employee satisfaction with communication systems'
    }
  };

  // Chart configurations
  const engagementChartOption = {
    title: {
      text: 'Communication Engagement Over Time',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Office Staff', 'Frontline Workers', 'Remote Teams'] },
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
    },
    yAxis: { type: 'value', name: 'Engagement %' },
    series: [
      {
        name: 'Office Staff',
        type: 'line',
        data: [85, 87, 89, 91, 93, 95],
        smooth: true,
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Frontline Workers',
        type: 'line',
        data: [45, 52, 61, 68, 74, 78],
        smooth: true,
        itemStyle: { color: '#EF4444' }
      },
      {
        name: 'Remote Teams',
        type: 'line',
        data: [72, 75, 78, 82, 85, 88],
        smooth: true,
        itemStyle: { color: '#10B981' }
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const channelEffectivenessOption = {
    title: {
      text: 'Channel Effectiveness by Department',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Email', 'Slack', 'SMS', 'Digital Displays', 'Team Meetings'] },
    xAxis: {
      type: 'category',
      data: ['Manufacturing', 'Retail', 'Field Services', 'Office', 'Warehouse']
    },
    yAxis: { type: 'value', name: 'Effectiveness Score' },
    series: [
      {
        name: 'Email',
        type: 'bar',
        data: [30, 45, 35, 85, 40],
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Slack',
        type: 'bar',
        data: [20, 35, 25, 90, 30],
        itemStyle: { color: '#8B5CF6' }
      },
      {
        name: 'SMS',
        type: 'bar',
        data: [85, 80, 90, 60, 75],
        itemStyle: { color: '#10B981' }
      },
      {
        name: 'Digital Displays',
        type: 'bar',
        data: [90, 85, 40, 45, 80],
        itemStyle: { color: '#F59E0B' }
      },
      {
        name: 'Team Meetings',
        type: 'bar',
        data: [75, 70, 60, 80, 65],
        itemStyle: { color: '#EF4444' }
      }
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
  };

  const messageFlowOption = {
    title: {
      text: 'Message Flow Analysis',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Message Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 35, name: 'Reached All Teams', itemStyle: { color: '#10B981' } },
          { value: 25, name: 'Partial Reach', itemStyle: { color: '#F59E0B' } },
          { value: 20, name: 'Office Only', itemStyle: { color: '#3B82F6' } },
          { value: 15, name: 'Lost in Transit', itemStyle: { color: '#EF4444' } },
          { value: 5, name: 'Never Sent', itemStyle: { color: '#6B7280' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="analytics" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8"
          >
            Communication Analytics Dashboard
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-700 text-center mb-16 max-w-3xl mx-auto"
          >
            Track how your messages flow through your organization and measure the effectiveness of your communication systems with real-time analytics.
          </motion.p>

          {/* Key Metrics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {Object.entries(metricsData).map(([key, metric]) => (
              <motion.div
                key={key}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  selectedMetric === key ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedMetric(key)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <SafeIcon 
                      icon={key === 'engagement' ? FiTrendingUp : 
                            key === 'reach' ? FiUsers :
                            key === 'response' ? FiActivity : FiTarget} 
                      className="h-6 w-6 text-blue-600" 
                    />
                  </div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    metric.trend === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                  }`}>
                    {metric.change}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.title}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Time Range Filter */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <div className="bg-white rounded-lg p-1 shadow-md">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {range === '7d' ? '7 Days' :
                   range === '30d' ? '30 Days' :
                   range === '90d' ? '90 Days' : '1 Year'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Engagement Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <ReactECharts 
                option={engagementChartOption} 
                style={{ height: '400px' }}
                opts={{ renderer: 'canvas' }}
              />
            </motion.div>

            {/* Channel Effectiveness Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <ReactECharts 
                option={channelEffectivenessOption} 
                style={{ height: '400px' }}
                opts={{ renderer: 'canvas' }}
              />
            </motion.div>
          </div>

          {/* Message Flow Analysis */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-8 shadow-lg mb-12"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <ReactECharts 
                  option={messageFlowOption} 
                  style={{ height: '400px' }}
                  opts={{ renderer: 'canvas' }}
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Message Flow Insights
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>35%</strong> of messages reach all intended teams successfully
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>25%</strong> achieve partial reach, missing some frontline workers
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>20%</strong> only reach office-based employees
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      <strong>15%</strong> get lost during transmission
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Recommendation</h4>
                  <p className="text-blue-800">
                    Implementing our workplace mapping system could improve your message reach rate 
                    from 60% to 94%, ensuring critical information reaches all employees.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Insights Panel */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <SafeIcon icon={FiBarChart3} className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                <h4 className="text-xl font-bold mb-2">Real-Time Tracking</h4>
                <p className="text-blue-100">
                  Monitor message delivery and engagement across all communication channels in real-time.
                </p>
              </div>
              <div>
                <SafeIcon icon={FiPieChart} className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                <h4 className="text-xl font-bold mb-2">Gap Analysis</h4>
                <p className="text-blue-100">
                  Identify where messages get lost and which teams are consistently missing updates.
                </p>
              </div>
              <div>
                <SafeIcon icon={FiTarget} className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                <h4 className="text-xl font-bold mb-2">Optimization Insights</h4>
                <p className="text-blue-100">
                  Get actionable recommendations to improve communication effectiveness.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Analytics;