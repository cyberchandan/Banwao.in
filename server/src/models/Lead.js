const mongoose = require('mongoose');
const { LEAD_STATUS, PROPERTY_TYPES, WORK_TYPES, CONSTRUCTION_TYPES, CITIES } = require('../config/constants');

const leadSchema = new mongoose.Schema({
  referenceNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    accessCode: { type: String, select: false },
    accessExpiresAt: { type: Date }
  },
  serviceCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true
  },
  propertyType: {
    type: String,
    enum: PROPERTY_TYPES,
    required: true
  },
  workType: {
    type: String,
    enum: WORK_TYPES,
    required: true
  },
  location: {
    city: { type: String, enum: CITIES, required: true },
    sector: { type: String, required: true, trim: true },
    address: { type: String, trim: true }
  },
  builtUpArea: {
    type: Number,
    min: 0
  },
  budgetRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  constructionType: {
    type: String,
    enum: CONSTRUCTION_TYPES,
    default: 'material_and_labour'
  },
  desiredStartDate: {
    type: String
  },
  expectedTimeline: {
    type: String
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  referenceImages: [{
    type: String
  }],
  preferredContactMethod: {
    type: String,
    enum: ['phone', 'email', 'whatsapp'],
    default: 'phone'
  },
  status: {
    type: String,
    enum: Object.values(LEAD_STATUS),
    default: LEAD_STATUS.NEW
  },
  selectedContractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContractorProfile',
    default: null
  },
  selectedQuotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
    default: null
  },
  followUpDate: {
    type: Date
  },
  adminNotes: {
    type: String
  },
  statusHistory: [{
    status: { type: String, enum: Object.values(LEAD_STATUS) },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

leadSchema.index({ customerId: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ 'location.city': 1, 'location.sector': 1 });

module.exports = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
