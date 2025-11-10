/**
 * Generic CSV Export Utility
 * Provides consistent export functionality with toast notifications
 * 
 * @module exportUtils
 */

/**
 * Generic export function for any data array
 * @param {Array} data - Array of objects to export
 * @param {string} entityName - Name of the entity (e.g., 'engineers', 'machines', 'stock_parts')
 * @param {string} [fileName] - Optional custom file name suffix (without extension and date)
 * @returns {{success: boolean, fileName?: string, count?: number, error?: string}}
 */
export function exportToCSV(data, entityName, fileName = null) {
  if (!data || data.length === 0) {
    return { success: false, error: 'No data to export' };
  }

  // Collect ALL unique keys from ALL items to ensure no field is missed
  const allKeysSet = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      allKeysSet.add(key);
    });
  });
  
  // Convert to array and sort for consistent column order
  const allKeys = Array.from(allKeysSet).sort();
  
  // Export with original field names (snake_case) to maintain compatibility with CSV import
  const exportData = data.map(item => {
    const row = {};
    allKeys.forEach(key => {
      // Include all fields, even if empty
      row[key] = item[key] !== undefined && item[key] !== null ? String(item[key]) : '';
    });
    return row;
  });

  // Convert to CSV
  const headers = allKeys;
  const csvContent = [
    headers.join(","),
    ...exportData.map(row => headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(","))
  ].join("\n");

  // Generate file name
  const dateStr = new Date().toISOString().split('T')[0];
  let finalFileName;
  if (fileName) {
    // Use custom file name with date
    finalFileName = `${entityName}_${fileName}_${dateStr}.csv`;
  } else {
    // Use default file name
    finalFileName = `${entityName}_${dateStr}.csv`;
  }

  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = finalFileName;
    link.click();
    // Clean up the object URL after a short delay
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
    return { success: true, fileName: finalFileName, count: data.length };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message || 'Failed to export CSV' };
  }
}

