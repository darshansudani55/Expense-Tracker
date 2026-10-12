import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getTransactionById, updateTransaction } from '../api/transactions';

const EditTransaction = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadTx = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTransactionById(id);
        if (isMounted) {
          setTransaction(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Transaction could not be found or was deleted.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadTx();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateTransaction(id, formData);
      showToast('Transaction updated successfully!', 'success');
      navigate('/transactions');
    } catch (err) {
      const msg = err.details ? err.details.join(', ') : err.message || 'Failed to update transaction';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Retrieving transaction details..." />;
  }

  if (error && !transaction) {
    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto', textAlign: 'center' }}>
        <div className="empty-state">
          <div
            className="empty-icon-circle"
            style={{ backgroundColor: 'var(--expense-bg)', color: 'var(--expense-color)' }}
          >
            <AlertCircle size={28} />
          </div>
          <h4 className="empty-title">Transaction Not Found</h4>
          <p className="empty-desc">{error}</p>
          <Link to="/transactions" className="btn btn-primary btn-sm">
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          className="btn-icon"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Edit Transaction
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Update the amount, category, or information for this record
          </span>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <TransactionForm
          initialData={transaction}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditTransaction;
