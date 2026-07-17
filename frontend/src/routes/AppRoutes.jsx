import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import JobsPage from '../pages/JobsPage.jsx';
import CandidatesPage from '../pages/CandidatesPage.jsx';
import InterviewsPage from '../pages/InterviewsPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import Spinner from '../components/common/Spinner.jsx';

/**
 * FullScreenLoader
 * Centered loading spinner used while auth state is being resolved.
 */
function FullScreenLoader() {
  return (
    <div className="flex-center" style={{ minHeight: '100vh' }}>
      <Spinner size="lg" text="Loading..." />
    </div>
  );
}

/**
 * GuestRoute
 * Wrapper for public-only pages (login, register).
 * Redirects already-authenticated users to /dashboard.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/**
 * RootRedirect
 * Sends authenticated users to /dashboard, others to /login.
 */
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

/**
 * AppRoutes
 * Top-level route configuration for the application.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public / guest-only routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* Protected routes: ProtectedRoute -> DashboardLayout -> pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
        </Route>
      </Route>

      {/* 404 catch-all */}
      <Route
        path="*"
        element={
          <div
            className="flex-center"
            style={{ minHeight: '100vh', flexDirection: 'column', gap: '12px' }}
          >
            <h1 style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-2xl)' }}>
              404
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Page not found</p>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
