const Transaction = require('../models/Transaction');

// Helper to parse month "YYYY-MM" into UTC date range
const getMonthDateRange = (monthStr) => {
  let year, monthNum;
  if (monthStr && /^\d{4}-\d{2}$/.test(monthStr)) {
    [year, monthNum] = monthStr.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getUTCFullYear();
    monthNum = now.getUTCMonth() + 1;
  }

  const startOfMonth = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
  const formattedMonth = `${year}-${String(monthNum).padStart(2, '0')}`;

  return { startOfMonth, endOfMonth, formattedMonth };
};

// Month name helper
const getMonthName = (year, monthNum) => {
  const date = new Date(Date.UTC(year, monthNum - 1, 1));
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
};

// @desc    Get dashboard summary for a specific month + all-time totals
// @route   GET /api/dashboard/summary
// @access  Public
const getDashboardSummary = async (req, res, next) => {
  try {
    const { month } = req.query;
    const { startOfMonth, endOfMonth, formattedMonth } = getMonthDateRange(month);

    // Selected month aggregates
    const monthAgg = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let monthIncome = 0;
    let monthExpense = 0;
    let monthCount = 0;

    monthAgg.forEach((item) => {
      monthCount += item.count;
      if (item._id === 'Income') monthIncome = item.total;
      if (item._id === 'Expense') monthExpense = item.total;
    });

    monthIncome = Math.round(monthIncome * 100) / 100;
    monthExpense = Math.round(monthExpense * 100) / 100;
    const monthBalance = Math.round((monthIncome - monthExpense) * 100) / 100;

    // Savings rate calculation
    let savingsRate = null;
    if (monthIncome > 0) {
      savingsRate = Math.round(((monthIncome - monthExpense) / monthIncome) * 1000) / 10;
    }

    // All-time totals for reference
    const allTimeAgg = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    let allTimeIncome = 0;
    let allTimeExpense = 0;
    let allTimeCount = 0;

    allTimeAgg.forEach((item) => {
      allTimeCount += item.count;
      if (item._id === 'Income') allTimeIncome = item.total;
      if (item._id === 'Expense') allTimeExpense = item.total;
    });

    allTimeIncome = Math.round(allTimeIncome * 100) / 100;
    allTimeExpense = Math.round(allTimeExpense * 100) / 100;
    const allTimeBalance = Math.round((allTimeIncome - allTimeExpense) * 100) / 100;

    res.status(200).json({
      success: true,
      data: {
        month: formattedMonth,
        selectedMonth: {
          totalIncome: monthIncome,
          totalExpenses: monthExpense,
          currentBalance: monthBalance,
          savingsRate,
          totalTransactions: monthCount
        },
        allTime: {
          totalIncome: allTimeIncome,
          totalExpenses: allTimeExpense,
          currentBalance: allTimeBalance,
          totalTransactions: allTimeCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly income vs expense totals for the last N months
// @route   GET /api/dashboard/monthly
// @access  Public
const getMonthlyComparison = async (req, res, next) => {
  try {
    const monthsCount = Math.min(24, Math.max(1, parseInt(req.query.months, 10) || 6));
    const targetMonth = req.query.month;

    let endYear, endMonthNum;
    if (targetMonth && /^\d{4}-\d{2}$/.test(targetMonth)) {
      [endYear, endMonthNum] = targetMonth.split('-').map(Number);
    } else {
      const now = new Date();
      endYear = now.getUTCFullYear();
      endMonthNum = now.getUTCMonth() + 1;
    }

    // Construct array of the requested N months in chronological order
    const monthsList = [];
    for (let i = monthsCount - 1; i >= 0; i--) {
      let m = endMonthNum - i;
      let y = endYear;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      const monthKey = `${y}-${String(m).padStart(2, '0')}`;
      monthsList.push({
        month: monthKey,
        monthName: getMonthName(y, m),
        year: y,
        monthNum: m,
        income: 0,
        expenses: 0,
        net: 0
      });
    }

    const startPeriod = new Date(Date.UTC(monthsList[0].year, monthsList[0].monthNum - 1, 1, 0, 0, 0, 0));
    const endPeriod = new Date(Date.UTC(endYear, endMonthNum, 0, 23, 59, 59, 999));

    const agg = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startPeriod, $lte: endPeriod }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$date', timezone: 'UTC' } },
            month: { $month: { date: '$date', timezone: 'UTC' } },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const dataMap = {};
    agg.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      if (!dataMap[key]) {
        dataMap[key] = { Income: 0, Expense: 0 };
      }
      dataMap[key][item._id.type] = Math.round(item.total * 100) / 100;
    });

    const result = monthsList.map((m) => {
      const totals = dataMap[m.month] || { Income: 0, Expense: 0 };
      const inc = totals.Income || 0;
      const exp = totals.Expense || 0;
      return {
        month: m.month,
        monthName: m.monthName,
        income: inc,
        expenses: exp,
        net: Math.round((inc - exp) * 100) / 100
      };
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense distribution by category for a specific month
// @route   GET /api/dashboard/categories
// @access  Public
const getCategorySpending = async (req, res, next) => {
  try {
    const { month } = req.query;
    const { startOfMonth, endOfMonth, formattedMonth } = getMonthDateRange(month);

    const agg = await Transaction.aggregate([
      {
        $match: {
          type: 'Expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const overallTotal = agg.reduce((acc, curr) => acc + curr.total, 0);

    const result = agg.map((item) => {
      const amount = Math.round(item.total * 100) / 100;
      const percentage = overallTotal > 0 ? Math.round((amount / overallTotal) * 1000) / 10 : 0;
      return {
        category: item._id,
        amount,
        percentage,
        count: item.count
      };
    });

    res.status(200).json({
      success: true,
      data: {
        month: formattedMonth,
        totalExpenses: Math.round(overallTotal * 100) / 100,
        categories: result
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly spending trend over last N months
// @route   GET /api/dashboard/trend
// @access  Public
const getSpendingTrend = async (req, res, next) => {
  try {
    const monthsCount = Math.min(24, Math.max(1, parseInt(req.query.months, 10) || 6));
    const targetMonth = req.query.month;

    let endYear, endMonthNum;
    if (targetMonth && /^\d{4}-\d{2}$/.test(targetMonth)) {
      [endYear, endMonthNum] = targetMonth.split('-').map(Number);
    } else {
      const now = new Date();
      endYear = now.getUTCFullYear();
      endMonthNum = now.getUTCMonth() + 1;
    }

    const monthsList = [];
    for (let i = monthsCount - 1; i >= 0; i--) {
      let m = endMonthNum - i;
      let y = endYear;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      const monthKey = `${y}-${String(m).padStart(2, '0')}`;
      monthsList.push({
        month: monthKey,
        monthName: getMonthName(y, m),
        year: y,
        monthNum: m
      });
    }

    const startPeriod = new Date(Date.UTC(monthsList[0].year, monthsList[0].monthNum - 1, 1, 0, 0, 0, 0));
    const endPeriod = new Date(Date.UTC(endYear, endMonthNum, 0, 23, 59, 59, 999));

    const agg = await Transaction.aggregate([
      {
        $match: {
          type: 'Expense',
          date: { $gte: startPeriod, $lte: endPeriod }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: { date: '$date', timezone: 'UTC' } },
            month: { $month: { date: '$date', timezone: 'UTC' } }
          },
          totalExpenses: { $sum: '$amount' }
        }
      }
    ]);

    const dataMap = {};
    agg.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      dataMap[key] = Math.round(item.totalExpenses * 100) / 100;
    });

    const result = monthsList.map((m) => ({
      month: m.month,
      monthName: m.monthName,
      expenses: dataMap[m.month] || 0
    }));

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getMonthlyComparison,
  getCategorySpending,
  getSpendingTrend
};
