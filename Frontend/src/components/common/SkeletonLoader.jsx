/**
 * Skeleton Loader Component
 * Module 8: Error Handling & Loading States
 * 
 * Provides skeleton loading states for various scenarios
 * As specified in README.md Module 8
 */

import React from 'react';

// Message Skeleton for chat area
export const MessageSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* AI Message Skeleton */}
      <div className="flex justify-start">
        <div className="max-w-[70%] w-full">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-bl-lg p-4 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      {/* User Message Skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[70%] w-full">
          <div className="bg-gray-300 dark:bg-gray-600 rounded-2xl rounded-br-lg p-4 space-y-2">
            <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-2/3"></div>
            <div className="h-4 bg-gray-400 dark:bg-gray-500 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Conversation List Skeleton for sidebar
export const ConversationSkeleton = () => {
  return (
    <div className="space-y-2 px-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

// Page Skeleton for initial load
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"></div>
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-72 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-4 space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 space-y-4">
            <MessageSkeleton />
          </div>
          
          {/* Input Bar Skeleton */}
          <div className="h-24 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

// Card Skeleton for profile/settings
export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
    </div>
  );
};

// Inline Loading (for buttons)
export const InlineLoading = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default {
  MessageSkeleton,
  ConversationSkeleton,
  PageSkeleton,
  CardSkeleton,
  LoadingSpinner,
  InlineLoading
};
