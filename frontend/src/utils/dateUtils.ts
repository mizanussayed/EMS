/**
 * Format a date to YYYY-MM-DD format for HTML5 date input
 */
export const formatDateForInput = (date: any): string => {
  if (!date) return '';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // Format as YYYY-MM-DD
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

/**
 * Convert a date string/object to ISO format for API submission
 */
export const formatDateForAPI = (date: any): string | null => {
  if (!date) return null;
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch {
    return null;
  }
};

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export const formatDateForDisplay = (date: any): string => {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};
