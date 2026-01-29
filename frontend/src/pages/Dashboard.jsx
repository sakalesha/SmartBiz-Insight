import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                SmartBiz Insight
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* User Info */}
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}! 👋
                    </h2>
                    <p className="text-gray-600">
                        Here's what's happening with your business today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-xl shadow-lg shadow-blue-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <span className="text-green-500 text-sm font-medium">+12%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                        <p className="text-2xl font-bold text-gray-900">$45,231</p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-xl shadow-lg shadow-purple-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span className="text-green-500 text-sm font-medium">+8%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">New Customers</h3>
                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-xl shadow-lg shadow-pink-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <span className="text-green-500 text-sm font-medium">+23%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                        <p className="text-2xl font-bold text-gray-900">892</p>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white rounded-xl shadow-lg shadow-indigo-100/50 p-6 border border-gray-100 hover:shadow-xl transition duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-red-500 text-sm font-medium">-4%</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Growth Rate</h3>
                        <p className="text-2xl font-bold text-gray-900">18.2%</p>
                    </div>
                </div>

                {/* Coming Soon Section */}
                <div className="bg-white rounded-xl shadow-lg shadow-gray-100/50 p-8 border border-gray-100 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">More Features Coming Soon!</h3>
                        <p className="text-gray-600">
                            We're working on adding powerful analytics, reporting tools, and business insights. Stay tuned!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
