import React from 'react';

const StatCard = ({ title, value, icon: Icon, iconType, subtext }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
        <div className={`stat-card-icon ${iconType}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {subtext && <div className="stat-card-subtext">{subtext}</div>}
    </div>
  );
};

export default StatCard;
