import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomerCharts = ({ data }) => {
    if (!data || (!data.topCustomers && !data.customerGrowth)) {
        return (
            <div className="text-center text-gray-500 py-8">
                No customer data available
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Metrics Cards */}
            {data.metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <h4 className="text-sm font-medium opacity-90 mb-2">Total Customers</h4>
                        <p className="text-3xl font-bold">{data.metrics.totalCustomers}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                        <h4 className="text-sm font-medium opacity-90 mb-2">Avg Orders per Customer</h4>
                        <p className="text-3xl font-bold">{data.metrics.avgOrdersPerCustomer.toFixed(1)}</p>
                    </div>
                </div>
            )}

            {/* Top Customers Table */}
            {data.topCustomers && data.topCustomers.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Spending</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.topCustomers.map((customer, idx) => (
                                    <tr key={customer.customerId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                                        <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                                            ${customer.totalSpent.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-600">{customer.orderCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Customer Growth Chart */}
            {data.customerGrowth && data.customerGrowth.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Acquisition Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.customerGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="newCustomers" stroke="#8b5cf6" strokeWidth={2} name="New Customers" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default CustomerCharts;
