/**
 * Custom hook for debouncing values
 * Useful for search inputs and filter changes
 * 
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {*} Debounced value
 */
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Return a cleanup function that will be called every time useEffect is re-called.
    // useEffect will only be re-called if value or delay changes.
    // This is how we prevent debouncedValue from changing if value is changed within delay period.
    // Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

