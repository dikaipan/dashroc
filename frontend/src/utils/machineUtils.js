/**
 * Utility functions for machine data processing
 * Separates data processing logic from components
 */

/**
 * Export machines to CSV
 * @param {Array} machines - Array of machine objects
 * @returns {void}
 */
export function exportMachinesToCSV(machines) {
  if (!machines || machines.length === 0) {
    alert('No data to export');
    return;
  }

  // Collect ALL unique keys from ALL machines to ensure no field is missed
  // Some machines might have different fields, so we need to check all of them
  const allKeysSet = new Set();
  machines.forEach(m => {
    Object.keys(m).forEach(key => {
      allKeysSet.add(key);
    });
  });
  
  // Convert to array and sort for consistent column order
  const allKeys = Array.from(allKeysSet).sort();
  
  // Export with original field names (snake_case) to maintain compatibility with CSV import
  // Backend normalizes CSV columns to snake_case, so we use the same format for export
  const exportData = machines.map(m => {
    const row = {};
    allKeys.forEach(key => {
      // Use original field name to maintain compatibility with CSV import
      // Include all fields, even if empty
      row[key] = m[key] !== undefined && m[key] !== null ? String(m[key]) : '';
    });
    return row;
  });
  
  const headers = allKeys;
  const csvContent = [
    headers.join(","),
    ...exportData.map(row => headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(","))
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `machines_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

