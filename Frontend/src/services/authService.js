/**
 * Authentication Service
 * Handles all authentication API calls
 * Backend API Documentation v1.0.0
 */

import axiosInstance from '../lib/axiosInstance';

// Storage keys (matching backend expectations)
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

const authService = {
  /**
   * Register new user
   * POST /api/auth/register
   */
/**
 * Register new user
 * POST /api/auth/signup
 */
/**
 * Register new user
 * POST /api/auth/signup
 */
register: async (userData) => {
  try {
    console.log('📝 Registering user...');

    // Validate required fields
    const { name, email, password, grade, subjects, preferredLanguage } = userData;

    // Validation checks
    if (!name || !email || !password || !grade || !subjects || !preferredLanguage) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      throw new Error('Please select at least one subject');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // ✅ Convert subjects to lowercase (backend expects lowercase)
    const subjectsLowercase = subjects.map(subject => subject.toLowerCase());

    // Log what we're sending (for debugging)
    console.log('📤 Sending registration data:', {
      name,
      email,
      grade: parseInt(grade),
      subjects: subjectsLowercase, // ← Now lowercase
      preferredLanguage,
    });

    // Make API call
    const response = await axiosInstance.post('/auth/signup', {
      name,
      email,
      password,
      grade: parseInt(grade),
      subjects: subjectsLowercase, // ← Send lowercase subjects
      preferredLanguage: preferredLanguage || 'english',
    });

    console.log('✅ Registration successful');
    console.log('📧 Verification email sent to:', response.data.email);

    return {
      success: true,
      message: response.data.message || 'Account created! Please check your email to verify.',
      email: response.data.email,
      verified: response.data.verified || false,
    };
  } catch (error) {
    console.error('❌ Registration failed:', error);

    // Better error handling
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: {
        message: errorMessage,
        code: error.response?.status || error.status || 500,
      },
    };
  }
},

  /**
   * Login user
   * POST /api/auth/login
   */
  login: async (email, password) => {
    try {
      console.log('🔐 Logging in...');

      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Make API call
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store token and user data
      localStorage.setItem(TOKEN_KEY, token);
      
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      console.log('✅ Login successful');

      return {
        success: true,
        token,
        user,
        message: 'Login successful!',
      };
    } catch (error) {
      console.error('❌ Login failed:', error);

      return {
        success: false,
        error: {
          message: error.message || 'Login failed. Please check your credentials.',
          code: error.status || 500,
        },
      };
    }
  },

  /**
   * Verify email
   * GET /api/auth/verify-email?token=xxx
   */
  verifyEmail: async (token) => {
    try {
      console.log('📧 Verifying email...');

      if (!token) {
        throw new Error('Verification token is required');
      }

      // Make API call with query parameter
      const response = await axiosInstance.get('/auth/verify', {
        params: { token },
      });

      console.log('✅ Email verified successfully');

      return {
        success: true,
        message: response.data.message || 'Email verified successfully! You can now login.',
      };
    } catch (error) {
      console.error('❌ Email verification failed:', error);

      return {
        success: false,
        error: {
          message: error.message || 'Email verification failed. Invalid or expired token.',
          code: error.status || 500,
        },
      };
    }
  },

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('👤 Fetching current user...');

      // Make API call
      const response = await axiosInstance.get('/auth/profile');

      const user = response.data.user || response.data;

      // Update stored user data
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      console.log('✅ User data fetched');

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('❌ Failed to get current user:', error);

      // If unauthorized, clear stored data
      if (error.status === 401) {
        authService.logout();
      }

      return {
        success: false,
        error: {
          message: error.message || 'Failed to get user data',
          code: error.status || 500,
        },
      };
    }
  },

  /**
   * Logout user
   * Clear localStorage and reset state
   */
  logout: () => {
    try {
      console.log('👋 Logging out...');

      // Clear localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      console.log('✅ Logged out successfully');

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('❌ Logout error:', error);

      return {
        success: false,
        error: {
          message: 'Logout failed',
          code: 500,
        },
      };
    }
  },

  /**
 * Get user profile
 * GET /api/users/profile
 */
getProfile: async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('👤 Fetching user profile...');

    // Make API call to /users/profile
    const response = await axiosInstance.get('/users/profile');

    const user = response.data.data || response.data.user;

    // Update stored user data
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    console.log('✅ Profile data fetched');

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('❌ Failed to get profile:', error);

    return {
      success: false,
      error: {
        message: error.message || 'Failed to get profile data',
        code: error.status || 500,
      },
    };
  }
},

/**
 * Update user profile
 * PUT /api/users/profile
 */
updateProfile: async (updates) => {
  try {
    console.log('📝 Updating profile...');

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Convert subjects to lowercase if present
    if (updates.subjects && Array.isArray(updates.subjects)) {
      updates.subjects = updates.subjects.map(subject => 
        subject.toLowerCase().replace(/\s+/g, '_')
      );
    }

    // Convert language to lowercase if present
    if (updates.preferredLanguage) {
      updates.preferredLanguage = updates.preferredLanguage.toLowerCase();
    }

    console.log('📤 Sending profile updates:', updates);

    // Make API call to /users/profile
    const response = await axiosInstance.put('/users/profile', updates);

    const user = response.data.data || response.data.user;

    // Update stored user data
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    console.log('✅ Profile updated successfully');

    return {
      success: true,
      message: response.data.message || 'Profile updated successfully',
      user,
    };
  } catch (error) {
    console.error('❌ Failed to update profile:', error);

    return {
      success: false,
      error: {
        message: error.message || 'Failed to update profile',
        code: error.status || 500,
      },
    };
  }
},


  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  /**
   * Get stored token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  /**
   * Initialize auth on app start
   * Sets auth header if token exists
   */
  initializeAuth: () => {
    const token = authService.getToken();
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};

export default authService;
