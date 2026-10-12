import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import TransactionFilters from '../components/TransactionFilters';
import TransactionTable from '../components/TransactionTable';
import TransactionCard from '../components/TransactionCard';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { useTransactions } from '../hooks/useTransactions';
import { deleteTransaction } from '../api/transactions';

const Transactions = ({ showToast }) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    month: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const {
    loading,
    error,
    transactions,
    pagination,
    refetch
  } = useTransactions(filters);

  const [deletingTx, setDeletingTx] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      month: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTx) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTx._id);
      showToast('Transaction deleted successfully', 'success');
      setDeletingTx(null);
      refetch();
    } catch (err) {
      showToast(err.message || 'Failed to delete transaction', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered = Boolean(
    filters.search ||
    filters.type ||
    filters.category ||
    filters.startDate ||
    filters.endDate ||
    filters.month
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Transaction History
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Search, filter, and audit all recorded financial activities
          </span>
        </div>
        <Link to="/add" className="btn btn-primary">
          <Plus size={16} />
          <span>Add Transaction</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <TransactionFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Transactions Container */}
      <div className="card-table">
        <div className="table-header-bar">
          <div>
            <h3 className="table-title">Records</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {transactions.length} of {pagination.total} transactions
            </span>
          </div>
        </div>

        {loading ? (
          <Loading message="Filtering and fetching transactions..." />
        ) : transactions.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="desktop-table-container">
              <TransactionTable
                transactions={transactions}
                onDeleteClick={(tx) => setDeletingTx(tx)}
                showActions={true}
              />
            </div>

            {/* Mobile Cards View */}
            <div className="mobile-cards-list">
              {transactions.map((tx) => (
                <TransactionCard
                  key={tx._id}
                  tx={tx}
                  onDeleteClick={(tx) => setDeletingTx(tx)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-bar">
                <div className="pagination-info">
                  Page <strong>{pagination.page}</strong> of{' '}
                  <strong>{pagination.totalPages}</strong> (
                  {pagination.total} total items)
                </div>
                <div className="pagination-controls">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '2rem 1rem' }}>
            <EmptyState
              icon={Receipt}
              title={isFiltered ? 'No matching transactions' : 'No transactions recorded yet'}
              description={
                isFiltered
                  ? 'No records match your selected filter criteria. Try clearing some filters or searching for different keywords.'
                  : 'Start tracking your spending by creating your first transaction.'
              }
              actionLabel={isFiltered ? 'Reset Filters' : 'Add Transaction'}
              actionLink={isFiltered ? null : '/add'}
            />
            {isFiltered && (
              <div style={{ textAlign: 'center', marginTop: '-1rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleResetFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingTx)}
        item={deletingTx}
        message="Are you sure you want to permanently delete this transaction? This cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTx(null)}
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default Transactions;
