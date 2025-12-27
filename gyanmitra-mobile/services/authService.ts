// services/authService.ts
import api from './api';
import { saveToken, saveUser, removeToken, removeUser, getToken, getUser } from '../utils/storage';

/**
 * Register a new user
 * Returns email and verified status (no token until email is verified)
 */
export const register = async (data: any) => {
  try {
    console.log('📝 Registering user:', data.email);
    const response = await api.post('/auth/signup', data);
    
    console.log('✅ Registration response:', response.data);
    
    // Backend returns: { success: true, message: '...', email: '...', verified: false }
    return response.data;
  } catch (error: any) {
    console.error('❌ Registration failed:', error.message);
    throw error;
  }
};

/**
 * Check email verification status
 * Mobile app polls this to know when user has verified email
 */
export const checkVerificationStatus = async (email: string) => {
  try {
    const response = await api.get(`/auth/check-verification?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Check verification failed:', error.message);
    throw error;
  }
};

/**
 * Resend verification email
 */
export const resendVerification = async (email: string) => {
  try {
    console.log('📧 Resending verification email to:', email);
    const response = await api.post('/auth/resend-verification', { email });
    
    console.log('✅ Resend response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Resend failed:', error.message);
    throw error;
  }
};

/**
 * Login existing user (only after email verification)
 */
export const login = async (data: any) => {
  try {
    console.log('🔐 Logging in user:', data.email);
    const response = await api.post('/auth/login', data);
    
    console.log('✅ Login response:', response.data);
    
    // Extract token and user from response
    const { token, user } = response.data;
    
    if (token && user) {
      await saveToken(token);
      await saveUser(user);
    } else {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = async () => {
  try {
    await removeToken();
    await removeUser();
  } catch (error: any) {
    throw error;
  }
};

/**
 * Get current user from storage
 */
export const getCurrentUser = async () => {
  try {
    return await getUser();
  } catch (error: any) {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    return false;
  }
};

/**
 * Validate registration data
 */
export const validateRegistrationData = (data: any) => {
  if (!data.name || data.name.trim().length === 0) {
    return 'Name is required';
  }
  
  if (!data.email || data.email.trim().length === 0) {
    return 'Email is required';
  }
  
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(data.email)) {
    return 'Please provide a valid email address';
  }
  
  if (!data.password || data.password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  if (!data.grade || data.grade < 5 || data.grade > 10) {
    return 'Please select a valid grade (5-10)';
  }
  
  if (!data.preferredLanguage) {
    return 'Please select a preferred language';
  }
  
  if (!data.subjects || data.subjects.length === 0) {
    return 'Please select at least one subject';
  }
  
  return null;
};

/**
 * Validate login data
 */
export const validateLoginData = (data: any) => {
  if (!data.email || data.email.trim().length === 0) {
    return 'Email is required';
  }
  
  if (!data.password || data.password.trim().length === 0) {
    return 'Password is required';
  }
  
  return null;
};

const authService = {
  register,
  checkVerificationStatus,
  resendVerification,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  validateRegistrationData,
  validateLoginData,
};

export default authService;
