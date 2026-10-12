const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { connectDB, disconnectDB } = require('../config/database');

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  console.error('SAFETY WARNING: Seeding is disabled in production environments!');
  process.exit(1);
}

const seedTransactions = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const isCleanOnly = process.argv.includes('--clean');

    if (isCleanOnly) {
      console.log('Cleaning all transactions from database...');
      await Transaction.deleteMany({});
      console.log('Successfully cleared all transactions.');
      await disconnectDB();
      process.exit(0);
    }

    console.log('Clearing existing sample transactions...');
    await Transaction.deleteMany({});

    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth(); // 0-indexed

    // Generate dates for current month, last month, and 2 months ago
    const getDate = (monthOffset, day) => {
      let targetMonth = currentMonth + monthOffset;
      let targetYear = currentYear;
      while (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }
      return new Date(Date.UTC(targetYear, targetMonth, day, 12, 0, 0));
    };

    const sampleData = [
      // Current Month - Income
      {
        type: 'Income',
        amount: 85000,
        category: 'Salary',
        description: 'Monthly Corporate Salary',
        date: getDate(0, 1),
        notes: 'Credited directly to savings account'
      },
      {
        type: 'Income',
        amount: 15000,
        category: 'Freelance',
        description: 'Full-stack Web Design Project',
        date: getDate(0, 10),
        notes: 'Milestone payment via bank transfer'
      },
      {
        type: 'Income',
        amount: 4500,
        category: 'Investment',
        description: 'Mutual Fund Dividend',
        date: getDate(0, 15),
        notes: 'Quarterly payout'
      },

      // Current Month - Expenses
      {
        type: 'Expense',
        amount: 22000,
        category: 'Housing',
        description: 'Apartment Monthly Rent',
        date: getDate(0, 2),
        notes: 'Paid via UPI'
      },
      {
        type: 'Expense',
        amount: 6800,
        category: 'Food',
        description: 'Supermarket Grocery Restock',
        date: getDate(0, 5),
        notes: 'Monthly staples and organic vegetables'
      },
      {
        type: 'Expense',
        amount: 3200,
        category: 'Bills',
        description: 'Electricity & Broadband Bill',
        date: getDate(0, 7),
        notes: 'Fiber net + power utility'
      },
      {
        type: 'Expense',
        amount: 2400,
        category: 'Transport',
        description: 'Fuel & Metro Smart Card Recharge',
        date: getDate(0, 9),
        notes: 'Commute expenses'
      },
      {
        type: 'Expense',
        amount: 4100,
        category: 'Shopping',
        description: 'Ergonomic Desk Accessories',
        date: getDate(0, 12),
        notes: 'Monitor stand and wrist rest'
      },
      {
        type: 'Expense',
        amount: 1800,
        category: 'Entertainment',
        description: 'Weekend Movie & Streaming Subs',
        date: getDate(0, 14),
        notes: 'IMAX tickets and OTT renewal'
      },
      {
        type: 'Expense',
        amount: 1500,
        category: 'Healthcare',
        description: 'Routine Health Checkup & Vitamins',
        date: getDate(0, 18),
        notes: 'Pharmacy bill'
      },

      // Last Month - Income & Expenses
      {
        type: 'Income',
        amount: 85000,
        category: 'Salary',
        description: 'Monthly Corporate Salary',
        date: getDate(-1, 1),
        notes: 'Direct deposit'
      },
      {
        type: 'Income',
        amount: 12000,
        category: 'Freelance',
        description: 'Mobile App Consulting',
        date: getDate(-1, 12),
        notes: 'Client invoice #104'
      },
      {
        type: 'Expense',
        amount: 22000,
        category: 'Housing',
        description: 'Apartment Monthly Rent',
        date: getDate(-1, 2),
        notes: 'Paid via UPI'
      },
      {
        type: 'Expense',
        amount: 7200,
        category: 'Food',
        description: 'Monthly Groceries & Dining Out',
        date: getDate(-1, 6),
        notes: 'Includes weekend dining'
      },
      {
        type: 'Expense',
        amount: 3100,
        category: 'Bills',
        description: 'Utility & Mobile Bills',
        date: getDate(-1, 8),
        notes: 'Automated card payments'
      },
      {
        type: 'Expense',
        amount: 3500,
        category: 'Transport',
        description: 'Cab Services & Fuel',
        date: getDate(-1, 15),
        notes: 'Airport commute'
      },
      {
        type: 'Expense',
        amount: 8500,
        category: 'Travel',
        description: 'Weekend Getaway Train & Stay',
        date: getDate(-1, 22),
        notes: 'Short road trip'
      },

      // 2 Months Ago - Income & Expenses
      {
        type: 'Income',
        amount: 85000,
        category: 'Salary',
        description: 'Monthly Corporate Salary',
        date: getDate(-2, 1),
        notes: 'Direct deposit'
      },
      {
        type: 'Expense',
        amount: 22000,
        category: 'Housing',
        description: 'Apartment Monthly Rent',
        date: getDate(-2, 2),
        notes: 'Paid via UPI'
      },
      {
        type: 'Expense',
        amount: 6500,
        category: 'Food',
        description: 'Supermarket Groceries',
        date: getDate(-2, 10),
        notes: 'Monthly groceries'
      },
      {
        type: 'Expense',
        amount: 2900,
        category: 'Bills',
        description: 'Water & Electricity Bills',
        date: getDate(-2, 12),
        notes: 'Municipal utility charges'
      }
    ];

    await Transaction.insertMany(sampleData);
    console.log(`[Success] Inserted ${sampleData.length} sample transactions!`);
    console.log('You can clear these anytime by running: npm run seed -- --clean');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedTransactions();
