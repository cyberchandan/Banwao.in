const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAdminDashboardMetrics,
  getAdminLeads,
  getAdminLeadQuotations,
  updateLeadStatus,
  manuallyAssignContractor,
  broadcastAssignLeadToAllContractors,
  getAdminContractors,
  updateContractorVerification,
  toggleUserBlockStatus,
  moderateReview,
  exportCSV
} = require('../controllers/adminController');
const {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllServiceAreasAdmin,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
  updateSiteSettings
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { ROLES } = require('../config/constants');

// All admin routes protected with ADMIN role
router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', getAdminDashboardMetrics);

// Lead Management & Quotes Inspection
router.get('/leads', getAdminLeads);
router.get('/leads/:id/quotations', getAdminLeadQuotations);
router.put('/leads/:id/status', updateLeadStatus);
router.post('/leads/:id/assign', manuallyAssignContractor);
router.post('/leads/:id/broadcast-assign', broadcastAssignLeadToAllContractors);

// Contractor & User Management
router.get('/contractors', getAdminContractors);
router.put('/contractors/:id/verify', updateContractorVerification);
router.put('/users/:id/toggle-block', toggleUserBlockStatus);
router.put('/reviews/:id/moderate', moderateReview);
router.get('/export/:type', exportCSV);

// Dynamic Content Management (CMS)
router.get('/categories', getAllCategoriesAdmin);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/areas', getAllServiceAreasAdmin);
router.post('/areas', createServiceArea);
router.put('/areas/:id', updateServiceArea);
router.delete('/areas/:id', deleteServiceArea);

router.put('/settings', updateSiteSettings);

// Admin file/photo upload from local system
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully from system',
    url: fileUrl,
    file: req.file
  });
});

module.exports = router;
