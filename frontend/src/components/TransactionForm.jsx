import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Save, X } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';
import { formatInputDate } from '../utils/dates';

const TransactionForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    type: 'Expense',
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    description: '',
    date: formatInputDate(new Date()),
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'Expense',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        category: initialData.category || (initialData.type === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
        description: initialData.description || '',
        date: formatInputDate(initialData.date),
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleTypeChange = (newType) => {
    const defaultCat = newType === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCat
    }));
    // Clear type error if any
    setErrors((prev) => ({ ...prev, type: null, category: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount === '') {
      newErrors.amount = 'Amount is required';
    } else {
      const num = Number(formData.amount);
      if (isNaN(num)) {
        newErrors.amount = 'Amount must be a valid number';
      } else if (num <= 0) {
        newErrors.amount = 'Amount must be greater than zero';
      } else if (num > 1000000000) {
        newErrors.amount = 'Amount cannot exceed 1,000,000,000';
      }
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = 'Notes cannot exceed 1,000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  const currentCategoryOptions =
    formData.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="form-grid" noValidate>
      {/* Type Toggle */}
      <div className="form-group">
        <label className="form-label">Transaction Type</label>
        <div className="type-toggle-group">
          <button
            type="button"
            className={`type-toggle-btn ${formData.type === 'Expense' ? 'active-expense' : ''}`}
            onClick={() => handleTypeChange('Expense')}
          >
            <ArrowDownLeft size={18} />
            Expense
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${formData.type === 'Income' ? 'active-income' : ''}`}
            onClick={() => handleTypeChange('Income')}
          >
            <ArrowUpRight size={18} />
            Income
          </button>
        </div>
      </div>

      {/* Amount & Date Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="tx-amount">
            Amount (₹) <span style={{ color: 'var(--expense-color)' }}>*</span>
          </label>
          <input
            id="tx-amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="e.g. 1500.00"
            className={`form-input ${errors.amount ? 'error' : ''}`}
            value={formData.amount}
            onChange={handleChange}
            required
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tx-date">
            Date <span style={{ color: 'var(--expense-color)' }}>*</span>
          </label>
          <input
            id="tx-date"
            name="date"
            type="date"
            className={`form-input ${errors.date ? 'error' : ''}`}
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label" htmlFor="tx-category">
          Category <span style={{ color: 'var(--expense-color)' }}>*</span>
        </label>
        <select
          id="tx-category"
          name="category"
          className={`form-select ${errors.category ? 'error' : ''}`}
          value={formData.category}
          onChange={handleChange}
          required
        >
          {currentCategoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <span className="form-error">{errors.category}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="tx-description">
          Description <span style={{ color: 'var(--expense-color)' }}>*</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', float: 'right' }}>
            {formData.description.length}/200
          </span>
        </label>
        <input
          id="tx-description"
          name="description"
          type="text"
          maxLength={200}
          placeholder="e.g. Monthly Grocery Restock"
          className={`form-input ${errors.description ? 'error' : ''}`}
          value={formData.description}
          onChange={handleChange}
          required
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label" htmlFor="tx-notes">
          Notes (Optional)
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', float: 'right' }}>
            {formData.notes.length}/1000
          </span>
        </label>
        <textarea
          id="tx-notes"
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder="Additional details, invoice references, or notes..."
          className={`form-textarea ${errors.notes ? 'error' : ''}`}
          value={formData.notes}
          onChange={handleChange}
        />
        {errors.notes && <span className="form-error">{errors.notes}</span>}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X size={16} />
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <Save size={16} />
          {isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' : 'Save Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
