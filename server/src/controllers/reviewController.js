const Review = require('../models/Review');
const Lead = require('../models/Lead');
const ContractorProfile = require('../models/ContractorProfile');
const { LEAD_STATUS, ROLES } = require('../config/constants');
const { logActivity } = require('../services/auditService');

// @desc    Submit a review for a contractor on a lead
// @route   POST /api/v1/reviews
// @access  Private (Customer)
exports.submitReview = async (req, res, next) => {
  try {
    const { leadId, contractorId, rating, title, comment } = req.body;

    if (!leadId || !contractorId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide leadId, contractorId, rating, and comment' });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead enquiry not found' });
    }

    if (lead.customerId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the enquiry owner can submit a review' });
    }

    if (![LEAD_STATUS.CONTRACTOR_SELECTED, LEAD_STATUS.IN_PROGRESS, LEAD_STATUS.COMPLETED].includes(lead.status)) {
      return res.status(400).json({ success: false, message: 'Reviews can only be submitted after hiring or work completion' });
    }

    const existingReview = await Review.findOne({ leadId, customerId: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this enquiry' });
    }

    const review = await Review.create({
      leadId,
      customerId: req.user._id,
      contractorId,
      rating: Number(rating),
      title: title || '',
      comment,
      isApproved: false // Requires admin moderation
    });

    await logActivity({
      actorId: req.user._id,
      actorRole: ROLES.CUSTOMER,
      action: 'REVIEW_SUBMITTED',
      entityType: 'Review',
      entityId: review._id
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and is pending admin moderation.',
      review
    });
  } catch (error) {
    next(error);
  }
};
