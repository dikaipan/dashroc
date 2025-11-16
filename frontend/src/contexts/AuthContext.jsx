import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Always clear any existing stored session so all users must login again
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to clear stored user:', error);
    }
    setLoading(false);
  }, []);

  // Memoize login function to prevent re-renders
  const login = useCallback(async (username, password) => {
    try {
      if (!username || !password) {
        throw new Error('Username and password required');
      }

      if (username !== 'rocadmn' || password !== 'Roc#_12345') {
        throw new Error('Invalid username or password');
      }

      const userData = {
        id: Date.now(),
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'admin',
        loginTime: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  }, []);

  // Memoize logout function to prevent re-renders
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};