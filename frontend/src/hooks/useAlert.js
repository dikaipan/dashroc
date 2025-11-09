/**
 * Custom hook for managing alert dialogs
 * Replaces native alert() with beautiful custom alerts
 */
import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'info',
    title: null,
    message: '',
    duration: 3000
  });

  const showAlert = useCallback((message, type = 'info', title = null, duration = 3000) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message,
      duration
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Convenience methods
  const success = useCallback((message, title = 'Berhasil', duration = 3000) => {
    showAlert(message, 'success', title, duration);
  }, [showAlert]);

  const error = useCallback((message, title = 'Error', duration = 5000) => {
    showAlert(message, 'error', title, duration);
  }, [showAlert]);

  const warning = useCallback((message, title = 'Peringatan', duration = 4000) => {
    showAlert(message, 'warning', title, duration);
  }, [showAlert]);

  const info = useCallback((message, title = 'Informasi', duration = 3000) => {
    showAlert(message, 'info', title, duration);
  }, [showAlert]);

  return {
    alertState,
    showAlert,
    closeAlert,
    success,
    error,
    warning,
    info
  };
};

