const mongoose = require('mongoose');
const { ALL_CATEGORIES } = require('../utils/validators');

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['Income', 'Expense'],
        message: 'Type must be either Income or Expense'
      }
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      max: [1000000000, 'Amount cannot exceed 1,000,000,000']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ALL_CATEGORIES,
        message: '{VALUE} is not a valid category'
      },
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1,000 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for query performance and sorting
transactionSchema.index({ date: -1 });
transactionSchema.index({ type: 1, date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ description: 'text' });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
