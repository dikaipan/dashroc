/**
 * Custom hook for stock part KPI calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';

/**
 * Hook for calculating stock part KPIs
 * @param {Array} validParts - Array of valid parts
 * @param {Array} filteredStockParts - Filtered stock parts
 * @param {Array} fslLocations - Array of FSL location objects
 * @returns {Object} KPI data
 */
export function useStockPartKPIs(validParts, filteredStockParts, fslLocations) {
  // Stock Alert Categories - grouped by FSL location
  const stockAlerts = useMemo(() => {
    const alerts = {
      critical: [],      // 0 stock per FSL
      urgent: [],        // 1-5 units per FSL
      warning: [],       // 6-10 units per FSL
      priorityCritical: [], // Top 20 usage parts with low stock per FSL
      overstock: []      // Stock > 100 units per FSL
    };
    
    validParts.forEach(part => {
      const partNumber = part.part_number || part['part number'] || '';
      if (partNumber.toLowerCase() === 'region') return;
      
      const isTop20 = (part['20_top_usage'] || part['20 top usage'] || '').toLowerCase() === 'yes';
      
      // Get all FSL columns
      const fslColumns = Object.keys(part).filter(col => 
        col.toLowerCase().includes('idfsl') || col.toLowerCase().includes('idccw')
      );
      
      // Check stock at each FSL location
      fslColumns.forEach(fslCol => {
        const stock = parseInt(part[fslCol] || 0);
        
        // Extract readable FSL name
        let fslName = fslCol;
        if (fslCol.includes('idfsl') && fslCol.includes('_fsl_')) {
          const cityPart = fslCol.split('_fsl_')[1];
          if (cityPart) {
            fslName = 'FSL ' + cityPart.split('_').map(w => 
              w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ');
          }
        } else if (fslCol.includes('idccw')) {
          const descPart = fslCol.replace(/^idccw\d+_/, '');
          if (descPart) {
            fslName = descPart.split('_').map(w => 
              w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ');
            // Add Jakarta location for Country Central Warehouse
            if (fslCol.toLowerCase().includes('idccw00')) {
              fslName += ' (Jakarta)';
            }
          }
        }
        
        const alertEntry = {
          part,
          fslName,
          fslColumn: fslCol,
          stock
        };
        
        // Categorize by stock level at this FSL
        if (stock === 0) {
          alerts.critical.push(alertEntry);
        } else if (stock >= 1 && stock <= 5) {
          alerts.urgent.push(alertEntry);
          if (isTop20) alerts.priorityCritical.push(alertEntry);
        } else if (stock >= 6 && stock <= 10) {
          alerts.warning.push(alertEntry);
          if (isTop20) alerts.priorityCritical.push(alertEntry);
        } else if (stock > 100) {
          alerts.overstock.push(alertEntry);
        }
      });
    });
    
    return {
      critical: alerts.critical,
      urgent: alerts.urgent,
      warning: alerts.warning,
      priorityCritical: alerts.priorityCritical,
      overstock: alerts.overstock,
      criticalCount: alerts.critical.length,
      urgentCount: alerts.urgent.length,
      warningCount: alerts.warning.length,
      priorityCriticalCount: alerts.priorityCritical.length,
      overstockCount: alerts.overstock.length,
      totalLowStock: alerts.critical.length + alerts.urgent.length + alerts.warning.length
    };
  }, [validParts]);

  // Total stock across all parts
  const totalStockQuantity = useMemo(() => {
    return filteredStockParts.reduce((sum, part) => {
      return sum + parseInt(part.grand_total || part['grand total'] || 0);
    }, 0);
  }, [filteredStockParts]);

  // Region distribution
  const regionDistribution = useMemo(() => {
    const dist = {};
    fslLocations.forEach(fsl => {
      const region = fsl.region || fsl['region '] || 'Unknown';
      dist[region] = (dist[region] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [fslLocations]);

  // Stock by type distribution
  const stockByType = useMemo(() => {
    const typeMap = {};
    filteredStockParts.forEach(part => {
      const partNumber = part.part_number || part['part number'] || '';
      if (partNumber.toLowerCase() === 'region') return;
      
      const type = part.type_of_part || part['type of part'] || 'Other';
      const stock = parseInt(part.grand_total || part['grand total'] || 0);
      typeMap[type] = (typeMap[type] || 0) + stock;
    });
    
    return Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredStockParts]);

  // Top 10 parts by total stock
  const topPartsByStock = useMemo(() => {
    if (!filteredStockParts.length) return [];
    
    return filteredStockParts
      .filter(part => {
        const partNumber = part.part_number || part['part number'] || '';
        return partNumber && partNumber.toLowerCase() !== 'region';
      })
      .map(part => {
        const total = parseInt(part.grand_total || part['grand total'] || 0);
        return {
          name: (part.part_name || part['part name'] || 'Unknown').substring(0, 20),
          partNumber: part.part_number || part['part number'],
          value: total
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredStockParts]);

  // Top 20 usage parts count
  const top20UsageParts = useMemo(() => {
    return filteredStockParts.filter(part => part['20_top_usage']?.toLowerCase() === 'yes').length;
  }, [filteredStockParts]);

  return {
    stockAlerts,
    totalStockQuantity,
    regionDistribution,
    stockByType,
    topPartsByStock,
    top20UsageParts,
    totalFSL: fslLocations.length,
    totalParts: filteredStockParts.length
  };
}

