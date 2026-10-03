const express = require('express');
const router = express.Router();
const {
  getPublicDirectory,
  getPublicProfile,
  getContractorDashboard,
  updateContractorProfile,
  addPortfolioImage
} = require('../controllers/contractorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/constants');

// Public
router.get('/', getPublicDirectory);
router.get('/:id', getPublicProfile);

// Portal Protected (Contractor)
router.get('/portal/dashboard', protect, authorize(ROLES.CONTRACTOR), getContractorDashboard);
router.put('/portal/profile', protect, authorize(ROLES.CONTRACTOR), updateContractorProfile);
router.post('/portal/portfolio', protect, authorize(ROLES.CONTRACTOR), upload.single('image'), addPortfolioImage);

module.exports = router;
