const Order = require('../models/Order');
const Customer = require('../models/Customer');

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private
const getProductAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};

        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Top products by revenue
        const topByRevenue = await Order.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    totalQuantity: { $sum: '$items.quantity' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            { $project: { product: '$_id', totalRevenue: 1, totalQuantity: 1, orderCount: 1, _id: 0 } }
        ]);

        // Top products by quantity
        const topByQuantity = await Order.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            { $project: { product: '$_id', totalQuantity: 1, totalRevenue: 1, _id: 0 } }
        ]);

        res.json({
            topByRevenue,
            topByQuantity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get time-based trends
// @route   GET /api/analytics/time-trends
// @access  Private
const getTimeTrends = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};

        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Sales by day of week
        const salesByDayOfWeek = await Order.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    dayOfWeek: '$_id',
                    totalSales: 1,
                    orderCount: 1,
                    _id: 0
                }
            }
        ]);

        // Map day numbers to names
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const salesByDay = salesByDayOfWeek.map(item => ({
            day: dayNames[item.dayOfWeek - 1],
            totalSales: item.totalSales,
            orderCount: item.orderCount
        }));

        // Daily sales for last 30 days (or custom range)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyFilter = dateFilter.createdAt
            ? dateFilter
            : { createdAt: { $gte: thirtyDaysAgo } };

        const dailySales = await Order.aggregate([
            { $match: { status: 'completed', ...dailyFilter } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { date: '$_id', totalSales: 1, orderCount: 1, _id: 0 } }
        ]);

        res.json({
            salesByDay,
            dailySales
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get customer insights
// @route   GET /api/analytics/customers
// @access  Private
const getCustomerInsights = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};

        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Top customers by total spent
        const topCustomers = await Order.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            {
                $group: {
                    _id: '$customer',
                    totalSpent: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customerInfo'
                }
            },
            { $unwind: '$customerInfo' },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $project: {
                    customerId: '$_id',
                    name: '$customerInfo.name',
                    email: '$customerInfo.email',
                    totalSpent: 1,
                    orderCount: 1,
                    _id: 0
                }
            }
        ]);

        // Customer acquisition by month
        const customerGrowth = await Customer.aggregate([
            ...(Object.keys(dateFilter).length ? [{ $match: dateFilter }] : []),
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    newCustomers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { month: '$_id', newCustomers: 1, _id: 0 } }
        ]);

        // Customer metrics
        const totalCustomers = await Customer.countDocuments({ status: 'active' });
        const avgOrdersPerCustomer = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$customer', orderCount: { $sum: 1 } } },
            { $group: { _id: null, avgOrders: { $avg: '$orderCount' } } }
        ]);

        res.json({
            topCustomers,
            customerGrowth,
            metrics: {
                totalCustomers,
                avgOrdersPerCustomer: avgOrdersPerCustomer[0]?.avgOrders || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order analytics
// @route   GET /api/analytics/orders
// @access  Private
const getOrderAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};

        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Order value distribution
        const orderDistribution = await Order.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            {
                $bucket: {
                    groupBy: '$totalAmount',
                    boundaries: [0, 50, 100, 200, 500, 1000, 10000],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 },
                        totalRevenue: { $sum: '$totalAmount' }
                    }
                }
            },
            {
                $project: {
                    range: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$_id', 0] }, then: '$0-50' },
                                { case: { $eq: ['$_id', 50] }, then: '$50-100' },
                                { case: { $eq: ['$_id', 100] }, then: '$100-200' },
                                { case: { $eq: ['$_id', 200] }, then: '$200-500' },
                                { case: { $eq: ['$_id', 500] }, then: '$500-1000' },
                                { case: { $eq: ['$_id', 1000] }, then: '$1000+' }
                            ],
                            default: 'Other'
                        }
                    },
                    count: 1,
                    totalRevenue: 1,
                    _id: 0
                }
            }
        ]);

        // Average order value by month
        const aovByMonth = await Order.aggregate([
            { $match: { status: 'completed', ...dateFilter } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    avgOrderValue: { $avg: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { month: '$_id', avgOrderValue: 1, orderCount: 1, _id: 0 } }
        ]);

        // Order status breakdown
        const statusBreakdown = await Order.aggregate([
            ...(Object.keys(dateFilter).length ? [{ $match: dateFilter }] : []),
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            },
            { $project: { status: '$_id', count: 1, totalAmount: 1, _id: 0 } }
        ]);

        res.json({
            orderDistribution,
            aovByMonth,
            statusBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProductAnalytics,
    getTimeTrends,
    getCustomerInsights,
    getOrderAnalytics
};
