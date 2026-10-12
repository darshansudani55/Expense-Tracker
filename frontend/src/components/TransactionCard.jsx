import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatDisplayDate } from '../utils/dates';
import { formatCurrency } from '../utils/currency';
import { getCategoryColor } from '../utils/categories';

const TransactionCard = ({ tx, onDeleteClick }) => {
  const isIncome = tx.type === 'Income';
  const catColor = getCategoryColor(tx.category);

  return (
    <div className="tx-mobile-card">
      <div className="tx-mobile-header">
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
            {tx.description}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {formatDisplayDate(tx.date)}
          </div>
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            whiteSpace: 'nowrap'
          }}
          className={isIncome ? 'amount-income' : 'amount-expense'}
        >
          {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span
          className="badge badge-category"
          style={{ borderLeft: `3px solid ${catColor}` }}
        >
          {tx.category}
        </span>
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {isIncome ? (
            <>
              <ArrowUpRight size={12} /> Income
            </>
          ) : (
            <>
              <ArrowDownLeft size={12} /> Expense
            </>
          )}
        </span>
      </div>

      {tx.notes && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {tx.notes}
        </div>
      )}

      <div className="tx-mobile-footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
          ID: ...{tx._id.slice(-6)}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/edit/${tx._id}`} className="btn-icon" aria-label="Edit">
            <Edit2 size={14} />
          </Link>
          <button
            type="button"
            className="btn-icon btn-icon-danger"
            onClick={() => onDeleteClick(tx)}
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
