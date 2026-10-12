import { api } from './apiClient';

/**
 * Fetch dashboard summary for selected month
 * @param {string} month - "YYYY-MM"
 */
export const getDashboardSummary = async (month) => {
  const query = month ? `?month=${encodeURIComponent(month)}` : '';
  return api.get(`/api/dashboard/summary${query}`);
};

/**
 * Fetch monthly income vs expense comparison
 * @param {number} months - Number of months to retrieve (e.g. 6)
 * @param {string} month - Anchor month "YYYY-MM"
 */
export const getMonthlyComparison = async (months = 6, month) => {
  const params = new URLSearchParams({ months: String(months) });
  if (month) params.append('month', month);
  return api.get(`/api/dashboard/monthly?${params.toString()}`);
};

/**
 * Fetch category spending distribution
 * @param {string} month - "YYYY-MM"
 */
export const getCategorySpending = async (month) => {
  const query = month ? `?month=${encodeURIComponent(month)}` : '';
  return api.get(`/api/dashboard/categories${query}`);
};

/**
 * Fetch spending trend over time
 * @param {number} months - Number of months (e.g. 6)
 * @param {string} month - Anchor month "YYYY-MM"
 */
export const getSpendingTrend = async (months = 6, month) => {
  const params = new URLSearchParams({ months: String(months) });
  if (month) params.append('month', month);
  return api.get(`/api/dashboard/trend?${params.toString()}`);
};
