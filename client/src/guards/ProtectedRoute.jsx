import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * ProtectedRoute — Redirects unauthenticated users to /login.
 * Optionally restricts by role(s).
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}> ... </Route>
 *   <Route element={<ProtectedRoute allowedRoles={['admin']} />}> ... </Route>
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
