const ContractorProfile = require('../models/ContractorProfile');
const LeadAssignment = require('../models/LeadAssignment');
const Lead = require('../models/Lead');
const Quotation = require('../models/Quotation');
const Review = require('../models/Review');
const ServiceCategory = require('../models/ServiceCategory');
const { CONTRACTOR_STATUS, ASSIGNMENT_STATUS } = require('../config/constants');

// @desc    Get public directory of approved contractors
// @route   GET /api/v1/contractors
// @access  Public
exports.getPublicDirectory = async (req, res, next) => {
  try {
    const { category, locality, minExperience, verifiedOnly, search } = req.query;

    const query = {
      verificationStatus: CONTRACTOR_STATUS.APPROVED
    };

    if (verifiedOnly === 'true') {
      query.isVerifiedBadge = true;
    }

    if (minExperience) {
      query.experienceYears = { $gte: Number(minExperience) };
    }

    if (category) {
      const catObj = await ServiceCategory.findOne({ slug: category });
      if (catObj) {
        query.categories = catObj._id;
      }
    }

    if (locality) {
      query.serviceAreas = { $regex: locality, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const contractors = await ContractorProfile.find(query)
      .populate('userId', 'name phone email')
      .populate('categories', 'name slug icon');

    // Sanitized public output (hide internal email/phone if desired, or keep business contact)
    const sanitized = contractors.map(c => ({
      id: c._id,
      businessName: c.businessName,
      ownerName: c.userId ? c.userId.name : 'Verified Partner',
      experienceYears: c.experienceYears,
      skills: c.skills,
      categories: c.categories,
      serviceAreas: c.serviceAreas,
      description: c.description,
      isVerifiedBadge: c.isVerifiedBadge,
      ratingAvg: c.ratingAvg,
      reviewCount: c.reviewCount,
      completedProjectsCount: c.completedProjectsCount,
      portfolioImages: c.portfolioImages,
      createdAt: c.createdAt
    }));

    res.status(200).json({
      success: true,
      count: sanitized.length,
      contractors: sanitized
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public contractor profile by id
// @route   GET /api/v1/contractors/:id
// @access  Public
exports.getPublicProfile = async (req, res, next) => {
  try {
    const contractor = await ContractorProfile.findById(req.params.id)
      .populate('userId', 'name')
      .populate('categories', 'name slug icon');

    if (!contractor || contractor.verificationStatus !== CONTRACTOR_STATUS.APPROVED) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found or not approved' });
    }

    // Get approved public reviews
    const reviews = await Review.find({ contractorId: contractor._id, isApproved: true })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    const publicProfile = {
      id: contractor._id,
      businessName: contractor.businessName,
      ownerName: contractor.userId ? contractor.userId.name : 'Contractor Partner',
      experienceYears: contractor.experienceYears,
      skills: contractor.skills,
      categories: contractor.categories,
      serviceAreas: contractor.serviceAreas,
      description: contractor.description,
      isVerifiedBadge: contractor.isVerifiedBadge,
      ratingAvg: contractor.ratingAvg,
      reviewCount: contractor.reviewCount,
      completedProjectsCount: contractor.completedProjectsCount,
      portfolioImages: contractor.portfolioImages,
      reviews: reviews.map(r => ({
        id: r._id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        customerName: r.customerId ? r.customerId.name.charAt(0) + '***' : 'Verified Customer',
        createdAt: r.createdAt
      }))
    };

    res.status(200).json({
      success: true,
      contractor: publicProfile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contractor dashboard metrics and assigned leads
// @route   GET /api/v1/contractors/portal/dashboard
// @access  Private (Contractor)
exports.getContractorDashboard = async (req, res, next) => {
  try {
    const contractor = await ContractorProfile.findOne({ userId: req.user._id })
      .populate('categories');

    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    // Get assigned leads
    const assignments = await LeadAssignment.find({ contractorId: contractor._id })
      .populate({
        path: 'leadId',
        populate: { path: 'serviceCategoryId', select: 'name slug icon' }
      })
      .sort({ createdAt: -1 });

    // Filter leads
    const assignedLeads = assignments.map(a => {
      const lead = a.leadId;
      if (!lead) return null;
      return {
        assignmentId: a._id,
        matchReason: a.matchReason,
        assignedAt: a.assignedAt,
        assignmentStatus: a.status,
        lead: {
          id: lead._id,
          referenceNo: lead.referenceNo,
          service: lead.serviceCategoryId ? lead.serviceCategoryId.name : 'Service',
          propertyType: lead.propertyType,
          workType: lead.workType,
          location: lead.location,
          builtUpArea: lead.builtUpArea,
          budgetRange: lead.budgetRange,
          constructionType: lead.constructionType,
          desiredStartDate: lead.desiredStartDate,
          expectedTimeline: lead.expectedTimeline,
          description: lead.description,
          status: lead.status,
          createdAt: lead.createdAt
        }
      };
    }).filter(Boolean);

    // Get submitted quotes
    const submittedQuotes = await Quotation.find({ contractorId: contractor._id })
      .populate('leadId', 'referenceNo status');

    const totalAssigned = assignments.length;
    const totalQuoted = submittedQuotes.length;
    const totalSelected = submittedQuotes.filter(q => q.status === 'selected').length;
    const totalRejected = submittedQuotes.filter(q => q.status === 'rejected').length;

    // Profile completeness score
    let completeness = 40;
    if (contractor.description) completeness += 15;
    if (contractor.serviceAreas?.length > 0) completeness += 15;
    if (contractor.categories?.length > 0) completeness += 15;
    if (contractor.portfolioImages?.length > 0) completeness += 15;

    res.status(200).json({
      success: true,
      profile: {
        id: contractor._id,
        businessName: contractor.businessName,
        experienceYears: contractor.experienceYears,
        verificationStatus: contractor.verificationStatus,
        isVerifiedBadge: contractor.isVerifiedBadge,
        ratingAvg: contractor.ratingAvg,
        reviewCount: contractor.reviewCount,
        completeness,
        categories: contractor.categories,
        serviceAreas: contractor.serviceAreas,
        skills: contractor.skills,
        description: contractor.description,
        portfolioImages: contractor.portfolioImages
      },
      stats: {
        totalAssigned,
        totalQuoted,
        totalSelected,
        totalRejected
      },
      leads: assignedLeads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contractor profile & portfolio
// @route   PUT /api/v1/contractors/portal/profile
// @access  Private (Contractor)
exports.updateContractorProfile = async (req, res, next) => {
  try {
    const { businessName, experienceYears, skills, categories, serviceAreas, description } = req.body;

    const contractor = await ContractorProfile.findOne({ userId: req.user._id });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    if (businessName) contractor.businessName = businessName;
    if (experienceYears !== undefined) contractor.experienceYears = Number(experienceYears);
    if (skills) contractor.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (categories) contractor.categories = Array.isArray(categories) ? categories : [];
    if (serviceAreas) contractor.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : serviceAreas.split(',').map(s => s.trim());
    if (description !== undefined) contractor.description = description;

    await contractor.save();

    res.status(200).json({
      success: true,
      message: 'Contractor profile updated successfully',
      profile: contractor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add portfolio image URL or upload
// @route   POST /api/v1/contractors/portal/portfolio
// @access  Private (Contractor)
exports.addPortfolioImage = async (req, res, next) => {
  try {
    const { title, url, description } = req.body;
    let imageUrl = url;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL or file is required' });
    }

    const contractor = await ContractorProfile.findOne({ userId: req.user._id });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    contractor.portfolioImages.push({
      title: title || 'Project Work',
      url: imageUrl,
      description: description || ''
    });

    await contractor.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio image added successfully',
      portfolio: contractor.portfolioImages
    });
  } catch (error) {
    next(error);
  }
};
