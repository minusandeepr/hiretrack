/**
 * @file src/controllers/candidate.controller.js
 * @description Controller for Candidate CRUD operations.
 */

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

import {
    createCandidate as createCandidateService,
    getAllCandidates as getAllCandidatesService,
    getCandidateById as getCandidateByIdService,
    updateCandidate as updateCandidateService,
    deleteCandidate as deleteCandidateService,
} from '../services/candidate.service.js';

/**
 * Create Candidate
 */
export const createCandidate = asyncHandler(async (req, res) => {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const candidate = await createCandidateService({
        ...req.body,
        resumeUrl: req.file
            ? req.file.path.replace(/\\/g, '/')
            : '',
        createdBy: req.user.id,
    });

    return ApiResponse.success(
        res,
        candidate,
        'Candidate created successfully',
        201
    );
});

/**
 * Get All Candidates
 */
export const getAllCandidates = asyncHandler(async (req, res) => {
    const filters = {
        status: req.query.status,
        appliedJob: req.query.appliedJob,
        createdBy: req.query.createdBy,
    };

    const candidates = await getAllCandidatesService(filters);

    return ApiResponse.success(
        res,
        candidates,
        'Candidates fetched successfully'
    );
});

/**
 * Get Candidate By ID
 */
export const getCandidateById = asyncHandler(async (req, res) => {
    const candidate = await getCandidateByIdService(req.params.id);

    return ApiResponse.success(
        res,
        candidate,
        'Candidate fetched successfully'
    );
});

/**
 * Update Candidate
 */
export const updateCandidate = asyncHandler(async (req, res) => {
    const candidate = await updateCandidateService(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        candidate,
        'Candidate updated successfully'
    );
});

/**
 * Delete Candidate
 */
export const deleteCandidate = asyncHandler(async (req, res) => {
    const candidate = await deleteCandidateService(req.params.id);

    return ApiResponse.success(
        res,
        candidate,
        'Candidate deleted successfully'
    );
});