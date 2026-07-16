/**
 * AppRoutes.jsx
 * ---------------------------------------------------------------------------
 * Central routing configuration for HireTrack ATS.
 *
 * Public routes:  /login, /register
 * Protected:      /dashboard (and all future feature routes)
 * Root (/) redirects authenticated users to /dashboard, others to /login.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import Spinner from '../components/common/Spinner.jsx';

// ── Guest-only wrapper (redirect if already logged in) ──────────────────────

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <Spinner size="lg" text="Loading…" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ── Temporary dashboard (will be replaced in Milestone 2) ───────────────────

function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 'var(--font-bold)',
          background: 'var(--color-accent-gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Welcome, {user?.name}
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)' }}>
        Role: <strong style={{ color: 'var(--color-accent-cyan)' }}>{user?.role}</strong>
      </p>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
        Dashboard, Jobs, Candidates, and Interviews will be built in Milestone 2.
      </p>
      <button
        onClick={logout}
        id="logout-btn"
        style={{
          marginTop: '8px',
          padding: '10px 28px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          background: 'var(--color-bg-elevated)',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => (e.target.style.background = 'var(--color-bg-hover)')}
        onMouseLeave={(e) => (e.target.style.background = 'var(--color-bg-elevated)')}
      >
        Sign out
      </button>
    </div>
  );
}

// ── Route tree ──────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* ── Root redirect ──────────────────────────────────────────────── */}
      <Route path="/" element={<RootRedirect />} />

      {/* ── Guest-only routes ──────────────────────────────────────────── */}
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

      {/* ── Protected routes ───────────────────────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPlaceholder />} />
        {/* Milestone 2 routes will be added here */}
      </Route>

      {/* ── 404 catch-all ──────────────────────────────────────────────── */}
      <Route
        path="*"
        element={
          <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '12px' }}>
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

// ── Root redirect helper ────────────────────────────────────────────────────

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <Spinner size="lg" text="Loading…" />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default AppRoutes;
