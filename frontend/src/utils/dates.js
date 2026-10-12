/**
 * Date Utilities for SpendWise
 */

/**
 * Format ISO date string into readable user-friendly date (e.g. 12 Oct 2026)
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

/**
 * Format Date or ISO string to "YYYY-MM-DD" for HTML input[type="date"]
 */
export const formatInputDate = (dateVal) => {
  if (!dateVal) return new Date().toISOString().split('T')[0];
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get current month string in "YYYY-MM" format
 */
export const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Format "YYYY-MM" into "MMMM YYYY" (e.g. "October 2026")
 */
export const formatMonthDisplay = (monthStr) => {
  if (!monthStr || !/^\d{4}-\d{2}$/.test(monthStr)) {
    return 'All Time';
  }
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Generate a list of recent month options for select dropdowns
 * Returns array of { value: 'YYYY-MM', label: 'Month Year' }
 */
export const getMonthOptions = (count = 12) => {
  const options = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  for (let i = 0; i < count; i++) {
    let m = currentMonth - i;
    let y = currentYear;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    const val = `${y}-${String(m + 1).padStart(2, '0')}`;
    const date = new Date(y, m, 1);
    const label = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    options.push({ value: val, label });
  }

  return options;
};
