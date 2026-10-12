/**
 * Currency Utility for SpendWise
 * 
 * Default Currency: Indian Rupee (INR - ₹)
 * Formatting Locale: en-IN
 * 
 * How to customize:
 * Change DEFAULT_LOCALE to 'en-US' and DEFAULT_CURRENCY to 'USD' for US Dollars ($),
 * or 'en-GB' / 'GBP' for British Pounds (£), or 'de-DE' / 'EUR' for Euros (€).
 */

export const DEFAULT_LOCALE = 'en-IN';
export const DEFAULT_CURRENCY = 'INR';

const formatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'currency',
  currency: DEFAULT_CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const compactFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'currency',
  currency: DEFAULT_CURRENCY,
  notation: 'compact',
  maximumFractionDigits: 1
});

/**
 * Format numeric value to standard currency string (e.g. ₹12,500.00)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  return formatter.format(Number(amount));
};

/**
 * Format numeric value to compact currency (e.g. ₹12.5K)
 */
export const formatCompactCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  return compactFormatter.format(Number(amount));
};
