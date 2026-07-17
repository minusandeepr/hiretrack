/**
 * InterviewsTable.jsx
 * ---------------------------------------------------------------------------
 * Displays scheduled interviews in a styled table card.
 *
 * Props:
 *   interviews — Optional array of interview objects. Falls back to built-in
 *                placeholder data when omitted, making the component ready
 *                for future API integration.
 *
 * Each interview object shape:
 *   { id, candidate, position, interviewer, date, time, status }
 *
 * Status values mapped to badge classes:
 *   'Scheduled'  → .status-interview
 *   'Completed'  → .status-hired
 *   'Cancelled'  → .status-closed
 *   'In Progress' → .status-screening
 *   'Pending'    → .status-offered
 */

/* ── Placeholder data ─────────────────────────────────────────────────── */

const PLACEHOLDER_INTERVIEWS = [
  {
    id: 1,
    candidate: 'Alice Johnson',
    position: 'Senior React Developer',
    interviewer: 'Sarah Chen',
    date: '2026-07-18',
    time: '10:00 AM',
    status: 'Scheduled',
  },
  {
    id: 2,
    candidate: 'Brian Lee',
    position: 'Product Designer',
    interviewer: 'Mark Rivera',
    date: '2026-07-18',
    time: '2:30 PM',
    status: 'Scheduled',
  },
  {
    id: 3,
    candidate: 'Catherine Diaz',
    position: 'DevOps Engineer',
    interviewer: 'James Patel',
    date: '2026-07-16',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: 4,
    candidate: 'David Kim',
    position: 'Marketing Manager',
    interviewer: 'Lisa Nguyen',
    date: '2026-07-19',
    time: '9:00 AM',
    status: 'Pending',
  },
  {
    id: 5,
    candidate: 'Eva Martinez',
    position: 'Data Analyst',
    interviewer: 'Sarah Chen',
    date: '2026-07-15',
    time: '3:00 PM',
    status: 'Cancelled',
  },
];

/* ── Status → CSS class mapping ───────────────────────────────────────── */

const STATUS_CLASS_MAP = {
  Scheduled: 'status-interview',
  Completed: 'status-hired',
  Cancelled: 'status-closed',
  'In Progress': 'status-screening',
  Pending: 'status-offered',
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

/* ── InterviewsTable component ────────────────────────────────────────── */

function InterviewsTable({ interviews }) {
  const data = interviews || PLACEHOLDER_INTERVIEWS;

  return (
    <div className="data-table-card" id="interviews-table">
      {/* Card header */}
      <div className="data-table-header">
        <h3 className="data-table-title">Interviews</h3>
        <span className="data-table-badge">{data.length} scheduled</span>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Position</th>
            <th>Interviewer</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((interview) => (
            <tr key={interview.id}>
              <td style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-medium)' }}>
                {interview.candidate}
              </td>
              <td>{interview.position}</td>
              <td>{interview.interviewer}</td>
              <td>{formatDate(interview.date)}</td>
              <td>{interview.time}</td>
              <td>
                <span className={`status-badge ${STATUS_CLASS_MAP[interview.status] || 'status-interview'}`}>
                  {interview.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterviewsTable;
