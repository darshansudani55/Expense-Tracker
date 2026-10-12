/**
 * Categories configuration and visual styling mapping
 */

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Other Income'
];

export const EXPENSE_CATEGORIES = [
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

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const CATEGORY_COLORS = {
  // Income
  Salary: '#10B981', // Emerald
  Freelance: '#06B6D4', // Cyan
  Business: '#3B82F6', // Blue
  Investment: '#8B5CF6', // Purple
  'Other Income': '#14B8A6', // Teal

  // Expense
  Food: '#F59E0B', // Amber
  Transport: '#3B82F6', // Blue
  Shopping: '#EC4899', // Pink
  Bills: '#EF4444', // Red
  Education: '#8B5CF6', // Purple
  Healthcare: '#10B981', // Emerald
  Entertainment: '#F97316', // Orange
  Housing: '#6366F1', // Indigo
  Travel: '#0EA5E9', // Sky blue
  'Other Expense': '#64748B' // Slate
};

export const DEFAULT_COLOR = '#64748B';

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || DEFAULT_COLOR;
};
