// services/userService.ts
import api from './api';
import { saveUser } from '../utils/storage';
import type { User, UpdateProfileData, ApiSuccessResponse } from '../types';

/**
 * User Service
 * Handles user profile-related API calls
 */

/**
 * Get current user's profile from backend
 * @returns Promise with user data
 */
export const getProfile = async (): Promise<User> => {
  try {
    console.log('👤 Fetching user profile');
    
    const response = await api.get<ApiSuccessResponse<User>>('/users/profile');
    
    // Update stored user data
    await saveUser(response.data.data);
    
    console.log('✅ Profile fetched successfully');
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch profile:', error.message);
    throw error;
  }
};

/**
 * Update current user's profile
 * @param data - Profile data to update (all fields optional)
 * @returns Promise with updated user data
 */
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    console.log('✏️ Updating user profile');
    
    const response = await api.put<ApiSuccessResponse<User>>('/users/profile', data);
    
    // Update stored user data
    await saveUser(response.data.data);
    
    console.log('✅ Profile updated successfully');
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Failed to update profile:', error.message);
    throw error;
  }
};

/**
 * Validate profile update data
 * @param data - Data to validate
 * @returns Error message or null if valid
 */
export const validateProfileData = (data: UpdateProfileData): string | null => {
  if (data.name !== undefined && data.name.trim().length === 0) {
    return 'Name cannot be empty';
  }
  
  if (data.grade !== undefined) {
    if (typeof data.grade !== 'number' || data.grade < 5 || data.grade > 10) {
      return 'Grade must be between 5 and 10';
    }
  }
  
  if (data.preferredLanguage !== undefined) {
    const validLanguages = ['english', 'hindi', 'marathi', 'urdu'];
    if (!validLanguages.includes(data.preferredLanguage.toLowerCase())) {
      return 'Invalid language selected';
    }
  }
  
  if (data.subjects !== undefined) {
    if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
      return 'At least one subject must be selected';
    }
    
    const validSubjects = ['math', 'science', 'social_science', 'english', 'hindi', 'sanskrit'];
    const invalidSubjects = data.subjects.filter(
      s => !validSubjects.includes(s.toLowerCase())
    );
    
    if (invalidSubjects.length > 0) {
      return `Invalid subjects: ${invalidSubjects.join(', ')}`;
    }
  }
  
  return null; // All validations passed
};

// Export all functionsof
const userService = {
  getProfile,
  updateProfile,
  validateProfileData,
};

export default userService;
