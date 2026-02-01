const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, manager } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, manager, createOrder);
router.put('/:id/status', protect, manager, updateOrderStatus);

module.exports = router;
