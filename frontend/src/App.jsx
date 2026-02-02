import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="" element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
