/**
 * @file src/services/candidate.service.js
 * @description Business logic for Candidate CRUD.
 */

import Candidate from '../models/Candidate.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create Candidate
 */
export async function createCandidate(data) {
    const candidate = await Candidate.create(data);
    return candidate.toJSON();
}

/**
 * Get All Candidates
 */
export async function getAllCandidates(filters = {}) {
    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.appliedJob) {
        query.appliedJob = filters.appliedJob;
    }

    if (filters.createdBy) {
        query.createdBy = filters.createdBy;
    }

    return Candidate.find(query)
        .populate('appliedJob', 'title department')
        .sort({ createdAt: -1 })
        .lean();
}

/**
 * Get Candidate By ID
 */
export async function getCandidateById(candidateId) {
    const candidate = await Candidate.findById(candidateId)
        .populate('appliedJob', 'title department')
        .lean();

    if (!candidate) {
        throw ApiError.notFound(
            'Candidate not found',
            'CANDIDATE_NOT_FOUND'
        );
    }

    return candidate;
}

/**
 * Update Candidate
 */
export async function updateCandidate(candidateId, data) {
    const candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        data,
        {
            new: true,
            runValidators: true,
        }
    ).lean();

    if (!candidate) {
        throw ApiError.notFound(
            'Candidate not found',
            'CANDIDATE_NOT_FOUND'
        );
    }

    return candidate;
}

/**
 * Delete Candidate
 */
export async function deleteCandidate(candidateId) {
    const candidate = await Candidate.findByIdAndDelete(candidateId).lean();

    if (!candidate) {
        throw ApiError.notFound(
            'Candidate not found',
            'CANDIDATE_NOT_FOUND'
        );
    }

    return candidate;
}