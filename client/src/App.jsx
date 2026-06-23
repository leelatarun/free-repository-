import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children, isAdmin, loading }) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const { isAdmin, loading, logout } = useAuth();
  const [adminFlag, setAdminFlag] = useState(false);

  // Combine hook state with local login state
  const adminActive = isAdmin || adminFlag;

  return (
    <BrowserRouter>
      <Navbar isAdmin={adminActive} onLogout={() => { logout(); setAdminFlag(false); }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin/login"
          element={
            adminActive ? <Navigate to="/admin" replace /> : (
              <AdminLogin onLogin={() => setAdminFlag(true)} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdmin={adminActive} loading={loading}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
