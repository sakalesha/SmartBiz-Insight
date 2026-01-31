const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

const getDashboardStats = async (req, res) => {
    try {
        // Get total revenue from all transactions
        const revenueResult = await Transaction.aggregate([
            { $match: { type: 'sale' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get active customers count
        const activeCustomers = await Customer.countDocuments({ status: 'active' });

        // Get total completed orders
        const totalOrders = await Order.countDocuments({ status: 'completed' });

        // Calculate growth rate (comparing last 2 months)
        const now = new Date();
        const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

        const thisMonthRevenue = await Transaction.aggregate([
            { $match: { month: thisMonth, type: 'sale' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const lastMonthRevenue = await Transaction.aggregate([
            { $match: { month: lastMonth, type: 'sale' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const thisMonthTotal = thisMonthRevenue.length > 0 ? thisMonthRevenue[0].total : 0;
        const lastMonthTotal = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 1;
        const growth = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 0;

        const stats = {
            totalRevenue: Math.round(totalRevenue),
            activeCustomers,
            totalOrders,
            growth: parseFloat(growth)
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
};

const getDashboardAnalytics = async (req, res) => {
    try {
        // Get revenue data for last 7 months
        const revenueData = await Transaction.aggregate([
            { $match: { type: 'sale' } },
            {
                $group: {
                    _id: '$month',
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 7 }
        ]);

        // Format revenue data for charts
        const formattedRevenueData = revenueData.map(item => {
            const [year, month] = item._id.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                name: monthNames[parseInt(month) - 1],
                revenue: Math.round(item.revenue)
            };
        });

        // Get user growth data (new customers by month)
        const userGrowthData = await Customer.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: '$createdAt' }
                    },
                    users: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 7 }
        ]);

        // Format user growth data
        const formattedUserGrowthData = userGrowthData.map(item => {
            const [year, month] = item._id.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
                name: monthNames[parseInt(month) - 1],
                users: item.users
            };
        });

        res.json({
            revenueData: formattedRevenueData,
            userGrowthData: formattedUserGrowthData
        });
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard analytics' });
    }
};

module.exports = {
    getDashboardStats,
    getDashboardAnalytics
};
