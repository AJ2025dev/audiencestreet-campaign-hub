import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';

// Define types
interface User {
  id: string;
  email: string;
  role: 'admin' | 'advertiser' | 'affiliate';
  firstName: string;
  lastName: string;
  [key: string]: any; // For additional properties
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getProfile();
          setUser(response.data.user);
        } catch (error) {
          // If token is invalid, remove it
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      
      // Set auth token
      authService.setAuthToken(token);
      
      // Set user state
      setUser(user);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData);
      const { user, token } = response.data;
      
      // Set auth token
      authService.setAuthToken(token);
      
      // Set user state
      setUser(user);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Remove token
    authService.logout();
    
    // Clear user state
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};