/**
 * Custom hook for machine KPI calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';
import { normalizeAreaGroup } from '../utils/textUtils';

/**
 * Calculate remaining warranty time in days
 * @param {string|number} year - Installation year
 * @param {number} warrantyPeriodYears - Warranty period in years (default: 2)
 * @returns {Object} Remaining warranty info
 */
function calculateWarrantyRemaining(year, warrantyPeriodYears = 2) {
  if (!year) return { days: 0, months: 0, years: 0, expired: true, status: 'expired' };
  
  const installYear = parseInt(year) || new Date().getFullYear();
  const currentDate = new Date();
  const warrantyEndDate = new Date(installYear + warrantyPeriodYears, 11, 31); // End of warranty year
  const diffTime = warrantyEndDate - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { days: 0, months: 0, years: 0, expired: true, status: 'expired' };
  }
  
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;
  
  let status = 'good';
  if (diffDays < 90) status = 'critical';
  else if (diffDays < 180) status = 'warning';
  
  return { days, months, years, expired: false, status, totalDays: diffDays };
}

/**
 * Hook for calculating machine KPIs
 * @param {Array} filteredMachines - Filtered machine array
 * @param {Array} allMachines - All machines array
 * @param {number} warrantyPeriodYears - Warranty period in years (default: 2)
 * @returns {Object} KPI data
 */
export function useMachineKPIs(filteredMachines, allMachines, warrantyPeriodYears = 2) {
  return useMemo(() => {
    const totalMachines = filteredMachines.length;
    
    // Calculate warranty statistics
    const onWarranty = filteredMachines.filter(m => 
      m.machine_status === 'On Warranty' || m.machine_status === 'In Warranty'
    ).length;
    
    const outOfWarranty = filteredMachines.filter(m => 
      m.machine_status === 'Out Of Warranty' || (m.machine_status && m.machine_status.toLowerCase().includes('expired'))
    ).length;
    
    // Calculate warranty remaining time for machines on warranty
    const warrantyRemainingStats = filteredMachines
      .filter(m => m.machine_status === 'On Warranty' || m.machine_status === 'In Warranty')
      .map(m => calculateWarrantyRemaining(m.year, warrantyPeriodYears))
      .filter(w => !w.expired);
    
    // Calculate average remaining warranty
    const avgRemainingDays = warrantyRemainingStats.length > 0
      ? Math.round(warrantyRemainingStats.reduce((sum, w) => sum + w.totalDays, 0) / warrantyRemainingStats.length)
      : 0;
    
    // Count machines by warranty status (critical, warning, good)
    const warrantyStatusCounts = warrantyRemainingStats.reduce((acc, w) => {
      acc[w.status] = (acc[w.status] || 0) + 1;
      return acc;
    }, { critical: 0, warning: 0, good: 0 });
    
    // Find machines expiring soon (within 90 days)
    const expiringSoon = warrantyRemainingStats.filter(w => w.status === 'critical').length;
    
    // Calculate maintenance statistics
    const maintenanceStats = filteredMachines.reduce((acc, m) => {
      const status = m.maintenance_status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate top area groups (with normalization to combine similar areas)
    const areaGroupCounts = filteredMachines.reduce((acc, m) => {
      const originalAreaGroup = m.area_group || 'Unknown';
      const normalizedAreaGroup = normalizeAreaGroup(originalAreaGroup);
      acc[normalizedAreaGroup] = (acc[normalizedAreaGroup] || 0) + 1;
      return acc;
    }, {});
    
    const topAreaGroups = Object.entries(areaGroupCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    // Calculate top customers
    const customerCounts = filteredMachines.reduce((acc, m) => {
      const customer = m.customer || 'Unknown';
      acc[customer] = (acc[customer] || 0) + 1;
      return acc;
    }, {});
    
    const topCustomers = Object.entries(customerCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    
    return {
      totalMachines,
      totalAllMachines: allMachines.length,
      onWarranty,
      outOfWarranty,
      warrantyRemaining: {
        avgDays: avgRemainingDays,
        avgMonths: Math.round(avgRemainingDays / 30),
        avgYears: Math.round(avgRemainingDays / 365),
        expiringSoon,
        statusCounts: warrantyStatusCounts
      },
      maintenanceStats,
      topAreaGroups,
      topCustomers
    };
  }, [filteredMachines, allMachines, warrantyPeriodYears]);
}

