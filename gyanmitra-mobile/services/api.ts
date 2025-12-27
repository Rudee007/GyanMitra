// services/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Platform } from 'react-native';
import Config from '../constants/Config';
import { getToken, clearAllStorage } from '../utils/storage';

/**
 * Custom error interface for API errors
 */
interface ApiError {
  message: string;
  status?: number;
  data?: any;
  isNetworkError?: boolean;
  isTimeout?: boolean;
  originalError?: any;
}

/**
 * Axios instance configured for GyanMitra backend
 */
const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add authentication token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding token to request:', error);
    }
    
    // Log request in development
    if (__DEV__) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle global errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (__DEV__) {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    // Log error in development
    if (__DEV__) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - Clearing session');
      
      try {
        await clearAllStorage();
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
      
      // TODO: Navigate to login screen
      // This will be handled by AuthContext in next module
      console.log('👉 User should be redirected to login');
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('🌐 Network error - Check internet connection');
      const apiError: ApiError = {
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
        originalError: error,
      };
      return Promise.reject(apiError);
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout');
      const apiError: ApiError = {
        message: 'Request timeout. Please try again.',
        isTimeout: true,
        originalError: error,
      };
      return Promise.reject(apiError);
    }

    // Return formatted error
    const errorData = error.response?.data as any;
    const apiError: ApiError = {
      message: errorData?.error || errorData?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: errorData,
      originalError: error,
    };

    return Promise.reject(apiError);
  }
);

export default api;
