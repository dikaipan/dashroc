/**
 * Utility functions for engineer data processing
 * Separates data processing logic from components
 */

/**
 * Export engineers to CSV
 * @param {Array} engineers - Array of engineer objects
 * @returns {void}
 */
export function exportEngineersToCSV(engineers) {
  if (!engineers || engineers.length === 0) {
    alert('No data to export');
    return;
  }

  // Collect ALL unique keys from ALL engineers to ensure no field is missed
  // Some engineers might have different fields, so we need to check all of them
  const allKeysSet = new Set();
  engineers.forEach(eng => {
    Object.keys(eng).forEach(key => {
      allKeysSet.add(key);
    });
  });
  
  // Convert to array and sort for consistent column order
  const allKeys = Array.from(allKeysSet).sort();
  
  // Export with original field names (snake_case) to maintain compatibility with CSV import
  // Backend normalizes CSV columns to snake_case, so we use the same format for export
  const exportData = engineers.map(eng => {
    const row = {};
    allKeys.forEach(key => {
      // Use original field name to maintain compatibility with CSV import
      // Include all fields, even if empty
      row[key] = eng[key] !== undefined && eng[key] !== null ? String(eng[key]) : '';
    });
    return row;
  });

  // Convert to CSV (simple implementation)
  const headers = allKeys;
  const csvContent = [
    headers.join(","),
    ...exportData.map(row => headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(","))
  ].join("\n");

  // Download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `engineers_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse CSV and extract engineer data
 * @param {string} csvText - CSV text content
 * @returns {Array} Array of engineer objects
 */
export function parseEngineersCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const engineers = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const engineer = {};
    
    headers.forEach((header, index) => {
      if (header === 'id' || header === 'engineer_id') {
        engineer.id = values[index];
      } else if (header === 'name' || header === 'engineer_name') {
        engineer.name = values[index];
      } else if (header === 'region') {
        engineer.region = values[index];
      } else if (header === 'area_group' || header === 'area group') {
        engineer.area_group = values[index];
      } else if (header === 'vendor') {
        engineer.vendor = values[index];
      } else if (header === 'years_experience' || header === 'experience' || header === 'years experience') {
        engineer.years_experience = values[index];
      } else if (header === 'technical_skills_training' || header === 'technical skills' || header === 'technical_skills') {
        engineer.technical_skills_training = values[index];
      } else if (header === 'soft_skills_training' || header === 'soft skills' || header === 'soft_skills') {
        engineer.soft_skills_training = values[index];
      }
    });

    if (engineer.id && engineer.name) {
      engineers.push(engineer);
    }
  }

  return engineers;
}

