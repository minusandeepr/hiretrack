/**
 * DashboardLayout.jsx
 * ---------------------------------------------------------------------------
 * Authenticated shell layout that composes the Sidebar, TopNavbar, and a
 * scrollable content area where child routes are rendered via <Outlet />.
 *
 * Responsibilities:
 *   – Manages the mobile sidebar open/close state.
 *   – Derives the current page title from the URL pathname.
 *   – Closes the mobile sidebar on route changes automatically.
 *   – Provides the responsive grid defined in dashboard.css.
 */

import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import TopNavbar from '../components/layout/TopNavbar.jsx';

/* ── Map pathnames to human-readable page titles ──────────────────────── */

const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/jobs':       'Jobs',
  '/candidates': 'Candidates',
  '/interviews': 'Interviews',
  '/settings':   'Settings',
};

function getPageTitle(pathname) {
  // Exact match first, then try the first two segments for nested routes
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  const base = '/' + pathname.split('/').filter(Boolean)[0];
  return PAGE_TITLES[base] || 'Dashboard';
}

/* ── DashboardLayout component ────────────────────────────────────────── */

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close the mobile sidebar whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="dashboard-layout" id="dashboard-layout">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* ── Main column (topbar + content) ──────────────────────────── */}
      <div className="dashboard-main">
        <TopNavbar title={pageTitle} onMenuToggle={handleMenuToggle} />

        <main className="dashboard-content" id="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
