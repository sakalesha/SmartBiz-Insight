const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

// Get all orders
const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments();

        res.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone address');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
};

// Create new order
const createOrder = async (req, res) => {
    try {
        const { customer, items, status } = req.body;

        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const order = new Order({
            customer,
            items,
            totalAmount: Math.round(totalAmount * 100) / 100,
            status: status || 'pending'
        });

        await order.save();

        // If order is completed, create a transaction
        if (order.status === 'completed') {
            const transaction = new Transaction({
                order: order._id,
                amount: order.totalAmount,
                type: 'sale',
                date: new Date()
            });
            await transaction.save();
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const oldStatus = order.status;
        order.status = status;
        await order.save();

        // If status changed from pending/cancelled to completed, create transaction
        if (oldStatus !== 'completed' && status === 'completed') {
            const transaction = new Transaction({
                order: order._id,
                amount: order.totalAmount,
                type: 'sale',
                date: new Date()
            });
            await transaction.save();
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Failed to update order' });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
};
