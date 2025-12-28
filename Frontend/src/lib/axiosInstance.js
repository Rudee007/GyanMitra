import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL:'http://localhost:3003/api',
  timeout: 600000, // 10 minutes for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Check dev mode
const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Use dev token in dev mode
    let token;
    if (DEV_MODE) {
      token = 'dev_bypass_token_12345';
      if (import.meta.env.DEV) {
        console.log('🔓 DEV MODE: Using bypass token');
      }
    } else {
      token = localStorage.getItem('auth_token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
      if (config.data) {
        console.log('📤 Request Data:', config.data);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.status, response.config.url);
      console.log('📥 Response Data:', response.data);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    if (!error.response) {
      console.error('🌐 Network Error');
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your internet connection.',
      });
    }
    
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        console.error('🔒 Unauthorized: Session expired');
        // ✅ Don't logout in dev mode
        if (!DEV_MODE) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        } else {
          console.log('🔓 DEV MODE: Ignoring 401 error');
        }
        break;
        
      case 403:
        console.error('🚫 Forbidden: Access denied');
        break;
        
      case 404:
        console.error('🔍 Not Found: Resource not found');
        break;
        
      case 500:
        console.error('⚠️ Server Error');
        break;
        
      default:
        console.error('❌ Error:', error.message);
    }
    
    return Promise.reject({
      status,
      message: data?.error || data?.message || error.message,
      data: data,
    });
  }
);

export default axiosInstance;
