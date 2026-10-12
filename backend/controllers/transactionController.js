const Transaction = require('../models/Transaction');
const {
  isValidObjectId,
  validateTransactionInput,
  ALL_CATEGORIES
} = require('../utils/validators');

// @desc    Get all transactions with filtering, search, sorting & pagination
// @route   GET /api/transactions
// @access  Public
const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      startDate,
      endDate,
      month,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Filter by type
    if (type) {
      if (!['Income', 'Expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Filter type must be "Income" or "Expense"'
        });
      }
      filter.type = type;
    }

    // Filter by category
    if (category) {
      if (!ALL_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          error: `Invalid category filter: ${category}`
        });
      }
      filter.category = category;
    }

    // Search by description (regex case-insensitive)
    if (search && typeof search === 'string' && search.trim()) {
      // Escape special regex characters to prevent regex injection
      const sanitizedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.description = { $regex: sanitizedSearch, $options: 'i' };
    }

    // Date range filter
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, monthNum] = month.split('-').map(Number);
      const startOfMonth = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
      filter.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else {
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) {
          const parsedStart = new Date(startDate);
          if (isNaN(parsedStart.getTime())) {
            return res.status(400).json({ success: false, error: 'Invalid startDate format' });
          }
          filter.date.$gte = parsedStart;
        }
        if (endDate) {
          const parsedEnd = new Date(endDate);
          if (isNaN(parsedEnd.getTime())) {
            return res.status(400).json({ success: false, error: 'Invalid endDate format' });
          }
          // Include the entire end day
          parsedEnd.setHours(23, 59, 59, 999);
          filter.date.$lte = parsedEnd;
        }
      }
    }

    // Sort setup
    const allowedSortFields = ['date', 'amount', 'description', 'createdAt'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const safeSortOrder = sortOrder === 'asc' ? 1 : -1;
    const sort = { [safeSortBy]: safeSortOrder };
    if (safeSortBy !== 'createdAt') {
      sort._id = -1; // deterministic secondary sort
    }

    // Pagination setup
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalPages = Math.ceil(total / limitNum) || 0;

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Public
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction ID format'
      });
    }

    const transaction = await Transaction.findById(id).lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Public
const createTransaction = async (req, res, next) => {
  try {
    const validation = validateTransactionInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const transaction = await Transaction.create(validation.data);

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Public
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction ID format'
      });
    }

    const existing = await Transaction.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    const validation = validateTransactionInput(
      {
        type: req.body.type || existing.type,
        amount: req.body.amount !== undefined ? req.body.amount : existing.amount,
        category: req.body.category || existing.category,
        description: req.body.description !== undefined ? req.body.description : existing.description,
        date: req.body.date || existing.date,
        notes: req.body.notes !== undefined ? req.body.notes : existing.notes
      },
      true
    );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const updated = await Transaction.findByIdAndUpdate(
      id,
      { $set: validation.data },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction ID format'
      });
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
