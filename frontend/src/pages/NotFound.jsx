import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="empty-state">
        <div
          className="empty-icon-circle"
          style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)' }}
        >
          <Compass size={40} />
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.5rem 0 0.25rem 0' }}>
          404
        </h2>
        <h4 className="empty-title" style={{ fontSize: '1.25rem' }}>
          Page Not Found
        </h4>
        <p className="empty-desc">
          The page you are looking for doesn't exist or has been moved to another route.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={16} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
