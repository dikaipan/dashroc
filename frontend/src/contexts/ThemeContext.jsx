/**
 * Theme Context - Dark/Light Mode Support
 * Provides theme state and toggle functionality
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme || 'dark';
  });

  // Apply theme to document root - optimized to avoid forced reflow
  useEffect(() => {
    // Use requestAnimationFrame to batch DOM updates and avoid forced reflow
    const updateTheme = () => {
      const root = document.documentElement;
      // Use requestAnimationFrame to ensure DOM updates are batched
      requestAnimationFrame(() => {
        if (theme === 'light') {
          root.classList.add('light-theme');
          root.classList.remove('dark-theme');
        } else {
          root.classList.add('dark-theme');
          root.classList.remove('light-theme');
        }
        // Save to localStorage (non-blocking, can be async)
        try {
          localStorage.setItem('app-theme', theme);
        } catch (e) {
          // Ignore localStorage errors (e.g., in private browsing)
          console.warn('Failed to save theme to localStorage:', e);
        }
      });
    };
    
    updateTheme();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

