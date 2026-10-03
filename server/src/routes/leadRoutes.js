const express = require('express');
const router = express.Router();
const {
  createLead,
  trackGuestLead,
  getCustomerLeads,
  getLeadById,
  cancelLead
} = require('../controllers/leadController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/constants');

// Public / Guest
router.post('/', optionalAuth, upload.array('referenceImages', 5), createLead);
router.post('/guest-track', trackGuestLead);

// Customer Protected
router.get('/my-leads', protect, authorize(ROLES.CUSTOMER), getCustomerLeads);
router.get('/:id', protect, getLeadById);
router.put('/:id/cancel', protect, authorize(ROLES.CUSTOMER, ROLES.ADMIN), cancelLead);

module.exports = router;
