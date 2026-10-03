const Project = require('../models/Project');

// @desc    Get all public portfolio projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const { category, city, featured } = req.query;
    const query = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (city) {
      query['location.city'] = city;
    }

    const projects = await Project.find(query)
      .populate('categoryId', 'name slug icon')
      .populate('contractorId', 'businessName ratingAvg reviewCount isVerifiedBadge')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project details by ID
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('categoryId', 'name slug icon')
      .populate('contractorId', 'businessName experienceYears ratingAvg reviewCount portfolioImages');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};
