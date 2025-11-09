// Text normalization and formatting utilities

/**
 * Normalize text: lowercase, trim, remove extra spaces
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
};

/**
 * Convert text to Title Case
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  return text.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

/**
 * Normalize area group name (remove numbers, suffixes)
 * This function groups similar area groups together (e.g., "Surabaya 1", "Surabaya 2" -> "Surabaya")
 */
export const normalizeAreaGroup = (areaGroup) => {
  if (!areaGroup) return 'Unknown';
  
  // Normalize: remove trailing numbers, roman numerals, suffixes
  let normalized = areaGroup
    .replace(/\s*-\s*\d+$/i, '')       // Remove "- 1", "- 2", etc. (handle spaces before dash)
    .replace(/\s+\d+$/i, '')           // Remove trailing numbers (e.g., "Surabaya 1" -> "Surabaya")
    .replace(/\s+(I{1,3}|IV|V|VI|VII|VIII|IX|X)$/i, '') // Remove roman numerals
    .replace(/\s+kota$/i, '')          // Remove "Kota"
    .replace(/\s+area$/i, '')          // Remove "Area"
    .replace(/\s*-\s*$/, '')           // Remove trailing dash if any
    .trim();
  
  // Capitalize first letter of each word for consistency
  return normalized.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

/**
 * Parse experience string "X Tahun Y Bulan" to number
 */
export const parseExperience = (expStr) => {
  if (!expStr) return 0;
  const yearMatch = expStr.match(/(\d+)\s*Tahun/);
  const monthMatch = expStr.match(/(\d+)\s*Bulan/);
  const years = yearMatch ? parseInt(yearMatch[1]) : 0;
  const months = monthMatch ? parseInt(monthMatch[1]) : 0;
  return years + (months / 12);
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};