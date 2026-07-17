/**
 * StatCard.jsx
 * ---------------------------------------------------------------------------
 * Reusable statistic card for dashboard metric displays.
 *
 * Props:
 *   title        — Label text (e.g. "Total Jobs").
 *   value        — Numeric or string value to display prominently.
 *   icon         — React node (SVG element or component) rendered in the
 *                  colored icon box.
 *   colorVariant — 'violet' | 'cyan' | 'success' | 'warning'
 *                  Controls the accent bar and icon background tint.
 *   trend        — Optional object { value: string, isPositive: boolean }
 *                  Renders a small trend indicator below the value.
 *
 * All visual styles come from dashboard.css — this component only maps
 * props to the correct CSS class names.
 */

/* ── Trend arrow icons ────────────────────────────────────────────────── */

function TrendUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

/* ── StatCard component ───────────────────────────────────────────────── */

function StatCard({ title, value, icon, colorVariant = 'violet', trend }) {
  return (
    <div className={`stat-card variant-${colorVariant}`}>
      {/* ── Header: icon box + label ──────────────────────────────── */}
      <div className="stat-card-header">
        <span className="stat-card-label">{title}</span>
        <div className={`stat-card-icon icon-${colorVariant}`} aria-hidden="true">
          {icon}
        </div>
      </div>

      {/* ── Value ─────────────────────────────────────────────────── */}
      <div className="stat-card-value">{value}</div>

      {/* ── Optional trend indicator ──────────────────────────────── */}
      {trend && (
        <div
          className="stat-card-trend"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            color: trend.isPositive
              ? 'var(--color-success)'
              : 'var(--color-error)',
          }}
        >
          {trend.isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
