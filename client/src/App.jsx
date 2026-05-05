import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './guards/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Placeholder dashboard pages (will be built in later phases)
const AdminDashboard = () => (
  <div className="min-h-screen bg-slate-50 p-8">
    <div className="max-w-4xl mx-auto card">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
      <p className="text-slate-500">Welcome, Admin! Full dashboard coming in Phase 4.</p>
    </div>
  </div>
);

const ClientDashboard = () => (
  <div className="min-h-screen bg-slate-50 p-8">
    <div className="max-w-4xl mx-auto card">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Client Dashboard</h1>
      <p className="text-slate-500">Welcome! Full dashboard coming in Phase 5.</p>
    </div>
  </div>
);

const EmployeeDashboard = () => (
  <div className="min-h-screen bg-slate-50 p-8">
    <div className="max-w-4xl mx-auto card">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Employee Dashboard</h1>
      <p className="text-slate-500">Welcome! Full dashboard coming in Phase 5.</p>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center card max-w-md">
      <h1 className="text-4xl font-bold text-red-500 mb-2">403</h1>
      <p className="text-slate-600 mb-4">You don&apos;t have permission to access this page.</p>
      <a href="/" className="btn-primary inline-block">Go Home</a>
    </div>
  </div>
);

function App() {
  const initialize = useAuthStore((s) => s.initialize);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Client routes */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Employee routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
