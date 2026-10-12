import React from 'react';

const Loading = ({ message = 'Loading financial data...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
};

export default Loading;
