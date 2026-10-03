const mongoose = require('mongoose');
const { CITIES } = require('../config/constants');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true
  },
  location: {
    city: { type: String, enum: CITIES, required: true },
    sector: { type: String, required: true, trim: true }
  },
  images: [{
    url: { type: String, required: true },
    caption: String
  }],
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContractorProfile'
  },
  completionDate: {
    type: String
  },
  builtUpArea: {
    type: Number
  },
  estimatedCostRange: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

projectSchema.index({ categoryId: 1 });
projectSchema.index({ contractorId: 1 });

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
