/**
 * @file src/models/Job.model.js
 * @description Mongoose schema and model for the `jobs` collection.
 *
 *   Represents a job posting within the ATS. Each job is associated with
 *   a creating user (recruiter or admin) via the `createdBy` reference.
 *
 *   Indexes:
 *   - status     — filter jobs by Open / Closed / Draft
 *   - department — filter / group jobs by department
 *   - createdBy  — fetch all jobs created by a specific user
 */

import mongoose from 'mongoose';

// ── Schema definition ───────────────────────────────────────────────────────
const jobSchema = new mongoose.Schema(
  {
    /** Job title displayed in listings and on the job detail page. */
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [120, 'Job title must be at most 120 characters'],
    },

    /** Department or team this role belongs to. */
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },

    /** Office location or geographic region for the role. */
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    /** Type of employment offered. */
    employmentType: {
      type: String,
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        message: 'Employment type must be Full-time, Part-time, Contract, Internship, or Remote',
      },
      default: 'Full-time',
    },

    /** Minimum salary for the position (used for range display). */
    salaryMin: {
      type: Number,
      default: 0,
    },

    /** Maximum salary for the position (used for range display). */
    salaryMax: {
      type: Number,
      default: 0,
    },

    /** Full job description (rich text / markdown content). */
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },

    /** List of skills, qualifications, or experience requirements. */
    requirements: {
      type: [String],
      default: [],
    },

    /** Publishing status of the job posting. */
    status: {
      type: String,
      enum: {
        values: ['Open', 'Closed', 'Draft'],
        message: 'Status must be Open, Closed, or Draft',
      },
      default: 'Open',
    },

    /** Reference to the user who created this job posting. */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required'],
    },
  },
  {
    /** Automatically adds createdAt and updatedAt fields. */
    timestamps: true,

    /**
     * Strip internal fields when converting to JSON for API responses.
     */
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// ── Indexes ─────────────────────────────────────────────────────────────────
jobSchema.index({ status: 1 });
jobSchema.index({ department: 1 });
jobSchema.index({ createdBy: 1 });

// ── Model export ────────────────────────────────────────────────────────────
const Job = mongoose.model('Job', jobSchema);

export default Job;
