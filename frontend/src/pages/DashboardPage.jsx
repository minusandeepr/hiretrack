/**
 * DashboardPage.jsx
 * ---------------------------------------------------------------------------
 * Main dashboard view rendered inside DashboardLayout via routing.
 *
 * Displays:
 *   – A welcome heading with the logged-in user's name.
 *   – Four StatCards (Total Jobs, Candidates, Interviews, Active Positions).
 *   – Placeholder section for RecentJobsTable and RecentCandidatesTable.
 *
 * All data is static / placeholder for now — will be replaced with API
 * calls in a future milestone.
 */

import { useAuth } from '../context/AuthContext.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import RecentJobsTable from '../components/dashboard/RecentJobsTable.jsx';
import RecentCandidatesTable from '../components/dashboard/RecentCandidatesTable.jsx';

/* ── Inline SVG icons for each stat card ──────────────────────────────── */

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

/* ── Placeholder stat data ────────────────────────────────────────────── */

const STATS = [
  {
    title: 'Total Jobs',
    value: 24,
    icon: <BriefcaseIcon />,
    colorVariant: 'violet',
    trend: { value: '+8% this month', isPositive: true },
  },
  {
    title: 'Candidates',
    value: 142,
    icon: <UsersIcon />,
    colorVariant: 'cyan',
    trend: { value: '+23% this month', isPositive: true },
  },
  {
    title: 'Interviews',
    value: 12,
    icon: <CalendarIcon />,
    colorVariant: 'warning',
    trend: { value: '3 this week', isPositive: true },
  },
  {
    title: 'Active Positions',
    value: 8,
    icon: <CheckCircleIcon />,
    colorVariant: 'success',
    trend: { value: '-2 since last week', isPositive: false },
  },
];

/* ── DashboardPage component ──────────────────────────────────────────── */

function DashboardPage() {
  const { user } = useAuth();

  const greeting = getGreeting();

  return (
    <>
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="dashboard-page-header">
        <h2 className="dashboard-page-title">
          {greeting}, {user?.name || 'there'} 👋
        </h2>
        <p className="dashboard-page-subtitle">
          Here's what's happening with your recruitment pipeline today.
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div className="stat-cards-grid" id="stat-cards">
        {STATS.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            colorVariant={stat.colorVariant}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* ── Tables section ──────────────────────────────────────── */}
      <div className="dashboard-tables" id="dashboard-tables">
        <RecentJobsTable />
        <RecentCandidatesTable />
      </div>
    </>
  );
}

/* ── Helper: time-of-day greeting ─────────────────────────────────────── */

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default DashboardPage;
