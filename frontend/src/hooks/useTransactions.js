import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../api/transactions';

export const useTransactions = (params) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchTransactionsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransactions(params);
      setTransactions(response.data || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.type,
    params.category,
    params.startDate,
    params.endDate,
    params.month,
    params.sortBy,
    params.sortOrder
  ]);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  return {
    loading,
    error,
    transactions,
    pagination,
    refetch: fetchTransactionsData
  };
};

export default useTransactions;
