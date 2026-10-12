import { api } from './apiClient';

/**
 * Fetch paginated & filtered transactions
 * @param {Object} params - search, type, category, startDate, endDate, month, sortBy, sortOrder, page, limit
 */
export const getTransactions = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  const endpoint = `/api/transactions${queryString ? `?${queryString}` : ''}`;
  return api.get(endpoint);
};

/**
 * Fetch a single transaction by ID
 */
export const getTransactionById = async (id) => {
  return api.get(`/api/transactions/${id}`);
};

/**
 * Create a new transaction
 */
export const createTransaction = async (data) => {
  return api.post('/api/transactions', data);
};

/**
 * Update an existing transaction by ID
 */
export const updateTransaction = async (id, data) => {
  return api.put(`/api/transactions/${id}`, data);
};

/**
 * Delete a transaction by ID
 */
export const deleteTransaction = async (id) => {
  return api.delete(`/api/transactions/${id}`);
};
