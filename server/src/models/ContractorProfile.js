const mongoose = require('mongoose');
const { CONTRACTOR_STATUS } = require('../config/constants');

const contractorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  experienceYears: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  skills: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory'
  }],
  serviceAreas: [{
    type: String, // e.g. "Noida Sector 62", "Greater Noida West", "Noida All", etc.
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  portfolioImages: [{
    title: String,
    url: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  verificationStatus: {
    type: String,
    enum: Object.values(CONTRACTOR_STATUS),
    default: CONTRACTOR_STATUS.PENDING
  },
  isVerifiedBadge: {
    type: Boolean,
    default: false
  },
  ratingAvg: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  completedProjectsCount: {
    type: Number,
    default: 0
  },
  adminNotes: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

contractorProfileSchema.index({ verificationStatus: 1 });
contractorProfileSchema.index({ categories: 1 });
contractorProfileSchema.index({ serviceAreas: 1 });

module.exports = mongoose.models.ContractorProfile || mongoose.model('ContractorProfile', contractorProfileSchema);
