/**
 * Error Banner Component
 * Module 8: Error Handling & Loading States
 * 
 * Displays error messages for various scenarios
 * As specified in README.md Module 8
 * 
 * Scenarios:
 * 1. Network error → "Check your connection" banner
 * 2. Server error → "Something went wrong" message
 * 3. Auth error → Redirect to login
 * 4. Invalid input → Form validation errors
 */

import { AlertCircle, WifiOff, ServerCrash, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorBanner = ({ 
  type = 'error', 
  message, 
  onClose, 
  onRetry,
  dismissible = true 
}) => {
  const errorTypes = {
    network: {
      icon: WifiOff,
      title: 'Network Error',
      defaultMessage: 'Check your internet connection and try again',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-800 dark:text-orange-200',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    server: {
      icon: ServerCrash,
      title: 'Server Error',
      defaultMessage: 'Something went wrong on our end. Please try again later',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    error: {
      icon: AlertCircle,
      title: 'Error',
      defaultMessage: 'An error occurred. Please try again',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    warning: {
      icon: AlertCircle,
      title: 'Warning',
      defaultMessage: 'Please check your input and try again',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    }
  };

  const config = errorTypes[type] || errorTypes.error;
  const Icon = config.icon;
  const displayMessage = message || config.defaultMessage;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-r-lg shadow-md`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-semibold ${config.textColor}`}>
              {config.title}
            </h3>
            <p className={`text-sm mt-1 ${config.textColor}`}>
              {displayMessage}
            </p>

            {/* Actions */}
            {onRetry && (
              <button
                onClick={onRetry}
                className={`mt-3 inline-flex items-center space-x-2 text-sm font-medium ${config.textColor} hover:underline`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            )}
          </div>

          {/* Close Button */}
          {dismissible && onClose && (
            <button
              onClick={onClose}
              className={`ml-3 flex-shrink-0 ${config.textColor} hover:opacity-75 transition-opacity`}
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Fixed position banner (for global errors)
export const FixedErrorBanner = ({ type, message, onClose, onRetry }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <ErrorBanner
        type={type}
        message={message}
        onClose={onClose}
        onRetry={onRetry}
      />
    </div>
  );
};

export default ErrorBanner;
