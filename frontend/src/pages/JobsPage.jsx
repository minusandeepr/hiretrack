/**
 * JobsPage.jsx
 * ---------------------------------------------------------------------------
 * Jobs listing page rendered inside DashboardLayout via routing.
 *
 * Displays:
 *   - A page header with "Jobs" title and a "Create Job" action button.
 *   - The RecentJobsTable component showing all job postings.
 *
 * The handleCreateJob callback is a placeholder — wire it to a modal or
 * route navigation when the Create Job feature is implemented.
 */

import { useState, useCallback } from 'react';
import RecentJobsTable from '../components/dashboard/RecentJobsTable.jsx';

/* ── Plus icon for the Create Job button ──────────────────────────────── */

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

/* ── JobsPage component ───────────────────────────────────────────────── */

function JobsPage() {
  const [, setShowCreateModal] = useState(false);

  const handleCreateJob = useCallback(() => {
    setShowCreateModal(true);
    // TODO: Open create-job modal or navigate to /jobs/new
  }, []);

  return (
    <>
      {/* Page header */}
      <div className="dashboard-page-header jobs-page-header">
        <div>
          <h2 className="dashboard-page-title">Jobs</h2>
          <p className="dashboard-page-subtitle">
            Manage your job postings and track applications.
          </p>
        </div>

        <button
          type="button"
          id="create-job-btn"
          className="btn-primary"
          onClick={handleCreateJob}
        >
          <PlusIcon />
          Create Job
        </button>
      </div>

      {/* Jobs table */}
      <RecentJobsTable />
    </>
  );
}

export default JobsPage;
