const mongoose = require('mongoose');

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Other Income'
];

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Education',
  'Healthcare',
  'Entertainment',
  'Housing',
  'Travel',
  'Other Expense'
];

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
};

const validateTransactionInput = (data, isUpdate = false) => {
  const errors = [];
  const sanitized = {};

  // Check required fields when creating
  if (!isUpdate) {
    if (!data.type) errors.push('Transaction type is required (Income or Expense)');
    if (data.amount === undefined || data.amount === null || data.amount === '') errors.push('Amount is required');
    if (!data.category) errors.push('Category is required');
    if (!data.description || typeof data.description !== 'string' || !data.description.trim()) errors.push('Description is required');
    if (!data.date) errors.push('Date is required');
  }

  // Type validation
  if (data.type !== undefined) {
    if (!['Income', 'Expense'].includes(data.type)) {
      errors.push('Transaction type must be either "Income" or "Expense"');
    } else {
      sanitized.type = data.type;
    }
  }

  // Amount validation
  if (data.amount !== undefined) {
    const numAmount = Number(data.amount);
    if (isNaN(numAmount) || !isFinite(numAmount)) {
      errors.push('Amount must be a valid number');
    } else if (numAmount <= 0) {
      errors.push('Amount must be greater than zero');
    } else if (numAmount > 1000000000) {
      errors.push('Amount cannot exceed 1,000,000,000');
    } else {
      // Store rounded to two decimal places
      sanitized.amount = Math.round(numAmount * 100) / 100;
    }
  }

  // Category validation
  if (data.category !== undefined) {
    const effectiveType = sanitized.type || data.type;
    if (effectiveType === 'Income' && !INCOME_CATEGORIES.includes(data.category)) {
      errors.push(`Invalid income category. Allowed: ${INCOME_CATEGORIES.join(', ')}`);
    } else if (effectiveType === 'Expense' && !EXPENSE_CATEGORIES.includes(data.category)) {
      errors.push(`Invalid expense category. Allowed: ${EXPENSE_CATEGORIES.join(', ')}`);
    } else if (!effectiveType && !ALL_CATEGORIES.includes(data.category)) {
      errors.push(`Invalid category. Allowed: ${ALL_CATEGORIES.join(', ')}`);
    } else {
      sanitized.category = data.category;
    }
  }

  // Description validation
  if (data.description !== undefined) {
    if (typeof data.description !== 'string' || !data.description.trim()) {
      errors.push('Description cannot be empty');
    } else if (data.description.trim().length > 200) {
      errors.push('Description cannot exceed 200 characters');
    } else {
      sanitized.description = data.description.trim();
    }
  }

  // Date validation
  if (data.date !== undefined) {
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Invalid date format');
    } else {
      sanitized.date = parsedDate;
    }
  }

  // Notes validation
  if (data.notes !== undefined && data.notes !== null) {
    if (typeof data.notes !== 'string') {
      errors.push('Notes must be a string');
    } else if (data.notes.trim().length > 1000) {
      errors.push('Notes cannot exceed 1,000 characters');
    } else {
      sanitized.notes = data.notes.trim();
    }
  } else if (!isUpdate) {
    sanitized.notes = '';
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: sanitized
  };
};

module.exports = {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  ALL_CATEGORIES,
  isValidObjectId,
  validateTransactionInput
};
