import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { ALL_CATEGORIES } from '../utils/categories';
import { getMonthOptions } from '../utils/dates';

const TransactionFilters = ({ filters, onFilterChange, onReset }) => {
  const monthOptions = getMonthOptions(12);

  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
      page: 1 // Reset to page 1 on filter modification
    });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    let sortBy = 'date';
    let sortOrder = 'desc';

    if (val === 'oldest') {
      sortBy = 'date';
      sortOrder = 'asc';
    } else if (val === 'amount-desc') {
      sortBy = 'amount';
      sortOrder = 'desc';
    } else if (val === 'amount-asc') {
      sortBy = 'amount';
      sortOrder = 'asc';
    } else {
      sortBy = 'date';
      sortOrder = 'desc';
    }

    onFilterChange({
      ...filters,
      sortBy,
      sortOrder,
      page: 1
    });
  };

  const getSortSelectValue = () => {
    if (filters.sortBy === 'amount' && filters.sortOrder === 'desc') return 'amount-desc';
    if (filters.sortBy === 'amount' && filters.sortOrder === 'asc') return 'amount-asc';
    if (filters.sortBy === 'date' && filters.sortOrder === 'asc') return 'oldest';
    return 'newest';
  };

  return (
    <div className="filter-card">
      <div className="filters-grid">
        {/* Search */}
        <div className="filter-group" style={{ gridColumn: 'span 2' }}>
          <label className="filter-label" htmlFor="filter-search">
            Search Description
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="filter-search"
              type="text"
              placeholder="Search by keywords..."
              className="filter-input"
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-type">
            Type
          </label>
          <select
            id="filter-type"
            className="filter-select"
            value={filters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            className="filter-select"
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-month">
            Month
          </label>
          <select
            id="filter-month"
            className="filter-select"
            value={filters.month || ''}
            onChange={(e) => {
              // Clearing custom date range when choosing quick month
              onFilterChange({
                ...filters,
                month: e.target.value,
                startDate: '',
                endDate: '',
                page: 1
              });
            }}
          >
            <option value="">All Months</option>
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-sort">
            Sort Order
          </label>
          <select
            id="filter-sort"
            className="filter-select"
            value={getSortSelectValue()}
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-start-date">
            Start Date
          </label>
          <input
            id="filter-start-date"
            type="date"
            className="filter-input"
            value={filters.startDate || ''}
            onChange={(e) => {
              onFilterChange({
                ...filters,
                startDate: e.target.value,
                month: '', // clear month when manual dates picked
                page: 1
              });
            }}
          />
        </div>

        {/* End Date */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="filter-end-date">
            End Date
          </label>
          <input
            id="filter-end-date"
            type="date"
            className="filter-input"
            value={filters.endDate || ''}
            onChange={(e) => {
              onFilterChange({
                ...filters,
                endDate: e.target.value,
                month: '',
                page: 1
              });
            }}
          />
        </div>

        {/* Reset button */}
        <div className="filter-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            style={{ width: '100%', height: '39px' }}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
