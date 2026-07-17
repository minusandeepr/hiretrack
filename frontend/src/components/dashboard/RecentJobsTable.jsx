/**
 * RecentJobsTable.jsx
 * ---------------------------------------------------------------------------
 * Displays the most recent job postings in a styled table card.
 *
 * Props:
 *   jobs — Optional array of job objects. Falls back to built-in placeholder
 *          data when omitted, making the component ready for future API
 *          integration (just pass the fetched array).
 *
 * Each job object shape:
 *   { id, title, department, status, applications, postedDate }
 *
 * Status values mapped to badge classes:
 *   'Open'   → .status-open
 *   'Closed' → .status-closed
 *   'Draft'  → .status-screening  (reuses the violet badge style)
 */

/* ── Placeholder data ─────────────────────────────────────────────────── */

const PLACEHOLDER_JOBS = [
  {
    id: 1,
    title: 'Senior React Developer',
    department: 'Engineering',
    status: 'Open',
    applications: 34,
    postedDate: '2026-07-10',
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    status: 'Open',
    applications: 21,
    postedDate: '2026-07-08',
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    status: 'Closed',
    applications: 47,
    postedDate: '2026-06-25',
  },
  {
    id: 4,
    title: 'Marketing Manager',
    department: 'Marketing',
    status: 'Open',
    applications: 12,
    postedDate: '2026-07-12',
  },
  {
    id: 5,
    title: 'Data Analyst',
    department: 'Analytics',
    status: 'Draft',
    applications: 0,
    postedDate: '2026-07-14',
  },
];

/* ── Status → CSS class mapping ───────────────────────────────────────── */

const STATUS_CLASS_MAP = {
  Open: 'status-open',
  Closed: 'status-closed',
  Draft: 'status-screening',
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

/* ── RecentJobsTable component ────────────────────────────────────────── */

function RecentJobsTable({ jobs }) {
  const data = jobs || PLACEHOLDER_JOBS;

  return (
    <div className="data-table-card" id="recent-jobs-table">
      {/* ── Card header ─────────────────────────────────────────────── */}
      <div className="data-table-header">
        <h3 className="data-table-title">Recent Jobs</h3>
        <span className="data-table-badge">{data.length} jobs</span>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Department</th>
            <th>Status</th>
            <th>Applications</th>
            <th>Posted Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((job) => (
            <tr key={job.id}>
              <td style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
                {job.title}
              </td>
              <td>{job.department}</td>
              <td>
                <span className={`status-badge ${STATUS_CLASS_MAP[job.status] || 'status-open'}`}>
                  {job.status}
                </span>
              </td>
              <td>{job.applications}</td>
              <td>{formatDate(job.postedDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentJobsTable;
