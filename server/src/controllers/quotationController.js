const Quotation = require('../models/Quotation');
const Lead = require('../models/Lead');
const LeadAssignment = require('../models/LeadAssignment');
const ContractorProfile = require('../models/ContractorProfile');
const Notification = require('../models/Notification');
const { QUOTATION_STATUS, LEAD_STATUS, ASSIGNMENT_STATUS, ROLES } = require('../config/constants');
const { logActivity } = require('../services/auditService');

// @desc    Submit quotation for an assigned lead
// @route   POST /api/v1/quotations
// @access  Private (Contractor)
exports.submitQuotation = async (req, res, next) => {
  try {
    const {
      leadId,
      labourCost,
      materialCost,
      otherCharges,
      scopeDetails,
      exclusions,
      validityDays,
      estimatedTimeline
    } = req.body;

    if (!leadId || labourCost === undefined || !scopeDetails || !estimatedTimeline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide leadId, labour cost, scope details, and estimated timeline'
      });
    }

    const contractor = await ContractorProfile.findOne({ userId: req.user._id });
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor profile not found' });
    }

    // Verify contractor was assigned to this lead
    const assignment = await LeadAssignment.findOne({
      leadId,
      contractorId: contractor._id
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this lead enquiry'
      });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry not found' });
    }

    if ([LEAD_STATUS.COMPLETED, LEAD_STATUS.CANCELLED, LEAD_STATUS.CLOSED].includes(lead.status)) {
      return res.status(400).json({ success: false, message: 'Cannot submit quote for closed or completed leads' });
    }

    const labour = Number(labourCost) || 0;
    const material = Number(materialCost) || 0;
    const other = Number(otherCharges) || 0;
    const totalAmount = labour + material + other;

    let quotation = await Quotation.findOne({ leadId, contractorId: contractor._id });

    if (quotation) {
      // Update existing quote
      quotation.labourCost = labour;
      quotation.materialCost = material;
      quotation.otherCharges = other;
      quotation.totalAmount = totalAmount;
      quotation.scopeDetails = scopeDetails;
      quotation.exclusions = exclusions || '';
      quotation.validityDays = validityDays ? Number(validityDays) : 30;
      quotation.estimatedTimeline = estimatedTimeline;
      quotation.status = QUOTATION_STATUS.SUBMITTED;
      await quotation.save();
    } else {
      // Create new quote
      quotation = await Quotation.create({
        leadId,
        contractorId: contractor._id,
        labourCost: labour,
        materialCost: material,
        otherCharges: other,
        totalAmount,
        scopeDetails,
        exclusions: exclusions || '',
        validityDays: validityDays ? Number(validityDays) : 30,
        estimatedTimeline,
        status: QUOTATION_STATUS.SUBMITTED
      });
    }

    // Update assignment status
    assignment.status = ASSIGNMENT_STATUS.QUOTED;
    await assignment.save();

    // Update lead status to quotations_received
    if ([LEAD_STATUS.NEW, LEAD_STATUS.MATCHED, LEAD_STATUS.REVIEWING].includes(lead.status)) {
      lead.status = LEAD_STATUS.QUOTATIONS_RECEIVED;
      lead.statusHistory.push({
        status: LEAD_STATUS.QUOTATIONS_RECEIVED,
        note: `Received quotation from contractor ${contractor.businessName} for ₹${totalAmount.toLocaleString('en-IN')}`,
        timestamp: new Date()
      });
      await lead.save();
    }

    // Notify customer if user account exists
    if (lead.customerId) {
      await Notification.create({
        userId: lead.customerId,
        title: 'New Quotation Received!',
        message: `${contractor.businessName} submitted a quotation of ₹${totalAmount.toLocaleString('en-IN')} for lead ${lead.referenceNo}.`,
        link: `/customer/leads/${lead._id}`,
        type: 'quotation_received'
      });
    }

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.CONTRACTOR,
      action: 'QUOTATION_SUBMITTED',
      entityType: 'Quotation',
      entityId: quotation._id,
      details: { totalAmount, leadId }
    });

    res.status(201).json({
      success: true,
      message: 'Quotation submitted successfully',
      quotation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quotations comparison for a lead
// @route   GET /api/v1/quotations/compare/:leadId
// @access  Public (Guest track or Logged in customer)
exports.compareQuotations = async (req, res, next) => {
  try {
    const { leadId } = req.params;

    const lead = await Lead.findById(leadId)
      .populate('serviceCategoryId', 'name slug icon');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry not found' });
    }

    const quotations = await Quotation.find({ leadId })
      .populate({
        path: 'contractorId',
        select: 'businessName experienceYears ratingAvg reviewCount isVerifiedBadge portfolioImages'
      })
      .sort({ totalAmount: 1 });

    res.status(200).json({
      success: true,
      lead: {
        id: lead._id,
        referenceNo: lead.referenceNo,
        service: lead.serviceCategoryId ? lead.serviceCategoryId.name : 'Service',
        location: lead.location,
        status: lead.status,
        selectedContractorId: lead.selectedContractorId,
        selectedQuotationId: lead.selectedQuotationId
      },
      count: quotations.length,
      quotations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Select a quotation / preferred contractor
// @route   POST /api/v1/quotations/select
// @access  Private (Customer or Admin)
exports.selectQuotation = async (req, res, next) => {
  try {
    const { quotationId } = req.body;

    const quotation = await Quotation.findById(quotationId).populate('contractorId');
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    const lead = await Lead.findById(quotation.leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Associated lead enquiry not found' });
    }

    // Check ownership
    if (req.user.role === ROLES.CUSTOMER && lead.customerId && lead.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to select quotation for this lead' });
    }

    // Mark this quotation selected and others rejected
    await Quotation.updateMany(
      { leadId: lead._id },
      { $set: { status: QUOTATION_STATUS.REJECTED } }
    );

    quotation.status = QUOTATION_STATUS.SELECTED;
    await quotation.save();

    // Update lead record
    lead.selectedContractorId = quotation.contractorId._id;
    lead.selectedQuotationId = quotation._id;
    lead.status = LEAD_STATUS.CONTRACTOR_SELECTED;
    lead.statusHistory.push({
      status: LEAD_STATUS.CONTRACTOR_SELECTED,
      changedBy: req.user._id,
      note: `Selected contractor ${quotation.contractorId.businessName} (Quote: ₹${quotation.totalAmount.toLocaleString('en-IN')})`,
      timestamp: new Date()
    });
    await lead.save();

    // Notify selected contractor
    if (quotation.contractorId.userId) {
      await Notification.create({
        userId: quotation.contractorId.userId,
        title: 'Congratulations! Quotation Selected',
        message: `Your quotation of ₹${quotation.totalAmount.toLocaleString('en-IN')} for lead ${lead.referenceNo} was selected by the customer.`,
        link: `/contractor/leads/${lead._id}`,
        type: 'contractor_selected'
      });
    }

    await logActivity({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'QUOTATION_SELECTED',
      entityType: 'Quotation',
      entityId: quotation._id,
      details: { leadId: lead._id, contractorId: quotation.contractorId._id }
    });

    res.status(200).json({
      success: true,
      message: `Selected contractor ${quotation.contractorId.businessName} successfully!`,
      lead
    });
  } catch (error) {
    next(error);
  }
};
