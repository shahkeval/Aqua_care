import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './guards/ProtectedRoute';

// Pages
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

const LandingPage = () => (
  <div>
    <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-sky-600 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          AquaCare
        </h1>
        <div className="flex gap-3">
          <a href="/login" className="text-sky-600 font-medium hover:text-sky-700 px-4 py-2">Login</a>
          <a href="/register" className="btn-primary">Start Free Trial</a>
        </div>
      </div>
    </header>

    <main className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-5xl font-extrabold text-slate-900 mb-6">
        Premium RO Service <br />
        <span className="text-sky-500">At Your Doorstep</span>
      </h2>
      <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
        AquaCare is the most trusted RO servicing platform. We provide timely maintenance, genuine parts, and expert technicians.
      </p>
      <div className="flex justify-center gap-4">
        <a href="/register" className="btn-primary text-lg px-8 py-3">Start 14-Day Free Trial</a>
        <a href="/login" className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium text-lg">Login</a>
      </div>
    </main>
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
      <Route path="/" element={<LandingPage />} />
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
