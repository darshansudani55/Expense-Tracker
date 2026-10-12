import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Wallet,
  X,
  Info
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Wallet size={22} />
          </div>
          <div className="brand-text">
            <h1>SpendWise</h1>
            <span>Expense Tracker</span>
          </div>
          {isOpen && (
            <button
              className="btn-icon"
              style={{ marginLeft: 'auto' }}
              onClick={onClose}
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Receipt size={19} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <PlusCircle size={19} />
            <span>Add Transaction</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-badge">
            <Info size={16} />
            <span>Single-user demo mode</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
