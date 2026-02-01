const express = require('express');
const router = express.Router();
const {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');
const { protect, manager } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomerById);
router.post('/', protect, manager, createCustomer);
router.put('/:id', protect, manager, updateCustomer);
router.delete('/:id', protect, manager, deleteCustomer);

module.exports = router;
