import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email: string;
  verified: boolean;
}

interface AuthContextType {
  user: DiscordUser | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  getAvatarUrl: () => string | null;
  getDisplayName: () => string;
  getFirstName: () => string;
  getLastName: () => string;
  getDiscordTag: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DISCORD_CLIENT_ID = '1090917458346524734';
const DISCORD_CLIENT_SECRET = 'xvAJQdVBlO-Mx7K9SJa8f1XOrDHnvwuH';
const REDIRECT_URI = window.location.origin + '/auth/callback';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('discord_user');
    const storedToken = localStorage.getItem('discord_token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Verify token is still valid
        verifyToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (error) {
      toast.error('Discord login failed: ' + error);
      setIsLoading(false);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (code) {
      handleCallback(code);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token invalid');
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = () => {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'identify email'
    });
    
    window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
  };

  const handleCallback = async (code: string) => {
    try {
      setIsLoading(true);
      
      // Exchange code for token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        })
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }
      
      const tokenData = await tokenResponse.json();
      
      // Get user data
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();
      
      // Store user and token
      localStorage.setItem('discord_user', JSON.stringify(userData));
      localStorage.setItem('discord_token', tokenData.access_token);
      
      setUser(userData);
      toast.success(`Welcome back, ${userData.global_name || userData.username}!`);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } catch (error) {
      console.error('Discord login error:', error);
      toast.error('Failed to login with Discord. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('discord_user');
    localStorage.removeItem('discord_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const getAvatarUrl = (): string | null => {
    if (!user || !user.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  };

  const getDisplayName = (): string => {
    if (!user) return '';
    return user.global_name || user.username;
  };

  const getFirstName = (): string => {
    const displayName = getDisplayName();
    return displayName.split(' ')[0] || '';
  };

  const getLastName = (): string => {
    const displayName = getDisplayName();
    const parts = displayName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  };

  const getDiscordTag = (): string => {
    if (!user) return '';
    return user.discriminator === '0' ? user.username : `${user.username}#${user.discriminator}`;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    getAvatarUrl,
    getDisplayName,
    getFirstName,
    getLastName,
    getDiscordTag
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
