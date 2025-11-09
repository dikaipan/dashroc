/**
 * Custom hook for managing confirmation dialogs
 * Replaces native confirm() with beautiful custom confirm dialogs
 */
import { useState, useCallback } from 'react';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: 'Konfirmasi',
    message: '',
    onConfirm: null,
    confirmText: 'Ya',
    cancelText: 'Batal',
    type: 'warning',
    confirmButtonColor: 'bg-blue-600 hover:bg-blue-700'
  });

  const showConfirm = useCallback((message, onConfirm, options = {}) => {
    setConfirmState({
      isOpen: true,
      title: options.title || 'Konfirmasi',
      message,
      onConfirm,
      confirmText: options.confirmText || 'Ya',
      cancelText: options.cancelText || 'Batal',
      type: options.type || 'warning',
      confirmButtonColor: options.confirmButtonColor || 'bg-blue-600 hover:bg-blue-700'
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirmState.onConfirm) {
      // Close dialog immediately to avoid double loading spinner
      // The InlineLoadingSpinner will show the loading state
      closeConfirm();
      
      try {
        // Execute callback (which may be async)
        await confirmState.onConfirm();
      } catch (error) {
        // Error will be handled by the callback's error handling
        // No need to do anything here
      }
    } else {
      closeConfirm();
    }
  }, [confirmState, closeConfirm]);

  return {
    confirmState,
    showConfirm,
    closeConfirm,
    handleConfirm
  };
};

