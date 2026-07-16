/**
 * constants.js
 * ---------------------------------------------------------------------------
 * Application-wide constants for HireTrack ATS.
 *
 * Centralises magic strings / numbers so they can be imported anywhere and
 * changed in a single place.
 */

/** Base URL used by the Axios instance (proxied by Vite in dev) */
export const API_BASE_URL = '/api';

/** User role enum */
export const ROLES = Object.freeze({
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  HIRING_MANAGER: 'hiring_manager',
  INTERVIEWER: 'interviewer',
});

/** Default hiring-pipeline stages */
export const PIPELINE_STAGES = Object.freeze([
  'Applied',
  'Phone Screen',
  'Technical Interview',
  'On-site',
  'Offer',
  'Hired',
  'Rejected',
]);

/** Pagination defaults */
export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

/** Toast auto-dismiss duration (ms) */
export const TOAST_DURATION = 4000;
