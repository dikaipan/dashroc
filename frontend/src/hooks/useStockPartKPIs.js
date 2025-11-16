/**
 * Custom hook for stock part KPI calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';

// Helper function to safely parse number from string or number
const safeParseInt = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return Math.floor(value);
  const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : Math.floor(parsed);
};

// Helper function to calculate grand_total from FSL columns
// Always calculate from FSL columns for accuracy, as grand_total in data might not be updated
const calculateGrandTotal = (part) => {
  // Get all FSL columns (idfsl and idccw)
  const fslColumns = Object.keys(part).filter(col => 
    col.toLowerCase().includes('idfsl') || col.toLowerCase().includes('idccw')
  );
  
  // Calculate total from all FSL columns
  const calculatedTotal = fslColumns.reduce((sum, col) => {
    return sum + safeParseInt(part[col]);
  }, 0);
  
  // Return calculated total (always use calculated value for accuracy)
  return calculatedTotal;
};

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
      
      // Check stock at each FSL location - Use safeParseInt for consistency
      fslColumns.forEach(fslCol => {
        const stock = safeParseInt(part[fslCol]);
        
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

  // Total stock across all parts - Use validParts (all parts, not filtered) to show actual total
  // Always calculate from FSL columns for accuracy
  const totalStockQuantity = useMemo(() => {
    return validParts.reduce((sum, part) => {
      const partNumber = part.part_number || part['part number'] || '';
      if (partNumber.toLowerCase() === 'region') return sum;
      
      // Calculate from FSL columns for accuracy
      const calculatedTotal = calculateGrandTotal(part);
      return sum + calculatedTotal;
    }, 0);
  }, [validParts]);

  // Region distribution
  const regionDistribution = useMemo(() => {
    const dist = {};
    fslLocations.forEach(fsl => {
      const region = fsl.region || fsl['region '] || 'Unknown';
      dist[region] = (dist[region] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [fslLocations]);

  // Stock by type distribution - Use calculated grand_total
  const stockByType = useMemo(() => {
    const typeMap = {};
    filteredStockParts.forEach(part => {
      const partNumber = part.part_number || part['part number'] || '';
      if (partNumber.toLowerCase() === 'region') return;
      
      const type = part.type_of_part || part['type of part'] || 'Other';
      const stock = calculateGrandTotal(part);
      typeMap[type] = (typeMap[type] || 0) + stock;
    });
    
    return Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredStockParts]);

  // Top 10 parts by total stock - Use calculated grand_total
  const topPartsByStock = useMemo(() => {
    if (!filteredStockParts.length) return [];
    
    return filteredStockParts
      .filter(part => {
        const partNumber = part.part_number || part['part number'] || '';
        return partNumber && partNumber.toLowerCase() !== 'region';
      })
      .map(part => {
        const total = calculateGrandTotal(part);
        return {
          name: (part.part_name || part['part name'] || 'Unknown').substring(0, 20),
          partNumber: part.part_number || part['part number'],
          value: total
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredStockParts]);


  // Stock Health Statistics - Based on Stock Alerts logic (per FSL, not per part grand_total)
  // Count parts that have at least one alert at any FSL location
  // This makes it consistent with Stock Alerts display
  const stockHealth = useMemo(() => {
    let healthyCount = 0;      // Parts with all FSL stock > 10
    let criticalCount = 0;     // Parts with at least one FSL having stock = 0
    let urgentCount = 0;      // Parts with at least one FSL having stock 1-5 (but no critical)
    let warningCount = 0;     // Parts with at least one FSL having stock 6-10 (but no critical/urgent)
    let adequateCount = 0;     // Parts with all FSL stock 11-100
    let overstockCount = 0;    // Parts with at least one FSL having stock > 100
    
    const partsWithAlerts = new Set(); // Track parts that have any alert
    let validPartsCount = 0; // Count only valid parts (exclude Region row)
    
    // Count unique parts based on their worst FSL stock condition
    validParts.forEach(part => {
      const partNumber = part.part_number || part['part number'] || '';
      if (partNumber.toLowerCase() === 'region') return;
      
      validPartsCount++;
      
      // Get all FSL columns
      const fslColumns = Object.keys(part).filter(col => 
        col.toLowerCase().includes('idfsl') || col.toLowerCase().includes('idccw')
      );
      
      // If no FSL columns, consider as critical
      if (fslColumns.length === 0) {
        criticalCount++;
        partsWithAlerts.add(partNumber);
        return; // Skip to next part
      }
      
      // Find the worst stock condition across all FSL locations for this part
      let hasCritical = false;  // At least one FSL with stock = 0
      let hasUrgent = false;     // At least one FSL with stock 1-5
      let hasWarning = false;   // At least one FSL with stock 6-10
      let hasOverstock = false; // At least one FSL with stock > 100
      let allHealthy = true;    // All FSL have stock > 10
      let minStock = Infinity;
      let maxStock = 0;
      
      fslColumns.forEach(fslCol => {
        const stock = safeParseInt(part[fslCol]);
        if (minStock === Infinity) {
          minStock = stock;
          maxStock = stock;
        } else {
          minStock = Math.min(minStock, stock);
          maxStock = Math.max(maxStock, stock);
        }
        
        if (stock === 0) {
          hasCritical = true;
          allHealthy = false;
        } else if (stock >= 1 && stock <= 5) {
          hasUrgent = true;
          allHealthy = false;
        } else if (stock >= 6 && stock <= 10) {
          hasWarning = true;
          allHealthy = false;
        } else if (stock > 100) {
          hasOverstock = true;
        } else if (stock <= 10) {
          allHealthy = false;
        }
      });
      
      // Categorize part based on worst condition
      if (hasCritical) {
        criticalCount++;
        partsWithAlerts.add(partNumber);
      } else if (hasUrgent) {
        urgentCount++;
        partsWithAlerts.add(partNumber);
      } else if (hasWarning) {
        warningCount++;
        partsWithAlerts.add(partNumber);
      } else if (allHealthy && maxStock <= 100) {
        adequateCount++;
        healthyCount++;
      } else if (hasOverstock) {
        overstockCount++;
        healthyCount++; // Overstock is still considered "healthy" in terms of availability
      } else if (allHealthy) {
        healthyCount++;
      }
    });
    
    // Calculate percentages based on valid parts count
    const partsWithLowStock = criticalCount + urgentCount + warningCount;
    
    return {
      healthyCount,
      criticalCount,
      urgentCount,
      warningCount,
      lowStockCount: partsWithLowStock, // Total parts with low stock (critical + urgent + warning)
      adequateCount,
      overstockCount,
      partsWithAlertsCount: partsWithAlerts.size,
      totalPartsCount: validPartsCount,
      healthyPercentage: validPartsCount > 0 ? Math.round((healthyCount / validPartsCount) * 100) : 0,
      lowStockPercentage: validPartsCount > 0 ? Math.round((partsWithLowStock / validPartsCount) * 100) : 0,
      criticalPercentage: validPartsCount > 0 ? Math.round((criticalCount / validPartsCount) * 100) : 0
    };
  }, [validParts]);

  // Calculate stock utilization metrics - Use validParts for actual metrics
  const stockUtilization = useMemo(() => {
    if (totalStockQuantity === 0 || validParts.length === 0) {
      return {
        avgStockPerPart: 0,
        medianStockPerPart: 0,
        stockConcentration: 0, // Percentage of stock in top 20% of parts
        stockDistribution: 'balanced'
      };
    }
    
    // Calculate average based on valid parts
    const avgStockPerPart = Math.round(totalStockQuantity / validParts.length);
    
    // Calculate median using grand_total from data or calculated
    const stockValues = validParts
      .map(part => calculateGrandTotal(part))
      .filter(val => val > 0)
      .sort((a, b) => a - b);
    
    const medianStockPerPart = stockValues.length > 0
      ? stockValues.length % 2 === 0
        ? Math.round((stockValues[stockValues.length / 2 - 1] + stockValues[stockValues.length / 2]) / 2)
        : stockValues[Math.floor(stockValues.length / 2)]
      : 0;
    
    // Calculate stock concentration (Pareto analysis) using grand_total
    const sortedParts = validParts
      .map(part => calculateGrandTotal(part))
      .sort((a, b) => b - a);
    
    const top20PercentCount = Math.max(1, Math.ceil(sortedParts.length * 0.2));
    const top20PercentStock = sortedParts.slice(0, top20PercentCount).reduce((sum, val) => sum + val, 0);
    const stockConcentration = totalStockQuantity > 0 
      ? Math.round((top20PercentStock / totalStockQuantity) * 100)
      : 0;
    
    // Determine distribution type
    let stockDistribution = 'balanced';
    if (stockConcentration > 80) {
      stockDistribution = 'highly_concentrated';
    } else if (stockConcentration > 60) {
      stockDistribution = 'concentrated';
    } else if (stockConcentration < 30) {
      stockDistribution = 'distributed';
    }
    
    return {
      avgStockPerPart,
      medianStockPerPart,
      stockConcentration,
      stockDistribution
    };
  }, [totalStockQuantity, validParts]);

  // Calculate total parts (exclude Region row) - Use validParts for actual total
  const totalParts = useMemo(() => {
    return validParts.length;
  }, [validParts]);

  // Calculate top 20 usage parts (exclude Region row)
  const top20UsageParts = useMemo(() => {
    return filteredStockParts.filter(part => {
      const partNumber = part.part_number || part['part number'] || '';
      if (partNumber.toLowerCase() === 'region') return false;
      return part['20_top_usage']?.toLowerCase() === 'yes';
    }).length;
  }, [filteredStockParts]);

  return {
    stockAlerts,
    totalStockQuantity,
    regionDistribution,
    stockByType,
    topPartsByStock,
    top20UsageParts,
    stockHealth,
    stockUtilization,
    totalFSL: fslLocations.length,
    totalParts
  };
}

