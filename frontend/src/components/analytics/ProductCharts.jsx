import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#f97316', '#06b6d4'];

const ProductCharts = ({ data }) => {
    if (!data || (!data.topByRevenue && !data.topByQuantity)) {
        return (
            <div className="text-center text-gray-500 py-8">
                No product data available
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Top Products by Revenue */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topByRevenue} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="product" type="category" width={150} />
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="totalRevenue" fill="#3b82f6" name="Revenue" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Products by Quantity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Quantity Sold</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topByQuantity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalQuantity" fill="#8b5cf6" name="Quantity" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue Distribution Pie Chart */}
            {data.topByRevenue && data.topByRevenue.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.topByRevenue}
                                dataKey="totalRevenue"
                                nameKey="product"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry) => `${entry.product}: $${entry.totalRevenue.toFixed(0)}`}
                            >
                                {data.topByRevenue.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default ProductCharts;
