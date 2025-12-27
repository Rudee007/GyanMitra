// constants/Colors.ts

export const Colors = {
  // Primary Gradient (Purple-Blue) - For buttons, headers
  primary: {
    start: '#667eea',
    end: '#764ba2',
    solid: '#6b7bd6',
  },

  // Secondary Gradient (Pink-Red) - For accents, highlights
  secondary: {
    start: '#f093fb',
    end: '#f5576c',
    solid: '#f37682',
  },

  // Success Gradient (Blue-Cyan) - For positive feedback
  success: {
    start: '#4facfe',
    end: '#00f2fe',
    solid: '#2fa0f6',
  },

  // Subject-specific colors
  subjects: {
    math: '#FF9800',      // Orange
    science: '#4CAF50',   // Green
    social_science: '#2196F3',  // Blue
    english: '#9C27B0',   // Purple
    hindi: '#F44336',     // Red
    sanskrit: '#FF5722',  // Deep Orange
  },

  // UI Colors
  background: '#f8f9ff',          // Very light blue-white
  surface: '#ffffff',             // Pure white
  card: '#f5f7ff',               // Light card background
  
  // Text
  text: {
    primary: '#1a1a2e',          // Almost black
    secondary: '#6b7280',        // Gray
    light: '#9ca3af',            // Light gray
    white: '#ffffff',
  },

  // Message bubbles
  userMessage: {
    start: '#667eea',
    end: '#764ba2',
  },
  aiMessage: {
    background: '#f5f7ff',
    border: '#e5e7eb',
  },

  // Feedback
  positive: '#4CAF50',
  negative: '#F44336',
  
  // Status
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Borders
  border: '#e5e7eb',
  divider: '#f3f4f6',

  // Shadows
  shadow: {
    color: '#000000',
    opacity: 0.1,
  },

  // Professional Student-Friendly Theme (ADD THIS NEW SECTION)
  professional: {
    // Primary colors
    blue: '#2563EB',              // Deep professional blue
    blueLight: '#DBEAFE',         // Light blue for backgrounds
    blueDark: '#1E40AF',          // Darker blue for depth
    
    // Accent colors
    orange: '#F97316',            // Vibrant orange for CTAs
    orangeLight: '#FFEDD5',       // Light orange for backgrounds
    orangeDark: '#EA580C',        // Darker orange for gradients
    
    // Supporting colors
    purple: '#8B5CF6',            // Friendly purple
    purpleLight: '#EDE9FE',       // Light purple background
    
    green: '#10B981',             // Success/positive
    greenLight: '#D1FAE5',        // Light green background
    
    // Background gradients
    bgTop: '#F0F9FF',             // Light blue-white top
    bgBottom: '#FEF3E8',          // Warm cream bottom
    
    // Neutral
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray600: '#4B5563',
    gray800: '#1F2937',
  },
};

export default Colors;
