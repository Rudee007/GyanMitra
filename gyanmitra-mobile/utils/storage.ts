// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys - define here to avoid circular dependency
const STORAGE_KEYS = {
  TOKEN: '@gyanmitra_token',
  USER: '@gyanmitra_user',
};

/**
 * Storage utility for managing AsyncStorage operations
 */

// Save JWT token
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

// Get JWT token
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Remove JWT token
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

// Save user data
export const saveUser = async (user: any): Promise<void> => {
  try {
    const userString = JSON.stringify(user);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, userString);
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

// Get user data
export const getUser = async (): Promise<any | null> => {
  try {
    const userString = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Remove user data
export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};

// Clear all app data
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER,
    ]);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return token !== null;
  } catch (error) {
    return false;
  }
};
