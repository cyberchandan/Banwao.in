const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  // Header & Brand
  siteName: {
    type: String,
    default: 'Banwao'
  },
  siteTagline: {
    type: String,
    default: 'Noida & Greater Noida'
  },
  logoImageUrl: {
    type: String,
    default: ''
  },
  announcementText: {
    type: String,
    default: '🚀 Get Instant Free Quotations & Matched Local Contractors in Noida & Greater Noida!'
  },
  isAnnouncementVisible: {
    type: Boolean,
    default: true
  },
  announcementLink: {
    type: String,
    default: '/get-quotes'
  },

  // Contact Info
  contactPhone: {
    type: String,
    default: '+91 98765 43210'
  },
  whatsappPhone: {
    type: String,
    default: '+91 98765 43210'
  },
  supportEmail: {
    type: String,
    default: 'support@banwao.in'
  },
  officeAddress: {
    type: String,
    default: 'Sector 62, Noida, Uttar Pradesh - 201309'
  },

  // Hero Section
  heroBadgeText: {
    type: String,
    default: 'Noida & Greater Noida’s Trusted Home Marketplace'
  },
  heroHeadline: {
    type: String,
    default: 'Ghar banana ho ya sajana, sahi logon se Banwao!'
  },
  heroHeadlineColor: {
    type: String,
    default: '#ffffff'
  },
  heroHeadlineAccentColor: {
    type: String,
    default: '#f59e0b' // Gold / Accent Color
  },
  heroHeadlineFontSize: {
    type: String,
    default: 'xlarge' // 'normal' | 'large' | 'xlarge' | 'huge' | 'massive'
  },
  heroSubheadline: {
    type: String,
    default: 'Connect with verified local contractors for new house construction, builder floors, full home renovation, painting, plumbing, electrical, and waterproofing.'
  },
  heroImageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop'
  },
  heroCardTitle: {
    type: String,
    default: 'Independent Floor Construction'
  },
  heroCardSubtitle: {
    type: String,
    default: 'Sector 50, Noida • Turnkey Contract'
  },
  heroStat1Number: {
    type: String,
    default: '100%'
  },
  heroStat1Label: {
    type: String,
    default: 'Free Quotations'
  },
  heroStat2Number: {
    type: String,
    default: '12+'
  },
  heroStat2Label: {
    type: String,
    default: 'Service Categories'
  },
  heroStat3Number: {
    type: String,
    default: 'Verified'
  },
  heroStat3Label: {
    type: String,
    default: 'Local Contractors'
  },

  // Footer & Social Links
  footerDescription: {
    type: String,
    default: "Noida & Greater Noida's leading marketplace connecting homeowners with verified local construction contractors."
  },
  footerCopyright: {
    type: String,
    default: '© 2026 Banwao. All rights reserved.'
  },
  socialFacebook: {
    type: String,
    default: ''
  },
  socialInstagram: {
    type: String,
    default: ''
  },
  socialLinkedin: {
    type: String,
    default: ''
  },
  socialTwitter: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema);
