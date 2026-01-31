const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/analytics', protect, getDashboardAnalytics);

module.exports = router;
