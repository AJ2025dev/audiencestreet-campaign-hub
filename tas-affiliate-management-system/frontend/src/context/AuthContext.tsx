import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import authService, { User } from '../services/authService';

// Define context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (err) {
          // If token is invalid, remove it
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      clearError();
      const authResponse = await authService.login({ email, password });
      authService.setAuthToken(authResponse.token);
      setUser(authResponse.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData: any) => {
    try {
      clearError();
      const authResponse = await authService.register(userData);
      authService.setAuthToken(authResponse.token);
      setUser(authResponse.user);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update profile function
  const updateProfile = async (profileData: any) => {
    try {
      clearError();
      const userData = await authService.updateProfile(profileData);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    loading,
    error,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;