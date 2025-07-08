import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Server, 
  Globe, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardOverview from './DashboardOverview';
import HostingPlansManager from './HostingPlansManager';
import VPSPlansManager from './VPSPlansManager';
import DomainPricingManager from './DomainPricingManager';
import OrdersManager from './OrdersManager';
import CustomersManager from './CustomersManager';
import ContentManager from './ContentManager';
import AnalyticsManager from './AnalyticsManager';
import SystemSettings from './SystemSettings';

interface AdminDashboardProps {
  onLogout: () => void;
  theme?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gray-50',
          sidebar: 'bg-white border-gray-200',
          header: 'bg-white border-gray-200',
          card: 'bg-white border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-blue-500 hover:bg-blue-600',
          activeTab: 'bg-blue-50 text-blue-600 border-blue-200',
          inactiveTab: 'text-gray-600 hover:bg-gray-50'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          sidebar: 'bg-white/5 backdrop-blur-xl border-white/10',
          header: 'bg-white/5 backdrop-blur-xl border-white/10',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-purple-500/80 hover:bg-purple-600/80 backdrop-blur-sm',
          activeTab: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          inactiveTab: 'text-white/70 hover:bg-white/10'
        };
      default: // dark
        return {
          bg: 'bg-gray-900',
          sidebar: 'bg-gray-800 border-gray-700',
          header: 'bg-gray-800 border-gray-700',
          card: 'bg-gray-800 border-gray-700',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-purple-500 hover:bg-purple-600',
          activeTab: 'bg-purple-900/50 text-purple-300 border-purple-500/50',
          inactiveTab: 'text-gray-300 hover:bg-gray-700'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hosting-plans', label: 'Hosting Plans', icon: Server },
    { id: 'vps-plans', label: 'VPS Plans', icon: Server },
    { id: 'domain-pricing', label: 'Domain Pricing', icon: Globe },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'content', label: 'Content Manager', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview theme={theme} />;
      case 'hosting-plans':
        return <HostingPlansManager theme={theme} />;
      case 'vps-plans':
        return <VPSPlansManager theme={theme} />;
      case 'domain-pricing':
        return <DomainPricingManager theme={theme} />;
      case 'orders':
        return <OrdersManager theme={theme} />;
      case 'customers':
        return <CustomersManager theme={theme} />;
      case 'content':
        return <ContentManager theme={theme} />;
      case 'analytics':
        return <AnalyticsManager theme={theme} />;
      case 'settings':
        return <SystemSettings theme={theme} />;
      default:
        return <DashboardOverview theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg}`}>
      {/* Header */}
      <header className={`${themeStyles.header} border-b px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-40`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`lg:hidden p-2 rounded-lg ${themeStyles.inactiveTab} transition-colors`}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Server className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${themeStyles.text}`}>Demon Node™ Admin</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeStyles.textMuted}`} />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-10 pr-4 py-2 ${themeStyles.card} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 hidden md:block`}
            />
          </div>
          
          <button className={`relative p-2 rounded-lg ${themeStyles.inactiveTab} transition-colors`}>
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          <button
            onClick={onLogout}
            className={`flex items-center space-x-2 px-4 py-2 ${themeStyles.button} text-white rounded-lg transition-colors`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${themeStyles.sidebar} border-r w-64 min-h-screen fixed lg:static z-30 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id ? themeStyles.activeTab : themeStyles.inactiveTab
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;