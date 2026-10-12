const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Transaction = require('../models/Transaction');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Transaction.deleteMany({});
});

describe('SpendWise Backend API - Dashboard & Metrics (Items 21-25)', () => {
  beforeEach(async () => {
    // Populate transactions in March 2026
    await Transaction.create([
      {
        type: 'Income',
        amount: 80000,
        category: 'Salary',
        description: 'Tech Salary',
        date: new Date('2026-03-01T10:00:00Z')
      },
      {
        type: 'Income',
        amount: 20000,
        category: 'Freelance',
        description: 'Consulting',
        date: new Date('2026-03-10T10:00:00Z')
      },
      {
        type: 'Expense',
        amount: 30000,
        category: 'Housing',
        description: 'Monthly Rent',
        date: new Date('2026-03-02T10:00:00Z')
      },
      {
        type: 'Expense',
        amount: 10000,
        category: 'Food',
        description: 'Groceries and dining',
        date: new Date('2026-03-06T10:00:00Z')
      },
      {
        type: 'Expense',
        amount: 5000,
        category: 'Bills',
        description: 'Power and water utilities',
        date: new Date('2026-03-15T10:00:00Z')
      },
      // Previous month transaction for historical comparison (Feb 2026)
      {
        type: 'Income',
        amount: 70000,
        category: 'Salary',
        description: 'Feb Salary',
        date: new Date('2026-02-01T10:00:00Z')
      },
      {
        type: 'Expense',
        amount: 25000,
        category: 'Housing',
        description: 'Feb Rent',
        date: new Date('2026-02-03T10:00:00Z')
      }
    ]);
  });

  it('21. should calculate income totals correctly for the selected month', async () => {
    const res = await request(app).get('/api/dashboard/summary?month=2026-03');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // March income: 80,000 + 20,000 = 100,000
    expect(res.body.data.selectedMonth.totalIncome).toBe(100000);
    // All-time income: 100,000 + 70,000 = 170,000
    expect(res.body.data.allTime.totalIncome).toBe(170000);
  });

  it('22. should calculate expense totals correctly for the selected month', async () => {
    const res = await request(app).get('/api/dashboard/summary?month=2026-03');

    expect(res.status).toBe(200);
    // March expenses: 30,000 + 10,000 + 5,000 = 45,000
    expect(res.body.data.selectedMonth.totalExpenses).toBe(45000);
    // All-time expenses: 45,000 + 25,000 = 70,000
    expect(res.body.data.allTime.totalExpenses).toBe(70000);
  });

  it('23. should calculate balance and savings rate correctly', async () => {
    const res = await request(app).get('/api/dashboard/summary?month=2026-03');

    expect(res.status).toBe(200);
    // Balance: 100,000 - 45,000 = 55,000
    expect(res.body.data.selectedMonth.currentBalance).toBe(55000);
    // Savings rate: ((100,000 - 45,000) / 100,000) * 100 = 55%
    expect(res.body.data.selectedMonth.savingsRate).toBe(55);

    // Test zero income edge case
    await Transaction.deleteMany({ type: 'Income', date: { $gte: new Date('2026-03-01'), $lte: new Date('2026-03-31T23:59:59.999Z') } });
    const resZeroIncome = await request(app).get('/api/dashboard/summary?month=2026-03');

    expect(resZeroIncome.body.data.selectedMonth.totalIncome).toBe(0);
    expect(resZeroIncome.body.data.selectedMonth.savingsRate).toBeNull();
  });

  it('24. should calculate category spending correctly for expense distribution', async () => {
    const res = await request(app).get('/api/dashboard/categories?month=2026-03');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalExpenses).toBe(45000);

    const categories = res.body.data.categories;
    expect(categories.length).toBe(3);

    // Sorted descending by amount: Housing (30000), Food (10000), Bills (5000)
    expect(categories[0].category).toBe('Housing');
    expect(categories[0].amount).toBe(30000);
    // Housing percentage: (30000 / 45000) * 100 ~= 66.7%
    expect(categories[0].percentage).toBe(66.7);

    expect(categories[1].category).toBe('Food');
    expect(categories[1].amount).toBe(10000);

    expect(categories[2].category).toBe('Bills');
    expect(categories[2].amount).toBe(5000);
  });

  it('25. should calculate monthly chart data and trends correctly', async () => {
    const resMonthly = await request(app).get('/api/dashboard/monthly?months=2&month=2026-03');

    expect(resMonthly.status).toBe(200);
    expect(resMonthly.body.success).toBe(true);
    expect(resMonthly.body.data.length).toBe(2);

    const febData = resMonthly.body.data.find((d) => d.month === '2026-02');
    const marData = resMonthly.body.data.find((d) => d.month === '2026-03');

    expect(febData).toBeDefined();
    expect(febData.income).toBe(70000);
    expect(febData.expenses).toBe(25000);
    expect(febData.net).toBe(45000);

    expect(marData).toBeDefined();
    expect(marData.income).toBe(100000);
    expect(marData.expenses).toBe(45000);
    expect(marData.net).toBe(55000);

    // Trend endpoint
    const resTrend = await request(app).get('/api/dashboard/trend?months=2&month=2026-03');
    expect(resTrend.status).toBe(200);
    expect(resTrend.body.data.length).toBe(2);
    const marTrend = resTrend.body.data.find((d) => d.month === '2026-03');
    expect(marTrend.expenses).toBe(45000);
  });
});
