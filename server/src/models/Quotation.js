const mongoose = require('mongoose');
const { QUOTATION_STATUS } = require('../config/constants');

const quotationSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContractorProfile',
    required: true
  },
  labourCost: {
    type: Number,
    required: [true, 'Labour cost is required'],
    min: 0
  },
  materialCost: {
    type: Number,
    default: 0,
    min: 0
  },
  otherCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  scopeDetails: {
    type: String,
    required: [true, 'Scope details are required'],
    trim: true
  },
  exclusions: {
    type: String,
    trim: true
  },
  validityDays: {
    type: Number,
    default: 30,
    min: 1
  },
  estimatedTimeline: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(QUOTATION_STATUS),
    default: QUOTATION_STATUS.SUBMITTED
  }
}, {
  timestamps: true
});

quotationSchema.index({ leadId: 1, contractorId: 1 }, { unique: true });
quotationSchema.index({ contractorId: 1 });

module.exports = mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema);
