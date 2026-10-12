import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardSummary,
  getMonthlyComparison,
  getCategorySpending,
  getSpendingTrend
} from '../api/dashboard';

export const useDashboard = (selectedMonth) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, monthRes, catRes, trendRes] = await Promise.all([
        getDashboardSummary(selectedMonth),
        getMonthlyComparison(6, selectedMonth),
        getCategorySpending(selectedMonth),
        getSpendingTrend(6, selectedMonth)
      ]);

      setSummary(sumRes.data);
      setMonthlyData(monthRes.data || []);
      setCategoryData(catRes.data ? catRes.data.categories : []);
      setTrendData(trendRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    summary,
    monthlyData,
    categoryData,
    trendData,
    refetch: fetchDashboardData
  };
};

export default useDashboard;
