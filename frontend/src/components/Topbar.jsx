import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus, Calendar } from 'lucide-react';
import { getMonthOptions } from '../utils/dates';

const Topbar = ({ onToggleSidebar, selectedMonth, onMonthChange }) => {
  const location = useLocation();
  const monthOptions = getMonthOptions(12);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Financial Dashboard';
      case '/transactions':
        return 'All Transactions';
      case '/add':
        return 'Add Transaction';
      default:
        if (location.pathname.startsWith('/edit/')) return 'Edit Transaction';
        return 'SpendWise';
    }
  };

  const isDashboard = location.pathname === '/';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>

      <div className="topbar-right">
        {/* Month Selector on Dashboard */}
        {isDashboard && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--text-muted)" />
            <select
              className="filter-select"
              style={{ width: 'auto', minWidth: '150px' }}
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              aria-label="Select Dashboard Month"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <Link to="/add" className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>New Transaction</span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
