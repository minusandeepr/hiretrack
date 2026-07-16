/**
 * RegisterPage.jsx
 * ---------------------------------------------------------------------------
 * Full-screen registration page matching the Login page design.
 *
 * Features:
 *   – Name, email, password, and confirm-password fields.
 *   – Real-time password strength / policy indicator.
 *   – Show/hide password toggle.
 *   – Client-side validation mirroring backend rules.
 *   – On success, redirects to /login with a success banner.
 *   – Link to Login page.
 */

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/common/Spinner.jsx';
import '../styles/auth.css';

// ── Password policy checks ──────────────────────────────────────────────────

const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'digit', label: 'One number', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'One special character', test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // ── Form state ────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Derived: which password rules pass ─────────────────────────────────
  const passwordStatus = useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        ...rule,
        met: rule.test(formData.password),
      })),
    [formData.password],
  );

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password — all policy rules must pass
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failing = passwordStatus.find((r) => !r.met);
      if (failing) {
        newErrors.password = `Password must have: ${failing.label.toLowerCase()}`;
      }
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      // Redirect to login with a success message
      navigate('/login', {
        state: { registered: true },
        replace: true,
      });
    } catch (err) {
      const data = err.response?.data;
      // Handle validation errors array from the backend
      if (data?.errors?.length) {
        const fieldErrors = {};
        data.errors.forEach(({ field, message }) => {
          fieldErrors[field] = message;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      } else {
        setApiError(data?.message || 'Registration failed. Please try again.');
      }
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
            Join your team on HireTrack.<br />
            Create your account to start managing candidates and building your pipeline.
          </p>
        </div>
      </div>

      {/* ── Form section ─────────────────────────────────────────────── */}
      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-card__mobile-logo">HireTrack</div>

          <div className="auth-card__header">
            <h2 className="auth-card__title">Create your account</h2>
            <p className="auth-card__subtitle">
              Fill in your details to get started
            </p>
          </div>

          {/* API-level error banner */}
          {apiError && (
            <div className="auth-alert auth-alert--error" role="alert" id="register-error">
              {apiError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">
                Full name
              </label>
              <input
                id="register-name"
                className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                type="text"
                name="name"
                placeholder="Jane Smith"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="field-error" role="alert">
                {errors.name || ''}
              </span>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-email">
                Email address
              </label>
              <input
                id="register-email"
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
              <label className="form-label" htmlFor="register-password">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="register-password"
                  className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
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

              {/* Password requirements checklist */}
              {formData.password.length > 0 && (
                <div className="password-requirements">
                  {passwordStatus.map((rule) => (
                    <span
                      key={rule.key}
                      className={`password-req ${rule.met ? 'password-req--met' : ''}`}
                    >
                      <span className="password-req__icon">{rule.met ? '✓' : '○'}</span>
                      {rule.label}
                    </span>
                  ))}
                </div>
              )}

              <span className="field-error" role="alert">
                {errors.password || ''}
              </span>
            </div>

            {/* Confirm password */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">
                Confirm password
              </label>
              <div className="password-wrapper">
                <input
                  id="register-confirm"
                  className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirm ? '🙈' : '👁'}
                </button>
              </div>
              <span className="field-error" role="alert">
                {errors.confirmPassword || ''}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-btn"
              disabled={isSubmitting}
              id="register-submit"
            >
              <span className="auth-btn__content">
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" /> Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </span>
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
