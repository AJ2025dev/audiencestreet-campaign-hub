import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define types
interface User {
  id: string;
  email: string;
  role: 'admin' | 'advertiser' | 'affiliate';
  firstName: string;
  lastName: string;
  lastLogin?: string;
  advertiser?: any;
  affiliate?: any;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'admin' | 'advertiser' | 'affiliate';
  firstName: string;
  lastName: string;
  companyDetails?: {
    companyName: string;
    websiteUrl?: string;
    contactPhone?: string;
    billingAddress?: string;
    paymentMethod?: string;
    paymentDetails?: any;
    affiliateNetwork?: string;
  };
}

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add auth token to requests if available
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API functions
export const authService = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response: AxiosResponse<{ data: AuthResponse }> = await api.post('/auth/register', userData);
    return response.data.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<{ data: AuthResponse }> = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<{ data: { user: User } }> = await api.get('/auth/profile');
    return response.data.data.user;
  },

  // Update user profile
  updateProfile: async (profileData: any): Promise<User> => {
    const response: AxiosResponse<{ data: { user: User } }> = await api.put('/auth/profile', profileData);
    return response.data.data.user;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('authToken');
    }
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    const response: AxiosResponse<{ data: { token: string } }> = await api.post('/auth/refresh');
    return response.data.data.token;
  },

  // Set auth token
  setAuthToken: (token: string): void => {
    localStorage.setItem('authToken', token);
  },

  // Get auth token
  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;