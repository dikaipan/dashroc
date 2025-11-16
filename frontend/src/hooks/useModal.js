/**
 * Custom hook for modal state management
 * Handles multiple modals and prevents body scroll when modal is open
 * 
 * @param {Array} modalKeys - Array of modal keys to manage (e.g., ['machineList', 'warranty'])
 * @param {Object} options - Options object
 * @param {boolean} options.preventBodyScroll - Prevent body scroll when any modal is open (default: true)
 * @param {boolean} options.closeOnEscape - Close modal on ESC key (default: true)
 * @returns {Object} Modal state and control functions
 */
import { useState, useEffect, useCallback, useMemo } from 'react';

export function useModal(modalKeys = [], options = {}) {
  const {
    preventBodyScroll = true,
    closeOnEscape = true
  } = options;

  // Create initial state object with all modal keys set to false
  const initialState = useMemo(() => {
    const state = {};
    modalKeys.forEach(key => {
      state[key] = false;
    });
    return state;
  }, [modalKeys]);

  const [modals, setModals] = useState(initialState);

  // Check if any modal is open
  const isAnyModalOpen = useMemo(() => {
    return Object.values(modals).some(isOpen => isOpen === true);
  }, [modals]);

  // Open a specific modal
  const openModal = useCallback((modalKey) => {
    if (modalKeys.includes(modalKey)) {
      setModals(prev => ({ ...prev, [modalKey]: true }));
    }
  }, [modalKeys]);

  // Close a specific modal
  const closeModal = useCallback((modalKey) => {
    if (modalKeys.includes(modalKey)) {
      setModals(prev => ({ ...prev, [modalKey]: false }));
    }
  }, [modalKeys]);

  // Toggle a specific modal
  const toggleModal = useCallback((modalKey) => {
    if (modalKeys.includes(modalKey)) {
      setModals(prev => ({ ...prev, [modalKey]: !prev[modalKey] }));
    }
  }, [modalKeys]);

  // Close all modals
  const closeAllModals = useCallback(() => {
    setModals(initialState);
  }, [initialState]);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    if (!preventBodyScroll) return;

    if (isAnyModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen, preventBodyScroll]);

  // Handle ESC key to close modals
  useEffect(() => {
    if (!closeOnEscape || !isAnyModalOpen) return;

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        // Close the last opened modal (in reverse order)
        const openModalKeys = Object.entries(modals)
          .filter(([_, isOpen]) => isOpen)
          .map(([key]) => key);
        
        if (openModalKeys.length > 0) {
          closeModal(openModalKeys[openModalKeys.length - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [closeOnEscape, isAnyModalOpen, modals, closeModal]);

  // Create getter functions for each modal
  const modalGetters = useMemo(() => {
    const getters = {};
    modalKeys.forEach(key => {
      getters[`is${key.charAt(0).toUpperCase() + key.slice(1)}Open`] = modals[key] || false;
    });
    return getters;
  }, [modalKeys, modals]);

  // Create setter functions for each modal
  const modalSetters = useMemo(() => {
    const setters = {};
    modalKeys.forEach(key => {
      setters[`set${key.charAt(0).toUpperCase() + key.slice(1)}Open`] = (isOpen) => {
        setModals(prev => ({ ...prev, [key]: isOpen }));
      };
    });
    return setters;
  }, [modalKeys]);

  return {
    modals,
    isAnyModalOpen,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    ...modalGetters,
    ...modalSetters
  };
}

