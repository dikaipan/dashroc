/**
 * Generic data fetching hook
 * Reusable hook for fetching data from API with error handling and loading states
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data fetching hook
 * @param {string} endpoint - API endpoint (e.g., '/api/engineers')
 * @param {Object} options - Additional options
 * @param {Function} options.parser - Optional parser function for data transformation
 * @param {boolean} options.autoFetch - Whether to fetch automatically on mount (default: true)
 * @param {string} options.eventName - Custom event name to listen for data refresh
 * @returns {Object} { data, loading, error, refetch }
 */
export function useDataFetch(endpoint, options = {}) {
  const {
    parser = null,
    autoFetch = true,
    eventName = null,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const processedData = parser ? parser(result) : result;
      
      setData(processedData);
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, parser]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    // Listen for custom events to refresh data
    // Optimized: Debounce rapid events and use requestIdleCallback to avoid performance issues
    if (eventName) {
      let timeoutId = null;
      let isPending = false;
      let rafId = null;
      
      const handleDataChange = () => {
        // Clear existing timeout and RAF
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        
        // Increased debounce: wait 250ms before fetching to batch rapid events
        // Use requestIdleCallback for better performance (falls back to setTimeout)
        timeoutId = setTimeout(() => {
          if (!isPending) {
            isPending = true;
            
            // Use requestIdleCallback if available, otherwise use RAF
            const scheduleFetch = () => {
              if (window.requestIdleCallback) {
                window.requestIdleCallback(() => {
                  fetchData().then(() => {
                    isPending = false;
                  }).catch(() => {
                    isPending = false;
                  });
                }, { timeout: 1000 });
              } else {
                rafId = requestAnimationFrame(() => {
                  fetchData().then(() => {
                    isPending = false;
                  }).catch(() => {
                    isPending = false;
                  });
                });
              }
            };
            
            scheduleFetch();
          }
        }, 250); // Increased from 100ms to 250ms
      };

      window.addEventListener(eventName, handleDataChange, { passive: true });

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        window.removeEventListener(eventName, handleDataChange);
      };
    }
  }, [autoFetch, eventName, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

