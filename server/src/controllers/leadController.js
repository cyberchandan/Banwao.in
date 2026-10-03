const crypto = require('crypto');
const Lead = require('../models/Lead');
const Quotation = require('../models/Quotation');
const ServiceCategory = require('../models/ServiceCategory');
const { runMatchingForLead } = require('../services/matchingEngine');
const { LEAD_STATUS } = require('../config/constants');
const { logActivity } = require('../services/auditService');

// Helper to generate reference numbers like BNW-2026-8419
const generateReferenceNo = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BNW-${year}-${random}`;
};

// @desc    Create a new customer lead / quote enquiry
// @route   POST /api/v1/leads
// @access  Public (Guest or Authenticated Customer)
exports.createLead = async (req, res, next) => {
  try {
    const {
      serviceCategoryId,
      propertyType,
      workType,
      city,
      sector,
      address,
      builtUpArea,
      budgetMin,
      budgetMax,
      constructionType,
      desiredStartDate,
      expectedTimeline,
      description,
      customerName,
      customerPhone,
      customerEmail,
      preferredContactMethod
    } = req.body;

    if (!serviceCategoryId || !propertyType || !workType || !city || !sector || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please fill out all required service and location details'
      });
    }

    let customerId = null;
    let guestContact = null;

    if (req.user) {
      customerId = req.user._id;
    } else {
      if (!customerName || !customerPhone || !customerEmail) {
        return res.status(400).json({
          success: false,
          message: 'Please provide customer name, phone number, and email address'
        });
      }

      // Check recent duplicate submission in last 5 minutes
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const duplicate = await Lead.findOne({
        'guestContact.phone': customerPhone,
        serviceCategoryId,
        createdAt: { $gte: fiveMinsAgo }
      });

      if (duplicate) {
        return res.status(429).json({
          success: false,
          message: 'An enquiry with this phone number and service was submitted recently. Please check reference: ' + duplicate.referenceNo
        });
      }

      const accessCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars code
      guestContact = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        accessCode: accessCode,
        accessExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      };
    }

    // Handle reference image uploads if present
    let referenceImages = [];
    if (req.files && req.files.length > 0) {
      referenceImages = req.files.map(f => `/uploads/${f.filename}`);
    } else if (req.body.referenceImages) {
      referenceImages = Array.isArray(req.body.referenceImages) ? req.body.referenceImages : [req.body.referenceImages];
    }

    let refNo = generateReferenceNo();
    let isUnique = false;
    while (!isUnique) {
      const existing = await Lead.findOne({ referenceNo: refNo });
      if (!existing) isUnique = true;
      else refNo = generateReferenceNo();
    }

    const lead = await Lead.create({
      referenceNo: refNo,
      customerId,
      guestContact,
      serviceCategoryId,
      propertyType,
      workType,
      location: {
        city,
        sector,
        address: address || ''
      },
      builtUpArea: builtUpArea ? Number(builtUpArea) : undefined,
      budgetRange: {
        min: budgetMin ? Number(budgetMin) : 0,
        max: budgetMax ? Number(budgetMax) : 0
      },
      constructionType: constructionType || 'material_and_labour',
      desiredStartDate: desiredStartDate || 'Immediate',
      expectedTimeline: expectedTimeline || 'Flexible',
      description,
      referenceImages,
      preferredContactMethod: preferredContactMethod || 'phone',
      status: LEAD_STATUS.NEW,
      statusHistory: [{
        status: LEAD_STATUS.NEW,
        note: 'Lead enquiry created by customer',
        timestamp: new Date()
      }]
    });

    // Run backend contractor matching engine
    const matchResult = await runMatchingForLead(lead._id, 'auto');

    await logActivity({
      actorId: customerId,
      actorRole: req.user ? req.user.role : 'customer',
      action: 'LEAD_CREATED',
      entityType: 'Lead',
      entityId: lead._id,
      details: { referenceNo: refNo, matchedCount: matchResult.matchedCount }
    });

    const createdLead = await Lead.findById(lead._id).populate('serviceCategoryId', 'name slug icon');

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Multiple matched contractors will provide quotations shortly.',
      lead: {
        id: createdLead._id,
        referenceNo: createdLead.referenceNo,
        serviceName: createdLead.serviceCategoryId ? createdLead.serviceCategoryId.name : 'Requested Service',
        status: createdLead.status,
        matchedCount: matchResult.matchedCount,
        accessCode: guestContact ? guestContact.accessCode : null,
        createdAt: createdLead.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track Guest Enquiry
// @route   POST /api/v1/leads/guest-track
// @access  Public
exports.trackGuestLead = async (req, res, next) => {
  try {
    const { referenceNo, phone } = req.body;

    if (!referenceNo || !phone) {
      return res.status(400).json({ success: false, message: 'Reference number and phone number are required' });
    }

    const lead = await Lead.findOne({
      referenceNo: referenceNo.trim().toUpperCase(),
      'guestContact.phone': phone.trim()
    })
      .populate('serviceCategoryId', 'name slug icon')
      .populate('selectedContractorId', 'businessName experienceYears ratingAvg reviewCount');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'No enquiry found matching this reference number and phone number combination'
      });
    }

    // Fetch quotations associated with this lead
    const quotations = await Quotation.find({ leadId: lead._id })
      .populate('contractorId', 'businessName experienceYears ratingAvg reviewCount isVerifiedBadge');

    res.status(200).json({
      success: true,
      lead: {
        id: lead._id,
        referenceNo: lead.referenceNo,
        service: lead.serviceCategoryId,
        propertyType: lead.propertyType,
        workType: lead.workType,
        location: lead.location,
        builtUpArea: lead.builtUpArea,
        budgetRange: lead.budgetRange,
        constructionType: lead.constructionType,
        status: lead.status,
        createdAt: lead.createdAt
      },
      quotationsCount: quotations.length,
      quotations: quotations.map(q => ({
        id: q._id,
        contractor: q.contractorId,
        totalAmount: q.totalAmount,
        labourCost: q.labourCost,
        materialCost: q.materialCost,
        otherCharges: q.otherCharges,
        scopeDetails: q.scopeDetails,
        exclusions: q.exclusions,
        validityDays: q.validityDays,
        estimatedTimeline: q.estimatedTimeline,
        status: q.status,
        createdAt: q.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's leads (logged-in customer)
// @route   GET /api/v1/leads/my-leads
// @access  Private (Customer)
exports.getCustomerLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ customerId: req.user._id })
      .populate('serviceCategoryId', 'name slug icon')
      .populate('selectedContractorId', 'businessName ratingAvg reviewCount')
      .sort({ createdAt: -1 });

    const leadsWithCounts = await Promise.all(leads.map(async (l) => {
      const quoteCount = await Quotation.countDocuments({ leadId: l._id });
      return {
        id: l._id,
        referenceNo: l.referenceNo,
        service: l.serviceCategoryId,
        location: l.location,
        propertyType: l.propertyType,
        workType: l.workType,
        budgetRange: l.budgetRange,
        status: l.status,
        selectedContractor: l.selectedContractorId,
        quoteCount,
        createdAt: l.createdAt
      };
    }));

    res.status(200).json({
      success: true,
      count: leadsWithCounts.length,
      leads: leadsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead detail by ID (Customer / Contractor / Admin)
// @route   GET /api/v1/leads/:id
// @access  Private
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('serviceCategoryId', 'name slug icon')
      .populate('selectedContractorId', 'businessName ratingAvg reviewCount isVerifiedBadge')
      .populate('selectedQuotationId');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry not found' });
    }

    // Ownership or authorization check
    const isCustomerOwner = req.user.role === 'customer' && lead.customerId && lead.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    let isAssignedContractor = false;

    if (req.user.role === 'contractor') {
      const contractorProfile = await require('../models/ContractorProfile').findOne({ userId: req.user._id });
      if (contractorProfile) {
        const assignment = await require('../models/LeadAssignment').findOne({
          leadId: lead._id,
          contractorId: contractorProfile._id
        });
        if (assignment) isAssignedContractor = true;
      }
    }

    if (!isCustomerOwner && !isAdmin && !isAssignedContractor) {
      return res.status(403).json({ success: false, message: 'You are not authorized to view this lead' });
    }

    // Fetch quotations for customer or admin
    let quotations = [];
    if (isCustomerOwner || isAdmin) {
      quotations = await Quotation.find({ leadId: lead._id })
        .populate('contractorId', 'businessName experienceYears ratingAvg reviewCount isVerifiedBadge');
    }

    // PRIVACY ENFORCEMENT: If requester is a contractor, sanitize customer phone, email, and exact address
    let sanitizedLead = lead.toObject();
    if (req.user.role === 'contractor') {
      if (sanitizedLead.guestContact) {
        delete sanitizedLead.guestContact.phone;
        delete sanitizedLead.guestContact.email;
        delete sanitizedLead.guestContact.accessCode;
      }
      if (sanitizedLead.location) {
        delete sanitizedLead.location.address; // Only city and sector/locality are visible to contractor
      }
      delete sanitizedLead.customerId; // Do not expose customer user object to contractor
    }

    res.status(200).json({
      success: true,
      lead: sanitizedLead,
      quotations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a lead enquiry
// @route   PUT /api/v1/leads/:id/cancel
// @access  Private (Customer)
exports.cancelLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry not found' });
    }

    if (req.user.role === 'customer' && lead.customerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this lead' });
    }

    if (lead.status === LEAD_STATUS.COMPLETED || lead.status === LEAD_STATUS.IN_PROGRESS) {
      return res.status(400).json({ success: false, message: 'Cannot cancel an in-progress or completed project lead' });
    }

    lead.status = LEAD_STATUS.CANCELLED;
    lead.statusHistory.push({
      status: LEAD_STATUS.CANCELLED,
      changedBy: req.user._id,
      note: req.body.reason || 'Cancelled by customer',
      timestamp: new Date()
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Enquiry has been cancelled',
      lead
    });
  } catch (error) {
    next(error);
  }
};
