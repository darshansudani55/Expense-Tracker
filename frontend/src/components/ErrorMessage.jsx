import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <AlertCircle size={20} />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onRetry}
          style={{ borderColor: 'currentColor', color: 'inherit' }}
        >
          <RotateCcw size={14} />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
