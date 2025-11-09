/**
 * Dashboard utility functions
 * Pure functions for data processing in dashboard
 */

/**
 * parseInstallYear - Extract tahun instalasi dari machine data
 * 
 * Fungsi pure untuk parsing tahun dari 2 possible sources:
 * 1. instal_date string (format: "DD-MM-YYYY" atau "DD-MM-YY")
 * 2. year field (number atau string)
 * 
 * @param {Object} machine - Machine object
 * @returns {string|null} Year sebagai string ("2021") atau null
 */
export const parseInstallYear = (machine) => {
  let installYear;
  
  // Try parse dari instal_date
  if (machine.instal_date) {
    const dateStr = machine.instal_date;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      const yearPart = parts[parts.length - 1];
      // Convert 2-digit year ke 4-digit
      installYear = yearPart.length === 2 ? '20' + yearPart : yearPart;
    }
  } 
  // Fallback ke field year
  else if (machine.year) {
    installYear = machine.year.toString();
  }
  
  return installYear || null;
};

/**
 * calculateMachineAge - Hitung usia mesin dalam tahun
 * 
 * @param {Object} machine - Machine object
 * @param {number} currentYear - Tahun sekarang
 * @returns {number|null} Age dalam tahun atau null jika tidak bisa dihitung
 */
export const calculateMachineAge = (machine, currentYear) => {
  const installYearStr = parseInstallYear(machine);
  
  if (!installYearStr) return null;
  
  const installYear = parseInt(installYearStr);
  
  if (isNaN(installYear)) return null;
  
  return currentYear - installYear;
};

/**
 * categorizeByRange - Kategorikan nilai numerik ke dalam rentang/bucket
 * 
 * @param {number} value - Nilai yang akan dikategorikan
 * @param {Array} ranges - Array of {max: number, label: string}
 * @param {string} defaultLabel - Label untuk nilai di luar semua range
 * @returns {string} Category label
 * 
 * @example
 * categorizeByRange(3, [
 *   {max: 2, label: '0-2 years'},
 *   {max: 5, label: '3-5 years'}
 * ], '5+ years')
 * // Returns: "3-5 years"
 */
export const categorizeByRange = (value, ranges, defaultLabel) => {
  for (const range of ranges) {
    if (value <= range.max) {
      return range.label;
    }
  }
  return defaultLabel;
};

/**
 * groupByField - Aggregate data by field name
 * 
 * Generic aggregation function yang menghitung count per unique value
 * dari field tertentu.
 * 
 * @param {Array} data - Array of objects
 * @param {string} fieldName - Field name untuk grouping
 * @param {string} defaultValue - Default value jika field null/undefined
 * @returns {Object} Object dengan key=field value, value=count
 * 
 * @example
 * groupByField([{region: 'A'}, {region: 'B'}, {region: 'A'}], 'region', 'Unknown')
 * // Returns: {A: 2, B: 1}
 */
export const groupByField = (data, fieldName, defaultValue = 'Unknown') => {
  const counts = {};
  
  data.forEach(item => {
    const value = item[fieldName] || defaultValue;
    counts[value] = (counts[value] || 0) + 1;
  });
  
  return counts;
};

/**
 * objectToChartData - Convert object ke array format untuk recharts
 * 
 * @param {Object} dataObject - Object dengan key-value pairs
 * @param {string} keyName - Nama property untuk key (default: 'name')
 * @param {string} valueName - Nama property untuk value (default: 'value')
 * @returns {Array} Array of objects untuk recharts
 * 
 * @example
 * objectToChartData({A: 10, B: 20}, 'category', 'count')
 * // Returns: [{category: 'A', count: 10}, {category: 'B', count: 20}]
 */
export const objectToChartData = (dataObject, keyName = 'name', valueName = 'value') => {
  return Object.entries(dataObject).map(([key, value]) => ({
    [keyName]: key,
    [valueName]: value
  }));
};

/**
 * groupByNormalizedAreaGroup - Aggregate data by normalized area group
 * 
 * Groups similar area groups together (e.g., "Surabaya 1", "Surabaya 2" -> "Surabaya")
 * 
 * @param {Array} data - Array of objects
 * @param {string} fieldName - Field name untuk grouping (default: 'area_group')
 * @param {Function} normalizeFn - Normalization function (default: normalizeAreaGroup from textUtils)
 * @returns {Object} Object dengan key=normalized area group, value=count
 * 
 * @example
 * groupByNormalizedAreaGroup([
 *   {area_group: 'Surabaya 1'}, 
 *   {area_group: 'Surabaya 2'}, 
 *   {area_group: 'Jakarta Pusat'}
 * ])
 * // Returns: {'Surabaya': 2, 'Jakarta Pusat': 1}
 */
export const groupByNormalizedAreaGroup = (data, fieldName = 'area_group', normalizeFn) => {
  // Import normalizeAreaGroup dynamically to avoid circular dependency
  if (!normalizeFn) {
    const { normalizeAreaGroup } = require('./textUtils');
    normalizeFn = normalizeAreaGroup;
  }
  
  const counts = {};
  
  data.forEach(item => {
    const originalValue = item[fieldName] || 'Unknown';
    const normalizedValue = normalizeFn(originalValue);
    counts[normalizedValue] = (counts[normalizedValue] || 0) + 1;
  });
  
  return counts;
};

