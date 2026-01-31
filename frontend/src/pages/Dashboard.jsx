import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { RevenueChart, UserGrowthChart } from '../components/DashboardCharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState({
        totalRevenue: 0,
        activeCustomers: 0,
        totalOrders: 0,
        growth: 0
    });
    const [analyticsData, setAnalyticsData] = useState({
        revenueData: [],
        userGrowthData: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = user?.token;
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch Stats
                const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/stats`, { headers });
                const statsData = await statsRes.json();

                // Fetch Analytics
                const analyticsRes = await fetch(`${import.meta.env.VITE_API_URL}/dashboard/analytics`, { headers });
                const analyticsJson = await analyticsRes.json();

                if (statsRes.ok && analyticsRes.ok) {
                    setStats(statsData);
                    setAnalyticsData(analyticsJson);
                } else {
                    setError('Failed to fetch dashboard data');
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">Here's what's happening with your business today.</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-white rounded-xl shadow-lg shadow-blue-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span className="text-green-500 text-sm font-medium">+{stats.growth}%</span>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>

                {/* Active Customers */}
                <div className="bg-white rounded-xl shadow-lg shadow-purple-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Active Customers</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers.toLocaleString()}</p>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-xl shadow-lg shadow-pink-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                </div>

                {/* Avg Order Value */}
                <div className="bg-white rounded-xl shadow-lg shadow-orange-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Avg Order Value</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RevenueChart data={analyticsData.revenueData} />
                <UserGrowthChart data={analyticsData.userGrowthData} />
            </div>
        </div>
    );
};

export default Dashboard;
