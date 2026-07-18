/**
 * @file src/services/job.service.js
 * @description Business logic for job postings.
 *
 *   Handles CRUD operations for the Job model. Controllers delegate to this
 *   service; the service never touches req/res directly.
 *
 *   Read operations use `.lean()` for performance since the returned
 *   documents don't need Mongoose instance methods.
 */

import Job from '../models/Job.model.js';
import ApiError from '../utils/ApiError.js';

// ── Service methods ─────────────────────────────────────────────────────────

/**
 * Create a new job posting.
 *
 * @param {object} data — Job fields (title, department, location, etc.)
 *                        Must include `createdBy` (the user's ObjectId).
 * @returns {Promise<object>} The created job document.
 */
export async function createJob(data) {
  const job = await Job.create(data);
  return job.toJSON();
}

/**
 * Retrieve all job postings, optionally filtered.
 *
 * Supported filters (all optional):
 *   - status       — 'Open' | 'Closed' | 'Draft'
 *   - department   — exact department name
 *   - createdBy    — ObjectId of the creating user
 *
 * Results are sorted by createdAt descending (newest first).
 *
 * @param {object} [filters={}]
 * @returns {Promise<object[]>} Array of job documents.
 */
export async function getAllJobs(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.department) {
    query.department = filters.department;
  }

  if (filters.createdBy) {
    query.createdBy = filters.createdBy;
  }

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return jobs;
}

/**
 * Retrieve a single job posting by its ID.
 *
 * @param {string} jobId — The job's ObjectId.
 * @returns {Promise<object>} The job document.
 * @throws {ApiError} 404 if the job does not exist.
 */
export async function getJobById(jobId) {
  const job = await Job.findById(jobId).lean();

  if (!job) {
    throw ApiError.notFound('Job not found', 'JOB_NOT_FOUND');
  }

  return job;
}

/**
 * Update an existing job posting.
 *
 * Uses `findByIdAndUpdate` with `{ new: true, runValidators: true }` so
 * Mongoose schema validations are re-applied and the updated document is
 * returned.
 *
 * @param {string} jobId — The job's ObjectId.
 * @param {object} data  — Fields to update.
 * @returns {Promise<object>} The updated job document.
 * @throws {ApiError} 404 if the job does not exist.
 */
export async function updateJob(jobId, data) {
  const job = await Job.findByIdAndUpdate(jobId, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!job) {
    throw ApiError.notFound('Job not found', 'JOB_NOT_FOUND');
  }

  return job;
}

/**
 * Delete a job posting by its ID.
 *
 * @param {string} jobId — The job's ObjectId.
 * @returns {Promise<object>} The deleted job document.
 * @throws {ApiError} 404 if the job does not exist.
 */
export async function deleteJob(jobId) {
  const job = await Job.findByIdAndDelete(jobId).lean();

  if (!job) {
    throw ApiError.notFound('Job not found', 'JOB_NOT_FOUND');
  }

  return job;
}
