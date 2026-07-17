/**
 * CandidatesPage.jsx
 * ---------------------------------------------------------------------------
 * Candidates listing page rendered inside DashboardLayout via routing.
 *
 * Displays:
 *   - A page header with "Candidates" title and an "Add Candidate" button.
 *   - The RecentCandidatesTable component showing all candidates.
 *
 * The handleAddCandidate callback is a placeholder — wire it to a modal or
 * route navigation when the Add Candidate feature is implemented.
 */

import { useState, useCallback } from 'react';
import RecentCandidatesTable from '../components/dashboard/RecentCandidatesTable.jsx';

/* ── Plus icon for the Add Candidate button ───────────────────────────── */

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

/* ── CandidatesPage component ─────────────────────────────────────────── */

function CandidatesPage() {
  const [, setShowAddModal] = useState(false);

  const handleAddCandidate = useCallback(() => {
    setShowAddModal(true);
    // TODO: Open add-candidate modal or navigate to /candidates/new
  }, []);

  return (
    <>
      {/* Page header */}
      <div className="dashboard-page-header jobs-page-header">
        <div>
          <h2 className="dashboard-page-title">Candidates</h2>
          <p className="dashboard-page-subtitle">
            Manage and track your candidates.
          </p>
        </div>

        <button
          type="button"
          id="add-candidate-btn"
          className="btn-primary"
          onClick={handleAddCandidate}
        >
          <PlusIcon />
          Add Candidate
        </button>
      </div>

      {/* Candidates table */}
      <RecentCandidatesTable />
    </>
  );
}

export default CandidatesPage;
