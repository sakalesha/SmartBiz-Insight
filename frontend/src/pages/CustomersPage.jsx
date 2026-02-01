import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiDownload } from 'react-icons/fi';
import { fetchCustomers, deleteCustomer } from '../utils/api';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import CustomerModal from '../components/CustomerModal';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [error, setError] = useState(null);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCustomers(page, searchQuery);
            setCustomers(data.customers);
            setTotalPages(data.pagination.pages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, [page, searchQuery]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            await deleteCustomer(id);
            loadCustomers();
        } catch (err) {
            alert('Failed to delete customer: ' + err.message);
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedCustomer(null);
        setShowModal(true);
    };

    const handleModalClose = (refresh) => {
        setShowModal(false);
        setSelectedCustomer(null);
        if (refresh) loadCustomers();
    };

    const handleExportCSV = () => {
        const headers = [
            { label: 'Name', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Phone', key: 'phone' },
            { label: 'Status', key: 'status' }
        ];
        exportToCSV(customers, headers, 'customers_export.csv');
    };

    const handleExportPDF = () => {
        const headers = [
            { header: 'Name', dataKey: 'name' },
            { header: 'Email', dataKey: 'email' },
            { header: 'Phone', dataKey: 'phone' },
            { header: 'Status', dataKey: 'status' }
        ];
        exportToPDF(customers, headers, 'customers_export.pdf', 'Customer List');
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
                <p className="text-gray-600">Manage your customer database</p>
            </div>

            {/* Actions Bar */}
            <div className="mb-6 flex gap-4 items-center">
                {/* Search */}
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

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
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition duration-200"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add Customer</span>
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
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No customers found
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer, idx) => (
                                <tr key={customer._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {customer.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {customer.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {customer.phone || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${customer.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <FiEdit className="w-5 h-5 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(customer._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FiTrash2 className="w-5 h-5 inline" />
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
                <CustomerModal
                    customer={selectedCustomer}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default CustomersPage;
