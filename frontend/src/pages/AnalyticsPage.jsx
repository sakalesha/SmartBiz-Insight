import { useState, useEffect } from 'react';
import { fetchProductAnalytics, fetchTimeTrends, fetchCustomerInsights, fetchOrderAnalytics } from '../utils/analyticsApi';
import ProductCharts from '../components/analytics/ProductCharts';
import TimeTrendCharts from '../components/analytics/TimeTrendCharts';
import CustomerCharts from '../components/analytics/CustomerCharts';
import OrderCharts from '../components/analytics/OrderCharts';

const AnalyticsPage = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [dateRange, setDateRange] = useState('30days');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        products: null,
        timeTrends: null,
        customers: null,
        orders: null
    });

    const tabs = [
        { id: 'products', label: 'Products', icon: '📦' },
        { id: 'timeTrends', label: 'Time Trends', icon: '📈' },
        { id: 'customers', label: 'Customers', icon: '👥' },
        { id: 'orders', label: 'Orders', icon: '🛒' }
    ];

    const dateRanges = {
        '7days': { label: 'Last 7 Days', days: 7 },
        '30days': { label: 'Last 30 Days', days: 30 },
        '90days': { label: 'Last 90 Days', days: 90 },
        'all': { label: 'All Time', days: null }
    };

    const getDateFilters = () => {
        if (dateRange === 'all' || !dateRanges[dateRange].days) {
            return { startDate: null, endDate: null };
        }
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRanges[dateRange].days);
        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const { startDate, endDate } = getDateFilters();

            const [products, timeTrends, customers, orders] = await Promise.all([
                fetchProductAnalytics(startDate, endDate),
                fetchTimeTrends(startDate, endDate),
                fetchCustomerInsights(startDate, endDate),
                fetchOrderAnalytics(startDate, endDate)
            ]);

            setData({
                products,
                timeTrends,
                customers,
                orders
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, [dateRange]);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Detailed insights into your business performance</p>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Time Range:</label>
                <div className="flex gap-2">
                    {Object.entries(dateRanges).map(([key, { label }]) => (
                        <button
                            key={key}
                            onClick={() => setDateRange(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${dateRange === key
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex gap-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-4 border-b-2 font-medium text-sm transition ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                /* Content */
                <div>
                    {activeTab === 'products' && <ProductCharts data={data.products} />}
                    {activeTab === 'timeTrends' && <TimeTrendCharts data={data.timeTrends} />}
                    {activeTab === 'customers' && <CustomerCharts data={data.customers} />}
                    {activeTab === 'orders' && <OrderCharts data={data.orders} />}
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
