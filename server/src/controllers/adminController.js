const Lead = require('../models/Lead');
const User = require('../models/User');
const ContractorProfile = require('../models/ContractorProfile');
const Quotation = require('../models/Quotation');
const Review = require('../models/Review');
const LeadAssignment = require('../models/LeadAssignment');
const ActivityLog = require('../models/ActivityLog');
const { CONTRACTOR_STATUS, LEAD_STATUS, ASSIGNMENT_STATUS, ROLES } = require('../config/constants');
const { generateLeadsCSV, generateContractorsCSV } = require('../services/exportService');
const { logActivity } = require('../services/auditService');

// @desc    Get admin dashboard metrics & analytics
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin)
exports.getAdminDashboardMetrics = async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: LEAD_STATUS.NEW });
    const activeLeads = await Lead.countDocuments({
      status: { $in: [LEAD_STATUS.MATCHED, LEAD_STATUS.QUOTATIONS_RECEIVED, LEAD_STATUS.CUSTOMER_SELECTING, LEAD_STATUS.CONTRACTOR_SELECTED, LEAD_STATUS.IN_PROGRESS] }
    });
    const completedLeads = await Lead.countDocuments({ status: LEAD_STATUS.COMPLETED });

    const totalContractors = await ContractorProfile.countDocuments();
    const pendingContractors = await ContractorProfile.countDocuments({ verificationStatus: CONTRACTOR_STATUS.PENDING });
    const approvedContractors = await ContractorProfile.countDocuments({ verificationStatus: CONTRACTOR_STATUS.APPROVED });
    const suspendedContractors = await ContractorProfile.countDocuments({ verificationStatus: CONTRACTOR_STATUS.SUSPENDED });

    const totalQuotations = await Quotation.countDocuments();
    const totalCustomers = await User.countDocuments({ role: ROLES.CUSTOMER });

    // Recent activities
    const recentActivities = await ActivityLog.find()
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(15);

    // Recent leads
    const recentLeads = await Lead.find()
      .populate('serviceCategoryId', 'name')
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      metrics: {
        totalLeads,
        newLeads,
        activeLeads,
        completedLeads,
        totalContractors,
        pendingContractors,
        approvedContractors,
        suspendedContractors,
        totalQuotations,
        totalCustomers
      },
      recentLeads,
      recentActivities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads for admin management with filters (Full Contact Data Visible to Admin Only)
// @route   GET /api/v1/admin/leads
// @access  Private (Admin)
exports.getAdminLeads = async (req, res, next) => {
  try {
    const { status, city, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (city) query['location.city'] = city;
    if (search) {
      query.$or = [
        { referenceNo: { $regex: search, $options: 'i' } },
        { 'location.sector': { $regex: search, $options: 'i' } },
        { 'guestContact.name': { $regex: search, $options: 'i' } },
        { 'guestContact.phone': { $regex: search, $options: 'i' } },
        { 'guestContact.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .populate('serviceCategoryId', 'name slug icon')
      .populate('customerId', 'name email phone isActive')
      .populate({
        path: 'selectedContractorId',
        select: 'businessName experienceYears ratingAvg reviewCount isVerifiedBadge userId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate('selectedQuotationId', 'totalAmount labourCost materialCost scopeDetails estimatedTimeline status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const leadsWithQuotesCount = await Promise.all(leads.map(async (lead) => {
      const quotesCount = await Quotation.countDocuments({ leadId: lead._id });
      return {
        ...lead.toObject(),
        quotesCount
      };
    }));

    res.status(200).json({
      success: true,
      count: leadsWithQuotesCount.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      leads: leadsWithQuotesCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status & admin notes
// @route   PUT /api/v1/admin/leads/:id/status
// @access  Private (Admin)
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, followUpDate } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry not found' });
    }

    if (status && Object.values(LEAD_STATUS).includes(status)) {
      lead.status = status;
      lead.statusHistory.push({
        status,
        changedBy: req.user._id,
        note: adminNotes || `Status updated by Admin to ${status}`,
        timestamp: new Date()
      });
    }

    if (adminNotes !== undefined) lead.adminNotes = adminNotes;
    if (followUpDate) lead.followUpDate = new Date(followUpDate);

    await lead.save();

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: 'ADMIN_LEAD_STATUS_UPDATE',
      entityType: 'Lead',
      entityId: lead._id,
      details: { newStatus: status, referenceNo: lead.referenceNo }
    });

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually assign lead to a specific contractor
// @route   POST /api/v1/admin/leads/:id/assign
// @access  Private (Admin)
exports.manuallyAssignContractor = async (req, res, next) => {
  try {
    const { contractorId, reason } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const contractor = await ContractorProfile.findById(contractorId).populate('userId');
    if (!contractor) return res.status(404).json({ success: false, message: 'Contractor profile not found' });

    const existing = await LeadAssignment.findOne({ leadId: lead._id, contractorId: contractor._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Contractor is already assigned to this lead' });
    }

    const assignment = await LeadAssignment.create({
      leadId: lead._id,
      contractorId: contractor._id,
      matchReason: reason || 'Manual Admin Assignment',
      assignedBy: 'admin'
    });

    if (lead.status === LEAD_STATUS.NEW) {
      lead.status = LEAD_STATUS.MATCHED;
      lead.statusHistory.push({
        status: LEAD_STATUS.MATCHED,
        changedBy: req.user._id,
        note: `Manually assigned to contractor ${contractor.businessName}`,
        timestamp: new Date()
      });
      await lead.save();
    }

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: 'ADMIN_MANUAL_ASSIGNMENT',
      entityType: 'Lead',
      entityId: lead._id,
      details: { contractorId: contractor._id, businessName: contractor.businessName }
    });

    res.status(201).json({
      success: true,
      message: `Assigned lead ${lead.referenceNo} to ${contractor.businessName}`,
      assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Single-Click Broadcast Lead to ALL Active Approved Contractors
// @route   POST /api/v1/admin/leads/:id/broadcast-assign
// @access  Private (Admin)
exports.broadcastAssignLeadToAllContractors = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('serviceCategoryId');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // Find all active approved contractors
    const approvedContractors = await ContractorProfile.find({
      verificationStatus: CONTRACTOR_STATUS.APPROVED
    });

    if (approvedContractors.length === 0) {
      return res.status(400).json({ success: false, message: 'No active approved contractors available in network' });
    }

    let newlyAssignedCount = 0;

    for (const contractor of approvedContractors) {
      const existing = await LeadAssignment.findOne({ leadId: lead._id, contractorId: contractor._id });
      if (!existing) {
        await LeadAssignment.create({
          leadId: lead._id,
          contractorId: contractor._id,
          matchReason: `Admin Broadcast Allocation to All Contractors for Category ${lead.serviceCategoryId?.name || 'Service'}`,
          assignedBy: 'admin'
        });
        newlyAssignedCount++;
      }
    }

    if (newlyAssignedCount > 0 && lead.status === LEAD_STATUS.NEW) {
      lead.status = LEAD_STATUS.MATCHED;
      lead.statusHistory.push({
        status: LEAD_STATUS.MATCHED,
        changedBy: req.user._id,
        note: `Broadcasted lead enquiry to ${newlyAssignedCount} active approved contractors`,
        timestamp: new Date()
      });
      await lead.save();
    }

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: 'ADMIN_BROADCAST_LEAD_ASSIGNMENT',
      entityType: 'Lead',
      entityId: lead._id,
      details: { newlyAssignedCount, totalContractors: approvedContractors.length }
    });

    res.status(200).json({
      success: true,
      message: `Broadcasted lead ${lead.referenceNo} to ${newlyAssignedCount} contractor(s) in a single click!`,
      newlyAssignedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contractors for admin management (Full Contact Info Visible to Admin Only)
// @route   GET /api/v1/admin/contractors
// @access  Private (Admin)
exports.getAdminContractors = async (req, res, next) => {
  try {
    const { verificationStatus, search } = req.query;
    const query = {};

    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { serviceAreas: { $regex: search, $options: 'i' } }
      ];
    }

    const contractors = await ContractorProfile.find(query)
      .populate('userId', 'name email phone isActive')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contractors.length,
      contractors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or Unblock User / Contractor Account in Single Click
// @route   PUT /api/v1/admin/users/:id/toggle-block
// @access  Private (Admin)
exports.toggleUserBlockStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    // If user is a contractor, update verification status accordingly
    if (user.role === ROLES.CONTRACTOR) {
      const contractor = await ContractorProfile.findOne({ userId: user._id });
      if (contractor) {
        contractor.verificationStatus = user.isActive ? CONTRACTOR_STATUS.APPROVED : CONTRACTOR_STATUS.SUSPENDED;
        if (!user.isActive) contractor.isVerifiedBadge = false;
        await contractor.save();
      }
    }

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: user.isActive ? 'ADMIN_UNBLOCK_USER' : 'ADMIN_BLOCK_USER',
      entityType: 'User',
      entityId: user._id,
      details: { email: user.email, role: user.role, isActive: user.isActive }
    });

    res.status(200).json({
      success: true,
      message: `Account '${user.email}' is now ${user.isActive ? 'ACTIVE / UNBLOCKED' : 'BLOCKED / SUSPENDED'}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contractor verification status & badge
// @route   PUT /api/v1/admin/contractors/:id/verify
// @access  Private (Admin)
exports.updateContractorVerification = async (req, res, next) => {
  try {
    const { verificationStatus, isVerifiedBadge, adminNotes } = req.body;

    const contractor = await ContractorProfile.findById(req.params.id).populate('userId');
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    if (verificationStatus && Object.values(CONTRACTOR_STATUS).includes(verificationStatus)) {
      contractor.verificationStatus = verificationStatus;
      if (contractor.userId) {
        contractor.userId.isActive = verificationStatus !== CONTRACTOR_STATUS.SUSPENDED;
        await contractor.userId.save();
      }
    }

    if (isVerifiedBadge !== undefined) {
      contractor.isVerifiedBadge = Boolean(isVerifiedBadge);
    }

    if (adminNotes !== undefined) {
      contractor.adminNotes = adminNotes;
    }

    await contractor.save();

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.ADMIN,
      action: 'ADMIN_CONTRACTOR_VERIFICATION_UPDATE',
      entityType: 'ContractorProfile',
      entityId: contractor._id,
      details: { verificationStatus, isVerifiedBadge }
    });

    res.status(200).json({
      success: true,
      message: `Updated contractor status to ${contractor.verificationStatus}`,
      contractor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate Review (Approve / Reject)
// @route   PUT /api/v1/admin/reviews/:id/moderate
// @access  Private (Admin)
exports.moderateReview = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.isApproved = Boolean(isApproved);
    await review.save();

    // Recalculate contractor rating
    const approvedReviews = await Review.find({ contractorId: review.contractorId, isApproved: true });
    const contractor = await ContractorProfile.findById(review.contractorId);
    if (contractor) {
      contractor.reviewCount = approvedReviews.length;
      if (approvedReviews.length > 0) {
        const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
        contractor.ratingAvg = Number((sum / approvedReviews.length).toFixed(1));
      } else {
        contractor.ratingAvg = 0;
      }
      await contractor.save();
    }

    res.status(200).json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export CSV of leads or contractors
// @route   GET /api/v1/admin/export/:type
// @access  Private (Admin)
exports.exportCSV = async (req, res, next) => {
  try {
    const { type } = req.params;

    if (type === 'leads') {
      const leads = await Lead.find()
        .populate('serviceCategoryId', 'name')
        .populate('customerId', 'name email phone')
        .sort({ createdAt: -1 });

      const csvData = generateLeadsCSV(leads);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=banwao_leads_${Date.now()}.csv`);
      return res.status(200).send(csvData);
    } else if (type === 'contractors') {
      const contractors = await ContractorProfile.find()
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 });

      const csvData = generateContractorsCSV(contractors);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=banwao_contractors_${Date.now()}.csv`);
      return res.status(200).send(csvData);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid export type. Use "leads" or "contractors".' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contractor quotations submitted for a specific lead enquiry
// @route   GET /api/v1/admin/leads/:id/quotations
// @access  Private (Admin)
exports.getAdminLeadQuotations = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('serviceCategoryId', 'name slug icon')
      .populate('customerId', 'name email phone');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry not found' });
    }

    const quotations = await Quotation.find({ leadId: lead._id })
      .populate({
        path: 'contractorId',
        select: 'businessName experienceYears ratingAvg reviewCount isVerifiedBadge userId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      lead,
      count: quotations.length,
      quotations
    });
  } catch (error) {
    next(error);
  }
};

