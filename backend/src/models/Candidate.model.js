import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: Number,
            default: 0,
            min: 0,
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        status: {
            type: String,
            enum: ['Applied', 'Screening', 'Interview', 'Selected', 'Rejected'],
            default: 'Applied',
        },

        resumeUrl: {
            type: String,
            default: '',
        },

        appliedJob: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

candidateSchema.set('toJSON', {
    versionKey: false,
});

candidateSchema.set('toObject', {
    versionKey: false,
});

export default mongoose.model('Candidate', candidateSchema);