import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <p className="mt-4">Welcome to SmartBiz Insight! You are logged in.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
