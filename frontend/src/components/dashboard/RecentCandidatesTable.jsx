/**
 * RecentCandidatesTable.jsx
 * ---------------------------------------------------------------------------
 * Displays the most recent candidate applications in a styled table card.
 *
 * Props:
 *   candidates — Optional array of candidate objects. Falls back to built-in
 *                placeholder data when omitted, making the component ready
 *                for future API integration.
 *
 * Each candidate object shape:
 *   { id, name, position, stage, rating, appliedDate }
 *
 * Stage values mapped to badge classes:
 *   'Screening'  → .status-screening
 *   'Interview'  → .status-interview
 *   'Hired'      → .status-hired
 *   'Rejected'   → .status-closed
 *   'Offered'    → .status-offered
 *   'New'        → .status-new
 */

/* ── Placeholder data ─────────────────────────────────────────────────── */

const PLACEHOLDER_CANDIDATES = [
  {
    id: 1,
    name: 'Alice Johnson',
    position: 'Senior React Developer',
    stage: 'Interview',
    rating: 4,
    appliedDate: '2026-07-11',
  },
  {
    id: 2,
    name: 'Brian Lee',
    position: 'Product Designer',
    stage: 'Screening',
    rating: 3,
    appliedDate: '2026-07-09',
  },
  {
    id: 3,
    name: 'Catherine Diaz',
    position: 'DevOps Engineer',
    stage: 'Hired',
    rating: 5,
    appliedDate: '2026-06-28',
  },
  {
    id: 4,
    name: 'David Kim',
    position: 'Marketing Manager',
    stage: 'New',
    rating: 0,
    appliedDate: '2026-07-13',
  },
  {
    id: 5,
    name: 'Eva Martinez',
    position: 'Data Analyst',
    stage: 'Rejected',
    rating: 2,
    appliedDate: '2026-07-05',
  },
];

/* ── Stage → CSS class mapping ────────────────────────────────────────── */

const STAGE_CLASS_MAP = {
  Screening: 'status-screening',
  Interview: 'status-interview',
  Hired: 'status-hired',
  Rejected: 'status-closed',
  Offered: 'status-offered',
  New: 'status-new',
};

/* ── Helper: format ISO date to readable string ───────────────────────── */

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── Helper: render star rating ───────────────────────────────────────── */

function StarRating({ rating, max = 5 }) {
  return (
    <span
      className="star-rating"
      style={{ display: 'inline-flex', gap: '2px' }}
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? 'var(--color-warning)' : 'none'}
          stroke={i < rating ? 'var(--color-warning)' : 'var(--color-text-muted)'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

/* ── RecentCandidatesTable component ──────────────────────────────────── */

function RecentCandidatesTable({ candidates }) {
  const data = candidates || PLACEHOLDER_CANDIDATES;

  return (
    <div className="data-table-card" id="recent-candidates-table">
      {/* ── Card header ─────────────────────────────────────────────── */}
      <div className="data-table-header">
        <h3 className="data-table-title">Recent Candidates</h3>
        <span className="data-table-badge">{data.length} candidates</span>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Position</th>
            <th>Stage</th>
            <th>Rating</th>
            <th>Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((candidate) => (
            <tr key={candidate.id}>
              <td style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
                {candidate.name}
              </td>
              <td>{candidate.position}</td>
              <td>
                <span
                  className={`status-badge ${STAGE_CLASS_MAP[candidate.stage] || 'status-new'}`}
                >
                  {candidate.stage}
                </span>
              </td>
              <td>
                <StarRating rating={candidate.rating} />
              </td>
              <td>{formatDate(candidate.appliedDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentCandidatesTable;
