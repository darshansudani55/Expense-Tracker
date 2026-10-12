import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No transactions found',
  description = 'You have not added any transactions for the selected period yet.',
  actionLabel = 'Add First Transaction',
  actionLink = '/add'
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-circle">
        <Icon size={28} />
      </div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-desc">{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          <Plus size={16} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
