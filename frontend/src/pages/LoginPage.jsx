/**
 * LoginPage.jsx
 * ---------------------------------------------------------------------------
 * Full-screen login page with glassmorphic card and gradient mesh panel.
 *
 * Features:
 *   – Email + password form with field-level validation feedback.
 *   – Show/hide password toggle.
 *   – "Remember me" is not needed — the refresh cookie handles persistence.
 *   – Redirects to the page the user originally tried to visit (from state).
 *   – Link to Register page.
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/common/Spinner.jsx';
import '../styles/auth.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after successful login
  const from = location.state?.from?.pathname || '/dashboard';

  // ── Form state ────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Login failed. Please check your credentials.';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="auth-page">
      {/* ── Decorative panel ──────────────────────────────────────────── */}
      <div className="auth-panel">
        <div className="auth-panel__mesh" />
        <div className="auth-panel__content animate-fadeIn">
          <h1 className="auth-panel__logo">HireTrack</h1>
          <p className="auth-panel__tagline">
            Streamline your hiring pipeline.<br />
            Manage candidates, schedule interviews, and hire the best talent — all in one place.
          </p>
        </div>
      </div>

      {/* ── Form section ─────────────────────────────────────────────── */}
      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-card__mobile-logo">HireTrack</div>

          <div className="auth-card__header">
            <h2 className="auth-card__title">Welcome back</h2>
            <p className="auth-card__subtitle">
              Sign in to your account to continue
            </p>
          </div>

          {/* Registration success banner */}
          {location.state?.registered && (
            <div className="auth-alert auth-alert--success" role="status" id="register-success">
              Account created successfully! Sign in to continue.
            </div>
          )}

          {/* API-level error banner */}
          {apiError && (
            <div className="auth-alert auth-alert--error" role="alert" id="login-error">
              {apiError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email"
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                type="email"
                name="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="field-error" role="alert">
                {errors.email || ''}
              </span>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="login-password"
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              <span className="field-error" role="alert">
                {errors.password || ''}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-btn"
              disabled={isSubmitting}
              id="login-submit"
            >
              <span className="auth-btn__content">
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" /> Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </span>
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-footer">
            Don&apos;t have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
