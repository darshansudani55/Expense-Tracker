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

describe('SpendWise Backend API - Transactions & Health', () => {
  // 1. Health endpoint
  describe('GET /api/health', () => {
    it('1. should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.message).toContain('SpendWise');
    });
  });

  // 2-8. Create Transaction & Validations
  describe('POST /api/transactions', () => {
    it('2. should create a valid income transaction', async () => {
      const payload = {
        type: 'Income',
        amount: 50000,
        category: 'Salary',
        description: 'Monthly Salary',
        date: '2026-03-01T00:00:00.000Z',
        notes: 'Credited directly'
      };

      const res = await request(app).post('/api/transactions').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(50000);
      expect(res.body.data.type).toBe('Income');
      expect(res.body.data.category).toBe('Salary');
      expect(res.body.data._id).toBeDefined();
    });

    it('3. should create a valid expense transaction', async () => {
      const payload = {
        type: 'Expense',
        amount: 2500,
        category: 'Food',
        description: 'Supermarket Groceries',
        date: '2026-03-05T00:00:00.000Z'
      };

      const res = await request(app).post('/api/transactions').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('Expense');
      expect(res.body.data.amount).toBe(2500);
    });

    it('4. should reject missing description', async () => {
      const payload = {
        type: 'Expense',
        amount: 100,
        category: 'Food',
        date: '2026-03-05'
      };

      const res = await request(app).post('/api/transactions').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toContain('Description is required');
    });

    it('5. should reject zero and negative amounts', async () => {
      const zeroPayload = {
        type: 'Expense',
        amount: 0,
        category: 'Food',
        description: 'Free coffee',
        date: '2026-03-05'
      };

      const resZero = await request(app).post('/api/transactions').send(zeroPayload);
      expect(resZero.status).toBe(400);
      expect(resZero.body.details).toContain('Amount must be greater than zero');

      const negPayload = {
        ...zeroPayload,
        amount: -150
      };

      const resNeg = await request(app).post('/api/transactions').send(negPayload);
      expect(resNeg.status).toBe(400);
      expect(resNeg.body.details).toContain('Amount must be greater than zero');
    });

    it('6. should reject invalid transaction types', async () => {
      const payload = {
        type: 'Loan',
        amount: 500,
        category: 'Food',
        description: 'Invalid type transaction',
        date: '2026-03-05'
      };

      const res = await request(app).post('/api/transactions').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.details).toContain('Transaction type must be either "Income" or "Expense"');
    });

    it('7. should reject invalid categories for the chosen type', async () => {
      const payload = {
        type: 'Income',
        amount: 500,
        category: 'Food', // Food is an Expense category, not Income
        description: 'Invalid category for income',
        date: '2026-03-05'
      };

      const res = await request(app).post('/api/transactions').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.details.some((d) => d.includes('Invalid income category'))).toBe(true);
    });

    it('8. should reject invalid dates', async () => {
      const payload = {
        type: 'Expense',
        amount: 500,
        category: 'Food',
        description: 'Dinner',
        date: 'invalid-date-string'
      };

      const res = await request(app).post('/api/transactions').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.details).toContain('Invalid date format');
    });
  });

  // 9-15. List, Search, Filter, Sort, Pagination
  describe('GET /api/transactions querying', () => {
    beforeEach(async () => {
      await Transaction.create([
        { type: 'Income', amount: 50000, category: 'Salary', description: 'Alpha Tech Salary', date: new Date('2026-01-05') },
        { type: 'Expense', amount: 2000, category: 'Food', description: 'Italian Dinner', date: new Date('2026-01-10') },
        { type: 'Expense', amount: 8000, category: 'Housing', description: 'Apartment Maintenance', date: new Date('2026-02-01') },
        { type: 'Income', amount: 12000, category: 'Freelance', description: 'Website Redesign', date: new Date('2026-02-15') },
        { type: 'Expense', amount: 1500, category: 'Transport', description: 'Metro Pass and Fuel', date: new Date('2026-03-02') }
      ]);
    });

    it('9. should list transactions with proper pagination metadata', async () => {
      const res = await request(app).get('/api/transactions?page=1&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 2,
        total: 5,
        totalPages: 3
      });
    });

    it('10. should search transactions by description', async () => {
      const res = await request(app).get('/api/transactions?search=Italian');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].description).toBe('Italian Dinner');
    });

    it('11. should filter transactions by type', async () => {
      const res = await request(app).get('/api/transactions?type=Income');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      res.body.data.forEach((tx) => expect(tx.type).toBe('Income'));
    });

    it('12. should filter transactions by category', async () => {
      const res = await request(app).get('/api/transactions?category=Housing');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe('Housing');
    });

    it('13. should filter transactions by date range', async () => {
      const res = await request(app).get('/api/transactions?startDate=2026-02-01&endDate=2026-02-28');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      const descriptions = res.body.data.map((d) => d.description);
      expect(descriptions).toContain('Apartment Maintenance');
      expect(descriptions).toContain('Website Redesign');
    });

    it('14. should sort records correctly by amount ascending and descending', async () => {
      const resAsc = await request(app).get('/api/transactions?sortBy=amount&sortOrder=asc');
      expect(resAsc.status).toBe(200);
      expect(resAsc.body.data[0].amount).toBe(1500);

      const resDesc = await request(app).get('/api/transactions?sortBy=amount&sortOrder=desc');
      expect(resDesc.status).toBe(200);
      expect(resDesc.body.data[0].amount).toBe(50000);
    });

    it('15. should paginate records and navigate to page 2', async () => {
      const res = await request(app).get('/api/transactions?page=2&limit=2');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.page).toBe(2);
    });
  });

  // 16-20. Single Transaction, Edit, Delete, Nonexistent, Invalid ID
  describe('Single transaction CRUD & edge cases', () => {
    let testTx;

    beforeEach(async () => {
      testTx = await Transaction.create({
        type: 'Expense',
        amount: 3200,
        category: 'Bills',
        description: 'Internet Bill',
        date: new Date('2026-03-01'),
        notes: 'Fiber broadband'
      });
    });

    it('16. should retrieve a transaction by valid ID', async () => {
      const res = await request(app).get(`/api/transactions/${testTx._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.description).toBe('Internet Bill');
      expect(res.body.data.amount).toBe(3200);
    });

    it('17. should handle invalid ID format with 400', async () => {
      const res = await request(app).get('/api/transactions/invalid-id-12345');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid transaction ID format');
    });

    it('18. should update an existing transaction successfully', async () => {
      const updateData = {
        amount: 3500,
        description: 'Updated Fiber Internet Bill'
      };

      const res = await request(app).put(`/api/transactions/${testTx._id}`).send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(3500);
      expect(res.body.data.description).toBe('Updated Fiber Internet Bill');
    });

    it('19. should delete a transaction successfully', async () => {
      const res = await request(app).delete(`/api/transactions/${testTx._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const findRes = await Transaction.findById(testTx._id);
      expect(findRes).toBeNull();
    });

    it('20. should return 404 for nonexistent transaction ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/transactions/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Transaction not found');
    });
  });
});
