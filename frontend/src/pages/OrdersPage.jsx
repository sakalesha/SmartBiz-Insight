import { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiDownload } from 'react-icons/fi';
import { fetchOrders, updateOrderStatus } from '../utils/api';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import OrderModal from '../components/OrderModal';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchOrders(page, statusFilter);
            setOrders(data.orders);
            setTotalPages(data.pagination.pages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [page, statusFilter]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            loadOrders();
        } catch (err) {
            alert('Failed to update order status: ' + err.message);
        }
    };

    const handleModalClose = (refresh) => {
        setShowModal(false);
        if (refresh) loadOrders();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleExportCSV = () => {
        const headers = [
            { label: 'Order #', key: 'orderNumber' },
            { label: 'Customer', key: 'customerName' },
            { label: 'Items', key: 'itemCount' },
            { label: 'Total', key: 'totalAmount' },
            { label: 'Status', key: 'status' },
            { label: 'Date', key: 'date' }
        ];

        const dataToExport = orders.map(order => ({
            orderNumber: order.orderNumber,
            customerName: order.customer?.name || 'N/A',
            itemCount: order.items?.length || 0,
            totalAmount: order.totalAmount?.toFixed(2),
            status: order.status,
            date: new Date(order.createdAt).toLocaleDateString()
        }));

        exportToCSV(dataToExport, headers, 'orders_export.csv');
    };

    const handleExportPDF = () => {
        const headers = [
            { header: 'Order #', dataKey: 'orderNumber' },
            { header: 'Customer', dataKey: 'customerName' },
            { header: 'Items', dataKey: 'itemCount' },
            { header: 'Total', dataKey: 'totalAmount' },
            { header: 'Status', dataKey: 'status' },
            { header: 'Date', dataKey: 'date' }
        ];

        const dataToExport = orders.map(order => ({
            orderNumber: order.orderNumber,
            customerName: order.customer?.name || 'N/A',
            itemCount: order.items?.length || 0,
            totalAmount: `$${order.totalAmount?.toFixed(2)}`,
            status: order.status,
            date: new Date(order.createdAt).toLocaleDateString()
        }));

        exportToPDF(dataToExport, headers, 'orders_export.pdf', 'Order List');
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
                <p className="text-gray-600">Manage and track customer orders</p>
            </div>

            {/* Actions Bar */}
            <div className="mb-6 flex gap-4 items-center">
                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <div className="flex-1"></div>

                {/* Export Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                        <FiDownload className="w-5 h-5" />
                        <span>CSV</span>
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                        <FiDownload className="w-5 h-5" />
                        <span>PDF</span>
                    </button>
                </div>

                {/* Add Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition duration-200"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Create Order</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, idx) => (
                                <tr key={order._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.orderNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.customer?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {order.items?.length || 0} item(s)
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        ${order.totalAmount?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`px-3 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(order.status)}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            title="View Details"
                                        >
                                            <FiEye className="w-5 h-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <OrderModal onClose={handleModalClose} />
            )}
        </div>
    );
};

export default OrdersPage;
