/**
 * useDebounce Hook
 * Module 10: Performance Optimization
 * 
 * Debounces a value to reduce unnecessary re-renders and API calls
 * As specified in README.md Module 10
 */

import { useState, useEffect } from 'react';

/**
 * Debounce hook that delays updating the value
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
