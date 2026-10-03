const mongoose = require('mongoose');
const { CITIES } = require('../config/constants');

const serviceAreaSchema = new mongoose.Schema({
  city: {
    type: String,
    enum: CITIES,
    required: true
  },
  sector: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

serviceAreaSchema.index({ city: 1, sector: 1 }, { unique: true });

module.exports = mongoose.models.ServiceArea || mongoose.model('ServiceArea', serviceAreaSchema);
