import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Deletion',
  message,
  item = null,
  onConfirm,
  onCancel,
  isProcessing = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--expense-bg)',
                color: 'var(--expense-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 className="modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onCancel}
            disabled={isProcessing}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: item ? '1rem' : 0 }}>
            {message || 'Are you sure you want to delete this record? This action cannot be undone.'}
          </p>

          {item && (
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {item.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                <span>{item.category} ({item.type})</span>
                <span style={{ fontWeight: 600, color: item.type === 'Income' ? 'var(--income-color)' : 'var(--expense-color)' }}>
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            <Trash2 size={16} />
            {isProcessing ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
