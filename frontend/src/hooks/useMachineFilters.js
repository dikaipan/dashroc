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
 * @param {string} filters.sortBy - Sort field (region, area_group, warranty, maintenance, customer)
 * @param {string} filters.sortValue - Sort value for filtering
 * @returns {Array} Filtered machines
 */
export function useMachineFilters(machines, { debouncedSearch, sortBy, sortValue }) {
  return useMemo(() => {
    let filtered = machines;
    
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(m =>
        m.branch_name?.toLowerCase().includes(search) ||
        m.wsid?.toLowerCase().includes(search) ||
        m.customer?.toLowerCase().includes(search) ||
        m.city?.toLowerCase().includes(search)
      );
    }
    
    if (sortBy === "region" && sortValue) {
      filtered = filtered.filter(m => m.region === sortValue);
    } else if (sortBy === "area_group" && sortValue) {
      filtered = filtered.filter(m => m.area_group === sortValue);
    } else if (sortBy === "warranty" && sortValue) {
      filtered = filtered.filter(m => {
        const status = m.machine_status || '';
        if (sortValue === 'On Warranty') {
          // Match both 'In Warranty' and 'On Warranty'
          return status === 'In Warranty' || status === 'On Warranty';
        } else if (sortValue === 'Out Of Warranty') {
          // Match 'Out Of Warranty' and expired variants
          return status === 'Out Of Warranty' || status.toLowerCase().includes('expired');
        }
        return status === sortValue;
      });
    } else if (sortBy === "maintenance" && sortValue) {
      filtered = filtered.filter(m => m.maintenance_status === sortValue);
    } else if (sortBy === "customer" && sortValue) {
      filtered = filtered.filter(m => m.customer === sortValue);
    }
    
    return filtered;
  }, [machines, debouncedSearch, sortBy, sortValue]);
}

