/**
 * Sidebar.jsx
 * ---------------------------------------------------------------------------
 * Persistent sidebar navigation for the authenticated dashboard shell.
 *
 * Props:
 *   isOpen   — Boolean controlling mobile visibility (controlled by parent).
 *   onClose  — Callback to close the sidebar on mobile after navigation.
 *
 * Features:
 *   – HireTrack branding at the top.
 *   – NavLink-based navigation with active-state highlighting.
 *   – Logout button at the bottom (calls AuthContext.logout).
 *   – Responsive: slides off-screen on mobile, toggled via hamburger menu.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/* ── SVG icon components (inline to avoid extra dependencies) ──────────── */

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function JobsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function CandidatesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function InterviewsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/* ── Navigation items definition ──────────────────────────────────────── */

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: DashboardIcon  },
  { to: '/jobs',       label: 'Jobs',       icon: JobsIcon       },
  { to: '/candidates', label: 'Candidates', icon: CandidatesIcon },
  { to: '/interviews', label: 'Interviews', icon: InterviewsIcon },
  { to: '/settings',   label: 'Settings',   icon: SettingsIcon   },
];

/* ── Sidebar component ────────────────────────────────────────────────── */

function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  /**
   * On mobile, close the sidebar after the user taps a link so the
   * overlay disappears and the content behind it becomes interactive.
   */
  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`sidebar-overlay${isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="sidebar"
        className={`sidebar${isOpen ? ' sidebar-open' : ''}`}
        aria-label="Main navigation"
      >
        {/* ── Brand ─────────────────────────────────────────────────── */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" aria-hidden="true">H</div>
          <span className="sidebar-brand-text">HireTrack</span>
        </div>

        {/* ── Navigation links ──────────────────────────────────────── */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
              onClick={handleNavClick}
              id={`nav-${label.toLowerCase()}`}
            >
              <span className="nav-icon" aria-hidden="true">
                <Icon />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer / Logout ───────────────────────────────────────── */}
        <div className="sidebar-footer">
          <button
            className="sidebar-nav-item logout-item"
            onClick={handleLogout}
            id="sidebar-logout-btn"
            type="button"
          >
            <span className="nav-icon" aria-hidden="true">
              <LogoutIcon />
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
