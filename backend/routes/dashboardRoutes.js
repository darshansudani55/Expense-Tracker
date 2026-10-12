const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getMonthlyComparison,
  getCategorySpending,
  getSpendingTrend
} = require('../controllers/dashboardController');

router.get('/summary', getDashboardSummary);
router.get('/monthly', getMonthlyComparison);
router.get('/categories', getCategorySpending);
router.get('/trend', getSpendingTrend);

module.exports = router;
