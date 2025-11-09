/**
 * Custom hook for dashboard event handlers
 * Separates business logic from UI component
 */

/**
 * Hook for dashboard event handlers
 * @param {Function} onNavigate - Navigation callback function
 * @returns {Object} Event handler functions
 */
export function useDashboardHandlers(onNavigate) {
  /**
   * Handle engineer click - navigate to engineer detail
   * @param {Object} engineer - Engineer object
   */
  const handleEngineerClick = (engineer) => {
    if (onNavigate) {
      onNavigate('engineers', engineer);
    }
  };

  return {
    handleEngineerClick
  };
}

