import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

import Job from '../models/Job.model.js';
import Candidate from '../models/Candidate.model.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [
        totalJobs,
        totalCandidates,
        applied,
        screening,
        interview,
        selected,
        rejected,
    ] = await Promise.all([
        Job.countDocuments({ createdBy: userId }),
        Candidate.countDocuments({ createdBy: userId }),
        Candidate.countDocuments({
            createdBy: userId,
            status: 'Applied',
        }),
        Candidate.countDocuments({
            createdBy: userId,
            status: 'Screening',
        }),
        Candidate.countDocuments({
            createdBy: userId,
            status: 'Interview',
        }),
        Candidate.countDocuments({
            createdBy: userId,
            status: 'Selected',
        }),
        Candidate.countDocuments({
            createdBy: userId,
            status: 'Rejected',
        }),
    ]);

    return ApiResponse.success(
        res,
        {
            totalJobs,
            totalCandidates,
            applied,
            screening,
            interview,
            selected,
            rejected,
        },
        'Dashboard statistics fetched successfully'
    );
});