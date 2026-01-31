import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f59e0b', '#10b981', '#ef4444'];

const OrderCharts = ({ data }) => {
    if (!data || (!data.orderDistribution && !data.aovByMonth && !data.statusBreakdown)) {
        return (
            <div className="text-center text-gray-500 py-8">
                No order data available
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Order Value Distribution */}
            {data.orderDistribution && data.orderDistribution.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Value Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.orderDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#3b82f6" name="Number of Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Average Order Value Trend */}
            {data.aovByMonth && data.aovByMonth.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value by Month</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.aovByMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Line type="monotone" dataKey="avgOrderValue" stroke="#10b981" strokeWidth={2} name="Avg Order Value" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Order Status Breakdown */}
            {data.statusBreakdown && data.statusBreakdown.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.statusBreakdown}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={(entry) => `${entry.status}: ${entry.count}`}
                                >
                                    {data.statusBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Status Cards */}
                        <div className="space-y-3">
                            {data.statusBreakdown.map((status, idx) => (
                                <div key={status.status} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                status.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {status.status.toUpperCase()}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">{status.count} orders</span>
                                    </div>
                                    {status.totalAmount > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Total: <span className="font-semibold">${status.totalAmount.toFixed(2)}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCharts;
