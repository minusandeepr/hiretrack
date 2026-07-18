/**
 * @file src/controllers/job.controller.js
 * @description Controller for Job CRUD operations.
 *   Controllers handle HTTP requests/responses only.
 *   Business logic lives inside job.service.js.
 */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

import {
  createJob as createJobService,
  getAllJobs as getAllJobsService,
  getJobById as getJobByIdService,
  updateJob as updateJobService,
  deleteJob as deleteJobService,
} from '../services/job.service.js';

/**
 * Create a new job.
 */
export const createJob = asyncHandler(async (req, res) => {
  const job = await createJobService({
    ...req.body,
    createdBy: req.user.id,
  });

  return ApiResponse.success(
    res,
    job,
    'Job created successfully',
    201
  );
});

/**
 * Get all jobs.
 */
export const getAllJobs = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    department: req.query.department,
    createdBy: req.query.createdBy,
  };

  const jobs = await getAllJobsService(filters);

  return ApiResponse.success(
    res,
    jobs,
    'Jobs fetched successfully'
  );
});

/**
 * Get a single job by ID.
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await getJobByIdService(req.params.id);

  return ApiResponse.success(
    res,
    job,
    'Job fetched successfully'
  );
});

/**
 * Update a job.
 */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await updateJobService(
    req.params.id,
    req.body
  );

  return ApiResponse.success(
    res,
    job,
    'Job updated successfully'
  );
});

/**
 * Delete a job.
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await deleteJobService(req.params.id);

  return ApiResponse.success(
    res,
    job,
    'Job deleted successfully'
  );
});