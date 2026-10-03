const mongoose = require('mongoose');
const { ASSIGNMENT_STATUS } = require('../config/constants');

const leadAssignmentSchema = new mongoose.Schema({
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
  matchReason: {
    type: String,
    required: true
  },
  assignedBy: {
    type: String,
    enum: ['auto', 'admin'],
    default: 'auto'
  },
  status: {
    type: String,
    enum: Object.values(ASSIGNMENT_STATUS),
    default: ASSIGNMENT_STATUS.NOTIFIED
  },
  assignedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

leadAssignmentSchema.index({ leadId: 1, contractorId: 1 }, { unique: true });
leadAssignmentSchema.index({ contractorId: 1 });

module.exports = mongoose.models.LeadAssignment || mongoose.model('LeadAssignment', leadAssignmentSchema);
