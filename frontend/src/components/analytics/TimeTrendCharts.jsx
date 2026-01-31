import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const TimeTrendCharts = ({ data }) => {
    if (!data || (!data.salesByDay && !data.dailySales)) {
        return (
            <div className="text-center text-gray-500 py-8">
                No time trend data available
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Sales by Day of Week */}
            {data.salesByDay && data.salesByDay.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Day of Week</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.salesByDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(value, name) => {
                                if (name === 'totalSales') return `$${value.toFixed(2)}`;
                                return value;
                            }} />
                            <Legend />
                            <Bar dataKey="totalSales" fill="#3b82f6" name="Total Sales" />
                            <Bar dataKey="orderCount" fill="#10b981" name="Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Daily Sales Trend */}
            {data.dailySales && data.dailySales.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Sales Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.dailySales}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip formatter={(value, name) => {
                                if (name === 'totalSales') return `$${value.toFixed(2)}`;
                                return value;
                            }} />
                            <Legend />
                            <Area type="monotone" dataKey="totalSales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" name="Sales" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Order Count Trend */}
            {data.dailySales && data.dailySales.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Order Count</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="orderCount" stroke="#8b5cf6" strokeWidth={2} name="Orders" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TimeTrendCharts;
