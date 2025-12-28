/**
 * Authentication Context
 * Manages global authentication state
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * Auto-load user on app start
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Initialize auth headers
        authService.initializeAuth();

        // Check if token exists
        if (authService.isAuthenticated()) {
          // Try to get current user from API
          const result = await authService.getCurrentUser();

          if (result.success && result.user) {
            setUser(result.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear everything
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No token
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login method
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true);

      const result = await authService.login(email, password);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);

        toast.success('Login successful!');

        // Redirect to chat
        navigate('/chat');

        return { success: true };
      } else {
        toast.error(result.error.message);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return { success: false, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register method
   */
/**
 * Register method
 */
const register = async (name, email, password, grade, subjects, preferredLanguage = 'english') => {
  try {
    setIsLoading(true);

    // Call authService with all required fields
    const result = await authService.register({
      name,
      email,
      password,
      grade,
      subjects,
      preferredLanguage, // ← Make sure this is passed!
    });

    if (result.success) {
      toast.success(result.message, { duration: 5000 });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

      return { success: true, message: result.message };
    } else {
      toast.error(result.error.message);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Registration failed. Please try again.');
    return { success: false, error: { message: error.message } };
  } finally {
    setIsLoading(false);
  }
};

  /**
   * Logout method
   */
  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);

      toast.success('Logged out successfully');

      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  /**
   * Verify email method
   */
  const verifyEmail = async (token) => {
    try {
      setIsLoading(true);

      const result = await authService.verifyEmail(token);

      if (result.success) {
        // toast.success(result.message);
        return { success: true, message: result.message };
      } else {
        // toast.error(result.error.message);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      // toast.error('Email verification failed');
      return { success: false, error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const result = await authService.getCurrentUser();

      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { success: false };
    }
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
