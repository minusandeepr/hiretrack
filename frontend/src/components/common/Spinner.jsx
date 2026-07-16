/**
 * Spinner.jsx
 * ---------------------------------------------------------------------------
 * Reusable loading spinner with the accent gradient.
 *
 * Props:
 *   size  — 'sm' | 'md' | 'lg'  (default: 'md')
 *   text  — Optional loading text shown below the spinner.
 */

import './Spinner.css';

const SIZES = { sm: 20, md: 36, lg: 56 };

function Spinner({ size = 'md', text }) {
  const dim = SIZES[size] || SIZES.md;

  return (
    <div className="spinner-wrapper" role="status" aria-label="Loading">
      <svg
        className="spinner-svg animate-spin"
        width={dim}
        height={dim}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="spinner-track"
          cx="25"
          cy="25"
          r="20"
          strokeWidth="4"
        />
        <circle
          className="spinner-arc"
          cx="25"
          cy="25"
          r="20"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

export default Spinner;
