import { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiShoppingCart, FiLogOut, FiBarChart2, FiPackage } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const DashboardLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/customers', icon: FiUsers, label: 'Customers' },
        { path: '/products', icon: FiPackage, label: 'Products' },
        { path: '/orders', icon: FiShoppingCart, label: 'Orders' },
        { path: '/analytics', icon: FiBarChart2, label: 'Analytics' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">
            {/* Sidebar - Fixed Position */}
            <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col fixed h-screen left-0 top-0">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        SmartBiz Insight
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info - Sticky at bottom */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
                    >
                        <FiLogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content - offset for fixed sidebar */}
            <main className="flex-1 ml-64 overflow-auto min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
