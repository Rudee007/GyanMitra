// types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
    grade: number;
    preferredLanguage: string;
    subjects: string[];
    verified: boolean;
    role: string;
    hasPassword: boolean;
    providers: any[];
    createdAt: string;
    lastLoginAt?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    grade: number;
    preferredLanguage: string;
    subjects: string[];
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface UpdateProfileData {
    name?: string;
    grade?: number;
    preferredLanguage?: string;
    subjects?: string[];
  }
  
  export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
  }
  
  // types/index.ts
// ... existing user types ...

// Export chat types
export * from './chat';
