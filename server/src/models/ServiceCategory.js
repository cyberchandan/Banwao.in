const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'Wrench'
  },
  shortDesc: {
    type: String,
    required: true
  },
  fullDesc: {
    type: String
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.ServiceCategory || mongoose.model('ServiceCategory', serviceCategorySchema);
