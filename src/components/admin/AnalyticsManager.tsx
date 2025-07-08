import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface AnalyticsManagerProps {
  theme?: string;
}

const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ theme = 'dark' }) => {
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          input: 'bg-white border-gray-300 text-gray-900'
        };
      case 'glass':
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          input: 'bg-white/5 border-white/10 text-white'
        };
      default: // dark
        return {
          card: 'bg-gray-800 border-gray-700',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          input: 'bg-gray-700 border-gray-600 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  // Sample analytics data
  const revenueData = [
    { date: '2024-01-01', revenue: 45000, orders: 120, customers: 85 },
    { date: '2024-01-02', revenue: 52000, orders: 140, customers: 92 },
    { date: '2024-01-03', revenue: 48000, orders: 130, customers: 88 },
    { date: '2024-01-04', revenue: 61000, orders: 160, customers: 105 },
    { date: '2024-01-05', revenue: 55000, orders: 145, customers: 98 },
    { date: '2024-01-06', revenue: 67000, orders: 175, customers: 112 },
    { date: '2024-01-07', revenue: 72000, orders: 190, customers: 125 },
  ];

  const serviceData = [
    { name: 'Minecraft Hosting', value: 45, revenue: 125000, color: '#8B5CF6' },
    { name: 'VPS Hosting', value: 30, revenue: 89000, color: '#EC4899' },
    { name: 'Domain Registration', value: 25, revenue: 45000, color: '#10B981' },
  ];

  const trafficData = [
    { source: 'Direct', visitors: 2500, percentage: 35 },
    { source: 'Search', visitors: 1800, percentage: 25 },
    { source: 'Social Media', visitors: 1200, percentage: 17 },
    { source: 'Referral', visitors: 900, percentage: 13 },
    { source: 'Email', visitors: 700, percentage: 10 },
  ];

  const conversionData = [
    { step: 'Visitors', count: 7100, rate: 100 },
    { step: 'Product Views', count: 3200, rate: 45 },
    { step: 'Add to Cart', count: 1280, rate: 18 },
    { step: 'Checkout', count: 640, rate: 9 },
    { step: 'Purchase', count: 320, rate: 4.5 },
  ];

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className={`${themeStyles.card} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${themeStyles.textMuted}`}>{title}</p>
          <p className={`text-2xl font-bold ${themeStyles.text} mt-2`}>{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className={`text-sm ${themeStyles.textMuted} ml-1`}>vs last period</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>Analytics Dashboard</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Track your business performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="₹2,59,000"
          change={12.5}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Total Orders"
          value="1,260"
          change={8.3}
          icon={BarChart3}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <MetricCard
          title="New Customers"
          value="705"
          change={15.2}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <MetricCard
          title="Conversion Rate"
          value="4.5%"
          change={-2.1}
          icon={Activity}
          color="bg-gradient-to-r from-orange-500 to-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey="date" 
                stroke={theme === 'light' ? '#6b7280' : '#9ca3af'}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke={theme === 'light' ? '#6b7280' : '#9ca3af'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
                  border: theme === 'light' ? '1px solid #e5e7eb' : '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B5CF6" 
                fill="url(#colorRevenue)" 
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Revenue by Service</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="revenue"
                label={({ name, value }) => `${name}: ₹${(value/1000).toFixed(0)}k`}
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources and Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Traffic Sources</h3>
          <div className="space-y-4">
            {trafficData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: serviceData[index % serviceData.length]?.color || '#8B5CF6' }}></div>
                  <span className={`${themeStyles.textSecondary} font-medium`}>{source.source}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`${themeStyles.text} font-semibold`}>{source.visitors.toLocaleString()}</span>
                  <span className={`${themeStyles.textMuted} text-sm`}>{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Conversion Funnel</h3>
          <div className="space-y-4">
            {conversionData.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`${themeStyles.textSecondary} font-medium`}>{step.step}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`${themeStyles.text} font-semibold`}>{step.count.toLocaleString()}</span>
                    <span className={`${themeStyles.textMuted} text-sm`}>{step.rate}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${step.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className={`${themeStyles.card} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Daily Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>Date</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>Revenue</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>Orders</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>New Customers</th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>Avg Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {revenueData.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${themeStyles.text}`}>
                      {new Date(day.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${themeStyles.text}`}>₹{day.revenue.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${themeStyles.textSecondary}`}>{day.orders}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${themeStyles.textSecondary}`}>{day.customers}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${themeStyles.textSecondary}`}>₹{Math.round(day.revenue / day.orders).toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className={`${themeStyles.card} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Export Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Revenue Report
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center">
            <Users className="w-4 h-4 mr-2" />
            Export Customer Report
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center">
            <Activity className="w-4 h-4 mr-2" />
            Export Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;