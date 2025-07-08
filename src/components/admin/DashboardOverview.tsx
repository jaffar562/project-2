import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Server, 
  Globe,
  Activity,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface DashboardOverviewProps {
  theme?: string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ theme = 'dark' }) => {
  const [stats, setStats] = useState({
    totalRevenue: 125000,
    totalOrders: 1250,
    totalCustomers: 890,
    activeServers: 456,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    serversGrowth: 6.7
  });

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500'
        };
      case 'glass':
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60'
        };
      default: // dark
        return {
          card: 'bg-gray-800 border-gray-700',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400'
        };
    }
  };

  const themeStyles = getThemeClasses();

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 140 },
    { month: 'Mar', revenue: 48000, orders: 130 },
    { month: 'Apr', revenue: 61000, orders: 160 },
    { month: 'May', revenue: 55000, orders: 145 },
    { month: 'Jun', revenue: 67000, orders: 175 },
  ];

  const serviceData = [
    { name: 'Minecraft Hosting', value: 45, color: '#8B5CF6' },
    { name: 'VPS Hosting', value: 30, color: '#EC4899' },
    { name: 'Domain Registration', value: 25, color: '#10B981' },
  ];

  const recentOrders = [
    { id: 'MC123456', customer: 'John Doe', service: 'Minecraft Hosting', amount: 299, status: 'active' },
    { id: 'VPS789012', customer: 'Jane Smith', service: 'VPS Hosting', amount: 800, status: 'pending' },
    { id: 'DOM345678', customer: 'Mike Johnson', service: 'Domain Registration', amount: 999, status: 'completed' },
    { id: 'MC901234', customer: 'Sarah Wilson', service: 'Minecraft Hosting', amount: 549, status: 'active' },
  ];

  const StatCard = ({ title, value, growth, icon: Icon, color }: any) => (
    <div className={`${themeStyles.card} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${themeStyles.textMuted}`}>{title}</p>
          <p className={`text-2xl font-bold ${themeStyles.text} mt-2`}>{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {growth >= 0 ? '+' : ''}{growth}%
            </span>
            <span className={`text-sm ${themeStyles.textMuted} ml-1`}>vs last month</span>
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
          <h1 className={`text-3xl font-bold ${themeStyles.text}`}>Dashboard Overview</h1>
          <p className={`${themeStyles.textSecondary} mt-1`}>Welcome back! Here's what's happening with your hosting platform.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          growth={stats.revenueGrowth}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          growth={stats.ordersGrowth}
          icon={ShoppingCart}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          growth={stats.customersGrowth}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <StatCard
          title="Active Servers"
          value={stats.activeServers.toLocaleString()}
          growth={stats.serversGrowth}
          icon={Server}
          color="bg-gradient-to-r from-orange-500 to-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e5e7eb' : '#374151'} />
              <XAxis dataKey="month" stroke={theme === 'light' ? '#6b7280' : '#9ca3af'} />
              <YAxis stroke={theme === 'light' ? '#6b7280' : '#9ca3af'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
                  border: theme === 'light' ? '1px solid #e5e7eb' : '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className={`lg:col-span-2 ${themeStyles.card} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${themeStyles.text}`}>Recent Orders</h3>
            <button className="text-purple-500 hover:text-purple-600 font-medium text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    order.service === 'Minecraft Hosting' ? 'bg-purple-100 dark:bg-purple-900/50' :
                    order.service === 'VPS Hosting' ? 'bg-blue-100 dark:bg-blue-900/50' :
                    'bg-green-100 dark:bg-green-900/50'
                  }`}>
                    {order.service === 'Minecraft Hosting' ? <Server className="w-5 h-5 text-purple-600" /> :
                     order.service === 'VPS Hosting' ? <Server className="w-5 h-5 text-blue-600" /> :
                     <Globe className="w-5 h-5 text-green-600" />}
                  </div>
                  <div>
                    <p className={`font-medium ${themeStyles.text}`}>{order.customer}</p>
                    <p className={`text-sm ${themeStyles.textMuted}`}>{order.id} • {order.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${themeStyles.text}`}>₹{order.amount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`${themeStyles.card} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <Server className="w-5 h-5 text-purple-600" />
              <span className={`font-medium ${themeStyles.text}`}>Add New Plan</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Users className="w-5 h-5 text-blue-600" />
              <span className={`font-medium ${themeStyles.text}`}>Manage Customers</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Globe className="w-5 h-5 text-green-600" />
              <span className={`font-medium ${themeStyles.text}`}>Update Pricing</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
              <Activity className="w-5 h-5 text-orange-600" />
              <span className={`font-medium ${themeStyles.text}`}>View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className={`${themeStyles.card} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={`${themeStyles.textSecondary}`}>All Services Operational</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={`${themeStyles.textSecondary}`}>Database: Healthy</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className={`${themeStyles.textSecondary}`}>API: Minor Delays</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;