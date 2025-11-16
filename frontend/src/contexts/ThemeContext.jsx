/**
 * Theme Context - Dark/Light Mode Support
 * Provides theme state and toggle functionality
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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
    // Use setTimeout instead of RAF to avoid RAF handler violations
    // Theme updates are not critical enough to need RAF
    const root = document.documentElement;
    
    // Apply theme classes immediately (synchronous is fine for class changes)
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    }
    
    // Save to localStorage asynchronously to avoid blocking
    setTimeout(() => {
      try {
        localStorage.setItem('app-theme', theme);
      } catch (e) {
        // Ignore localStorage errors (e.g., in private browsing)
        console.warn('Failed to save theme to localStorage:', e);
      }
    }, 0);
  }, [theme]);

  // Memoize toggleTheme to prevent re-renders
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

