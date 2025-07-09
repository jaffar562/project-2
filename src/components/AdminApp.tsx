import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

interface AdminAppProps {
  theme?: string;
}

const AdminApp: React.FC<AdminAppProps> = ({ theme = 'dark' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    // Demo authentication - replace with real authentication
    try {
      if (credentials.email === 'admin@demonnode.com' && credentials.password === 'admin123') {
        setIsAuthenticated(true);
        return Promise.resolve();
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'light' ? '#ffffff' : '#1f2937',
            color: theme === 'light' ? '#1f2937' : '#ffffff',
            border: theme === 'light' ? '1px solid #e5e7eb' : '1px solid #374151',
          },
        }}
      />
      
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} theme={theme} />
      ) : (
        <AdminLogin onLogin={handleLogin} theme={theme} />
      )}
    </>
  );
};

export default AdminApp;