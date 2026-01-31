const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProductAnalytics,
    getTimeTrends,
    getCustomerInsights,
    getOrderAnalytics
} = require('../controllers/analyticsController');

router.get('/products', protect, getProductAnalytics);
router.get('/time-trends', protect, getTimeTrends);
router.get('/customers', protect, getCustomerInsights);
router.get('/orders', protect, getOrderAnalytics);

module.exports = router;
