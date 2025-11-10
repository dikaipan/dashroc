/**
 * Custom hook for machine filtering and sorting logic
 * Separates business logic from UI component
 */
import { useMemo } from 'react';

/**
 * Hook for filtering machines
 * @param {Array} machines - Array of machine objects
 * @param {Object} filters - Filter configuration
 * @param {string} filters.debouncedSearch - Debounced search term
 * @param {string} filters.customerFilter - Customer filter value
 * @param {string} filters.regionFilter - Region filter value
 * @param {string} filters.warrantyFilter - Warranty status filter (On Warranty, Out Of Warranty)
 * @returns {Array} Filtered machines
 */
export function useMachineFilters(machines, { debouncedSearch, customerFilter, regionFilter, warrantyFilter }) {
  return useMemo(() => {
    let filtered = machines;
    
    // Apply search filter
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(m =>
        m.branch_name?.toLowerCase().includes(search) ||
        m.wsid?.toLowerCase().includes(search) ||
        m.customer?.toLowerCase().includes(search) ||
        m.city?.toLowerCase().includes(search)
      );
    }
    
    // Apply customer filter (additive)
    if (customerFilter) {
      filtered = filtered.filter(m => m.customer === customerFilter);
    }
    
    // Apply region filter (additive)
    if (regionFilter) {
      filtered = filtered.filter(m => m.region === regionFilter);
    }
    
    // Apply warranty status filter (additive)
    if (warrantyFilter) {
      filtered = filtered.filter(m => {
        const status = m.machine_status || '';
        if (warrantyFilter === 'On Warranty') {
          // Match both 'In Warranty' and 'On Warranty'
          return status === 'In Warranty' || status === 'On Warranty';
        } else if (warrantyFilter === 'Out Of Warranty') {
          // Match 'Out Of Warranty' and expired variants
          return status === 'Out Of Warranty' || status.toLowerCase().includes('expired');
        }
        return false;
      });
    }
    
    return filtered;
  }, [machines, debouncedSearch, customerFilter, regionFilter, warrantyFilter]);
}

