// constants/Config.ts
import { Platform } from 'react-native';

function getApiBaseUrl(): string {
  const PORT = 3003; // ✅ Changed from 3000 to 3003
  const YOUR_LOCAL_IP = '10.137.76.37';

  if (__DEV__) {
    return `http://${YOUR_LOCAL_IP}:${PORT}/api`;
  }

  return 'https://your-production-url.com/api';
}

const Config = {
  API_BASE_URL: getApiBaseUrl(),
  API_TIMEOUT: 300000000,

  APP_NAME: 'GyanMitra',
  APP_VERSION: '1.0.0',

  CONVERSATIONS_PER_PAGE: 20,

  MAX_QUERY_LENGTH: 500,
  MAX_COMMENT_LENGTH: 500,

  GRADES: [5, 6, 7, 8, 9, 10] as const,

  LANGUAGES: [
    { value: 'english', label: 'English', flag: '🇬🇧' },
    { value: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'marathi', label: 'मराठी', flag: '🇮🇳' },
    { value: 'urdu', label: 'اردو', flag: '🇵🇰' },
  ] as const,

  SUBJECTS: [
    { value: 'math', label: 'Mathematics', icon: 'calculator', color: '#FF9800' },
    { value: 'science', label: 'Science', icon: 'flask', color: '#4CAF50' },
    { value: 'social_science', label: 'Social Science', icon: 'earth', color: '#2196F3' },
    { value: 'english', label: 'English', icon: 'book', color: '#9C27B0' },
    { value: 'hindi', label: 'Hindi', icon: 'text', color: '#F44336' },
    { value: 'sanskrit', label: 'Sanskrit', icon: 'scroll', color: '#FF5722' },
  ] as const,

  STORAGE_KEYS: {
    TOKEN: '@gyanmitra_token',
    USER: '@gyanmitra_user',
  },

  ANIMATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
};

console.log('🌐 API Base URL:', Config.API_BASE_URL);
console.log('📱 Platform:', Platform.OS);

export default Config;
