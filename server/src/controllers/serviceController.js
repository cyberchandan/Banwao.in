const ServiceCategory = require('../models/ServiceCategory');
const ServiceArea = require('../models/ServiceArea');
const SiteSetting = require('../models/SiteSetting');
const { logActivity } = require('../services/auditService');
const { ROLES } = require('../config/constants');

// @desc    Get all active service categories
// @route   GET /api/v1/services
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service category by slug
// @route   GET /api/v1/services/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await ServiceCategory.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Service category not found' });
    }
    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active service areas
// @route   GET /api/v1/services/areas/all
// @access  Public
exports.getServiceAreas = async (req, res, next) => {
  try {
    const areas = await ServiceArea.find({ isActive: true }).sort({ city: 1, sector: 1 });
    res.status(200).json({
      success: true,
      count: areas.length,
      areas
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN CMS CONTROLLERS =================

// @desc    Get all categories for Admin (active + inactive)
// @route   GET /api/v1/admin/categories
// @access  Private (Admin)
exports.getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await ServiceCategory.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Service Category
// @route   POST /api/v1/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, icon, shortDesc, fullDesc, isPopular, imageUrl, displayOrder, isActive } = req.body;
    
    if (!name || !slug || !shortDesc) {
      return res.status(400).json({ success: false, message: 'Please provide category name, slug, and short description' });
    }

    const category = await ServiceCategory.create({
      name,
      slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
      icon: icon || 'Wrench',
      shortDesc,
      fullDesc: fullDesc || '',
      isPopular: Boolean(isPopular),
      imageUrl: imageUrl || '',
      displayOrder: Number(displayOrder) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: 'ADMIN_CREATE_CATEGORY',
      entityType: 'ServiceCategory',
      entityId: category._id,
      details: { name: category.name }
    });

    res.status(201).json({
      success: true,
      message: `Category "${category.name}" created successfully`,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Service Category
// @route   PUT /api/v1/admin/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Service category not found' });
    }

    const { name, slug, icon, shortDesc, fullDesc, isPopular, imageUrl, displayOrder, isActive } = req.body;

    if (name) category.name = name;
    if (slug) category.slug = slug.toLowerCase().trim().replace(/\s+/g, '-');
    if (icon) category.icon = icon;
    if (shortDesc) category.shortDesc = shortDesc;
    if (fullDesc !== undefined) category.fullDesc = fullDesc;
    if (isPopular !== undefined) category.isPopular = Boolean(isPopular);
    if (imageUrl !== undefined) category.imageUrl = imageUrl;
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: 'ADMIN_UPDATE_CATEGORY',
      entityType: 'ServiceCategory',
      entityId: category._id,
      details: { name: category.name }
    });

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" updated successfully`,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Service Category
// @route   DELETE /api/v1/admin/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active service areas for public site
// @route   GET /api/v1/services/areas/all
// @access  Public
exports.getServiceAreas = async (req, res, next) => {
  try {
    const areas = await ServiceArea.find({ isActive: true }).sort({ city: 1, sector: 1 });
    res.status(200).json({
      success: true,
      count: areas.length,
      areas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all service areas for Admin (active + inactive)
// @route   GET /api/v1/admin/areas
// @access  Private (Admin)
exports.getAllServiceAreasAdmin = async (req, res, next) => {
  try {
    const areas = await ServiceArea.find().sort({ city: 1, sector: 1 });
    res.status(200).json({
      success: true,
      count: areas.length,
      areas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Service Area
// @route   POST /api/v1/admin/areas
// @access  Private (Admin)
exports.createServiceArea = async (req, res, next) => {
  try {
    const { city, sector, pincode, isActive } = req.body;

    if (!city || !sector) {
      return res.status(400).json({ success: false, message: 'City and Sector are required' });
    }

    const area = await ServiceArea.create({
      city,
      sector,
      pincode: pincode || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({
      success: true,
      message: `Service Area "${city} - ${sector}" created successfully`,
      area
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Service Area
// @route   PUT /api/v1/admin/areas/:id
// @access  Private (Admin)
exports.updateServiceArea = async (req, res, next) => {
  try {
    const area = await ServiceArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Service area not found' });
    }

    const { city, sector, pincode, isActive } = req.body;

    if (city) area.city = city;
    if (sector) area.sector = sector;
    if (pincode !== undefined) area.pincode = pincode;
    if (isActive !== undefined) area.isActive = Boolean(isActive);

    await area.save();

    res.status(200).json({
      success: true,
      message: `Service area updated successfully`,
      area
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Service Area
// @route   DELETE /api/v1/admin/areas/:id
// @access  Private (Admin)
exports.deleteServiceArea = async (req, res, next) => {
  try {
    const area = await ServiceArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Service area not found' });
    }

    await area.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service area deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public site settings
// @route   GET /api/v1/services/settings/public
// @access  Public
exports.getSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update public site settings
// @route   PUT /api/v1/admin/settings
// @access  Private (Admin)
exports.updateSiteSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: 'ADMIN_UPDATE_SITE_SETTINGS',
      entityType: 'SiteSetting',
      entityId: settings._id,
      details: { announcementText: settings.announcementText }
    });

    res.status(200).json({
      success: true,
      message: 'Public site content & settings updated successfully!',
      settings
    });
  } catch (error) {
    next(error);
  }
};
