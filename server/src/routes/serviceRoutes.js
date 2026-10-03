const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBySlug, getServiceAreas, getSiteSettings } = require('../controllers/serviceController');

router.get('/', getCategories);
router.get('/settings/public', getSiteSettings);
router.get('/areas/all', getServiceAreas);
router.get('/:slug', getCategoryBySlug);

module.exports = router;
