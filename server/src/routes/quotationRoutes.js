const express = require('express');
const router = express.Router();
const { submitQuotation, compareQuotations, selectQuotation } = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { ROLES } = require('../config/constants');

router.post('/', protect, authorize(ROLES.CONTRACTOR), submitQuotation);
router.get('/compare/:leadId', compareQuotations);
router.post('/select', protect, authorize(ROLES.CUSTOMER, ROLES.ADMIN), selectQuotation);

module.exports = router;
