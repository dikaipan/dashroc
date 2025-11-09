// CSV import/export utilities

/**
 * Export data to CSV file
 */
export const exportToCSV = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const csvHeaders = headers || Object.keys(data[0]);
  const csvContent = [
    csvHeaders.join(","),
    ...data.map(row => 
      csvHeaders.map(header => `"${row[header] || ""}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Parse CSV file content
 */
export const parseCSV = async (file, fieldMapping = {}) => {
  if (!file || !file.name.endsWith('.csv')) {
    throw new Error('Please upload a CSV file');
  }

  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or invalid');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const parsedData = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    
    headers.forEach((header, index) => {
      // Use field mapping if provided
      const mappedField = fieldMapping[header] || header;
      row[mappedField] = values[index];
    });

    parsedData.push(row);
  }

  return parsedData;
};

/**
 * Validate CSV data against required fields
 */
export const validateCSVData = (data, requiredFields = []) => {
  const validData = data.filter(row => {
    return requiredFields.every(field => row[field]);
  });

  return {
    valid: validData,
    invalid: data.length - validData.length,
    total: data.length,
  };
};