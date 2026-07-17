/**
 * InterviewsPage.jsx
 * ---------------------------------------------------------------------------
 * Interviews listing page rendered inside DashboardLayout via routing.
 *
 * Displays:
 *   - A page header with "Interviews" title and a "Schedule Interview" button.
 *   - The InterviewsTable component showing all scheduled interviews.
 *
 * The handleScheduleInterview callback is a placeholder — wire it to a modal
 * or route navigation when the scheduling feature is implemented.
 */

import { useState, useCallback } from 'react';
import InterviewsTable from '../components/dashboard/InterviewsTable.jsx';

/* ── Plus icon for the Schedule Interview button ──────────────────────── */

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

/* ── InterviewsPage component ─────────────────────────────────────────── */

function InterviewsPage() {
  const [, setShowScheduleModal] = useState(false);

  const handleScheduleInterview = useCallback(() => {
    setShowScheduleModal(true);
    // TODO: Open schedule-interview modal or navigate to /interviews/new
  }, []);

  return (
    <>
      {/* Page header */}
      <div className="dashboard-page-header jobs-page-header">
        <div>
          <h2 className="dashboard-page-title">Interviews</h2>
          <p className="dashboard-page-subtitle">
            Schedule and manage candidate interviews.
          </p>
        </div>

        <button
          type="button"
          id="schedule-interview-btn"
          className="btn-primary"
          onClick={handleScheduleInterview}
        >
          <PlusIcon />
          Schedule Interview
        </button>
      </div>

      {/* Interviews table */}
      <InterviewsTable />
    </>
  );
}

export default InterviewsPage;
