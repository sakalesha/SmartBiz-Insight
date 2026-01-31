const getDashboardStats = async (req, res) => {
    // mock data for now
    const stats = {
        totalRevenue: 54321,
        activeCustomers: 1234,
        totalOrders: 89,
        growth: 12.5
    };
    res.json(stats);
};

const getDashboardAnalytics = async (req, res) => {
    // mock data for charts
    const revenueData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 2000 },
        { name: 'Apr', revenue: 2780 },
        { name: 'May', revenue: 1890 },
        { name: 'Jun', revenue: 2390 },
        { name: 'Jul', revenue: 3490 },
    ];

    const userGrowthData = [
        { name: 'Jan', users: 400 },
        { name: 'Feb', users: 300 },
        { name: 'Mar', users: 200 },
        { name: 'Apr', users: 278 },
        { name: 'May', users: 189 },
        { name: 'Jun', users: 239 },
        { name: 'Jul', users: 349 },
    ];

    res.json({ revenueData, userGrowthData });
};

module.exports = {
    getDashboardStats,
    getDashboardAnalytics
};
