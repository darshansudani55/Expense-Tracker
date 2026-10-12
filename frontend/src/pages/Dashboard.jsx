import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';
import SpendingTrendChart from '../components/SpendingTrendChart';
import TransactionTable from '../components/TransactionTable';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { useDashboard } from '../hooks/useDashboard';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/currency';
import { deleteTransaction } from '../api/transactions';
import { formatMonthDisplay } from '../utils/dates';

const Dashboard = ({ selectedMonth, showToast }) => {
  const {
    loading: dashLoading,
    error: dashError,
    summary,
    monthlyData,
    categoryData,
    trendData,
    refetch: refetchDashboard
  } = useDashboard(selectedMonth);

  const {
    loading: txLoading,
    transactions: recentTransactions,
    refetch: refetchTransactions
  } = useTransactions({
    limit: 5,
    month: selectedMonth,
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [deletingTx, setDeletingTx] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletingTx) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTx._id);
      showToast('Transaction deleted successfully', 'success');
      setDeletingTx(null);
      refetchDashboard();
      refetchTransactions();
    } catch (err) {
      showToast(err.message || 'Failed to delete transaction', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (dashLoading && !summary) {
    return <Loading message="Loading your financial dashboard..." />;
  }

  if (dashError && !summary) {
    return <ErrorMessage message={dashError} onRetry={refetchDashboard} />;
  }

  const selectedMonthStats = summary?.selectedMonth || {
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    savingsRate: null,
    totalTransactions: 0
  };

  const allTimeStats = summary?.allTime || {
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    totalTransactions: 0
  };

  const hasAnyData =
    selectedMonthStats.totalTransactions > 0 || allTimeStats.totalTransactions > 0;

  const savingsRateDisplay =
    selectedMonthStats.savingsRate !== null
      ? `${selectedMonthStats.savingsRate}%`
      : '—';

  return (
    <div>
      {/* Month context subtitle */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Summary for {formatMonthDisplay(selectedMonth)}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            All-Time Cumulative Balance: {formatCurrency(allTimeStats.currentBalance)} ({allTimeStats.totalTransactions} total transactions)
          </span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Income"
          value={formatCurrency(selectedMonthStats.totalIncome)}
          icon={TrendingUp}
          iconType="income"
          subtext={`Selected month income (${formatMonthDisplay(selectedMonth)})`}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(selectedMonthStats.totalExpenses)}
          icon={TrendingDown}
          iconType="expense"
          subtext={`Selected month spending`}
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(selectedMonthStats.currentBalance)}
          icon={Wallet}
          iconType="balance"
          subtext={
            selectedMonthStats.currentBalance >= 0
              ? 'Positive cash flow this month'
              : 'Deficit: expenses exceed income'
          }
        />
        <StatCard
          title="Savings Rate"
          value={savingsRateDisplay}
          icon={PiggyBank}
          iconType="savings"
          subtext={
            selectedMonthStats.totalIncome === 0
              ? 'No income recorded this month'
              : selectedMonthStats.savingsRate < 0
              ? 'Negative rate: spending exceeded income'
              : 'Percentage of income retained'
          }
        />
      </div>

      {!hasAnyData ? (
        <EmptyState
          title="Welcome to SpendWise!"
          description="You don't have any recorded transactions yet. Start by recording your income or an expense."
          actionLabel="Add Your First Transaction"
          actionLink="/add"
        />
      ) : (
        <>
          {/* Charts Row */}
          <div className="charts-grid">
            {/* Income vs Expenses Bar Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Income vs Expenses</h3>
                <p className="chart-card-subtitle">Monthly comparison over the last 6 months</p>
              </div>
              <IncomeExpenseChart data={monthlyData} />
            </div>

            {/* Expense By Category Donut */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Spending by Category</h3>
                <p className="chart-card-subtitle">Distribution of expenses for {formatMonthDisplay(selectedMonth)}</p>
              </div>
              <CategoryPieChart data={categoryData} />
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div className="chart-card" style={{ marginBottom: '2rem' }}>
            <div className="chart-card-header">
              <h3 className="chart-card-title">Monthly Expense Trend</h3>
              <p className="chart-card-subtitle">Spending trajectory across past months</p>
            </div>
            <SpendingTrendChart data={trendData} />
          </div>

          {/* Recent Transactions Table Preview */}
          <div className="card-table">
            <div className="table-header-bar">
              <div>
                <h3 className="table-title">Recent Transactions</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Showing latest transactions for {formatMonthDisplay(selectedMonth)}
                </span>
              </div>
              <Link to="/transactions" className="btn btn-outline btn-sm">
                <span>View All History</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {recentTransactions.length > 0 ? (
              <TransactionTable
                transactions={recentTransactions}
                onDeleteClick={(tx) => setDeletingTx(tx)}
                showActions={true}
              />
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No transactions recorded for {formatMonthDisplay(selectedMonth)}.
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTx)}
        item={deletingTx}
        message="Are you sure you want to permanently delete this transaction? All associated metrics will automatically recalculate."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTx(null)}
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
