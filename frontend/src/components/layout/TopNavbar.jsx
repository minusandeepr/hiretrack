/**
 * TopNavbar.jsx
 * ---------------------------------------------------------------------------
 * Sticky top navigation bar for the authenticated dashboard shell.
 *
 * Props:
 *   title          — Page title displayed on the left (e.g. "Dashboard").
 *   onMenuToggle   — Callback to toggle the mobile sidebar.
 *
 * Features:
 *   – Glassmorphism backdrop-blur effect.
 *   – Hamburger menu button (visible only on mobile via CSS).
 *   – Logged-in user's name pulled from AuthContext.
 *   – Gradient avatar placeholder showing the user's initials.
 */

import { useAuth } from '../../context/AuthContext.jsx';

/* ── Helper: extract up to 2 initials from a name ─────────────────────── */

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ── Hamburger icon (3-line menu) ─────────────────────────────────────── */

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

/* ── TopNavbar component ──────────────────────────────────────────────── */

function TopNavbar({ title = 'Dashboard', onMenuToggle }) {
  const { user } = useAuth();

  const displayName = user?.name || 'User';
  const initials = getInitials(displayName);

  return (
    <header className="topnav" id="topnav">
      {/* ── Left section ──────────────────────────────────────────── */}
      <div className="topnav-left">
        <button
          className="topnav-menu-btn"
          onClick={onMenuToggle}
          type="button"
          aria-label="Toggle navigation menu"
          id="topnav-menu-btn"
        >
          <MenuIcon />
        </button>

        <h1 className="topnav-title">{title}</h1>
      </div>

      {/* ── Right section ─────────────────────────────────────────── */}
      <div className="topnav-right">
        <div className="topnav-user">
          <span className="topnav-user-name" id="topnav-user-name">
            {displayName}
          </span>
          <div
            className="topnav-avatar"
            id="topnav-avatar"
            aria-label={`Avatar for ${displayName}`}
            role="img"
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
