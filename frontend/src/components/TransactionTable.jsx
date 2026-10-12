import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatDisplayDate } from '../utils/dates';
import { formatCurrency } from '../utils/currency';
import { getCategoryColor } from '../utils/categories';

const TransactionTable = ({
  transactions,
  onDeleteClick,
  showActions = true
}) => {
  if (!transactions || transactions.length === 0) {
    return null;
  }

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            {showActions && <th style={{ textAlign: 'center' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isIncome = tx.type === 'Income';
            const catColor = getCategoryColor(tx.category);

            return (
              <tr key={tx._id}>
                <td style={{ whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                  {formatDisplayDate(tx.date)}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {tx.description}
                  </div>
                  {tx.notes && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        marginTop: '2px',
                        maxWidth: '280px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={tx.notes}
                    >
                      {tx.notes}
                    </div>
                  )}
                </td>
                <td>
                  <span
                    className="badge badge-category"
                    style={{
                      borderLeft: `3px solid ${catColor}`
                    }}
                  >
                    {tx.category}
                  </span>
                </td>
                <td>
                  <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                    {isIncome ? (
                      <>
                        <ArrowUpRight size={13} /> Income
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft size={13} /> Expense
                      </>
                    )}
                  </span>
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}
                  className={isIncome ? 'amount-income' : 'amount-expense'}
                >
                  {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                </td>
                {showActions && (
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                      <Link
                        to={`/edit/${tx._id}`}
                        className="btn-icon"
                        title="Edit Transaction"
                        aria-label={`Edit ${tx.description}`}
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        title="Delete Transaction"
                        onClick={() => onDeleteClick(tx)}
                        aria-label={`Delete ${tx.description}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
