const express = require('express');
const router = express.Router();
const { submitReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { ROLES } = require('../config/constants');

router.post('/', protect, authorize(ROLES.CUSTOMER), submitReview);

module.exports = router;
