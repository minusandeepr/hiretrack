/**
 * ProtectedRoute.jsx
 * ---------------------------------------------------------------------------
 * Route guard that redirects unauthenticated users to /login.
 *
 * Usage in AppRoutes:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
 *     <Route path="/admin" element={<AdminPage />} />
 *   </Route>
 *
 * Props:
 *   allowedRoles — Optional array of roles permitted to access children.
 *                  If omitted, any authenticated user is allowed.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from './common/Spinner.jsx';

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While the initial auth check is running, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <Spinner size="lg" text="Loading…" />
      </div>
    );
  }

  // Not authenticated → redirect to login (preserve the intended URL)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check — if allowedRoles is specified, verify the user's role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the child route
  return <Outlet />;
}

export default ProtectedRoute;
