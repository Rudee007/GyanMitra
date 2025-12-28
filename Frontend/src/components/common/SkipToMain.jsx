/**
 * Skip to Main Content Component
 * Module 9: Accessibility
 * 
 * Allows keyboard users to skip navigation and go directly to main content
 * As specified in README.md Module 9
 * 
 * WCAG 2.1 Level A requirement
 */

import React from 'react';

const SkipToMain = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipToMain;
