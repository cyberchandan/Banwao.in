const ContractorProfile = require('../models/ContractorProfile');
const LeadAssignment = require('../models/LeadAssignment');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const { CONTRACTOR_STATUS, LEAD_STATUS, ASSIGNMENT_STATUS, MAX_MATCHED_CONTRACTORS_PER_LEAD } = require('../config/constants');

/**
 * Executes contractor matching for a given lead.
 * @param {String} leadId 
 * @param {String} assignedBy 'auto' | 'admin'
 */
const runMatchingForLead = async (leadId, assignedBy = 'auto') => {
  const lead = await Lead.findById(leadId).populate('serviceCategoryId');
  if (!lead) throw new Error('Lead not found for matching');

  const categoryId = lead.serviceCategoryId._id || lead.serviceCategoryId;
  const leadCity = lead.location.city;
  const leadSector = lead.location.sector;

  // Find approved contractors matching category
  const candidateContractors = await ContractorProfile.find({
    verificationStatus: CONTRACTOR_STATUS.APPROVED,
    categories: categoryId
  }).populate('userId');

  const matchedAssignments = [];

  for (const contractor of candidateContractors) {
    if (matchedAssignments.length >= MAX_MATCHED_CONTRACTORS_PER_LEAD) break;

    // Check if contractor is already assigned to this lead
    const existingAssignment = await LeadAssignment.findOne({
      leadId: lead._id,
      contractorId: contractor._id
    });
    if (existingAssignment) continue;

    // Evaluate service area compatibility
    const areas = contractor.serviceAreas || [];
    let isAreaMatch = false;
    let matchDetail = '';

    for (const area of areas) {
      const areaLower = area.toLowerCase();
      if (
        areaLower.includes('all') ||
        areaLower.includes(leadCity.toLowerCase()) ||
        areaLower.includes(leadSector.toLowerCase())
      ) {
        isAreaMatch = true;
        matchDetail = `Matched category '${lead.serviceCategoryId.name || 'Requested Service'}' & area '${area}' for ${leadCity}, ${leadSector}`;
        break;
      }
    }

    // Fallback: If contractor has general service areas listed
    if (!isAreaMatch && (areas.length === 0 || areas.some(a => a.toLowerCase().includes('noida')))) {
      isAreaMatch = true;
      matchDetail = `Matched category '${lead.serviceCategoryId.name || 'Requested Service'}' in ${leadCity} coverage area`;
    }

    if (isAreaMatch) {
      const assignment = await LeadAssignment.create({
        leadId: lead._id,
        contractorId: contractor._id,
        matchReason: matchDetail,
        assignedBy: assignedBy,
        status: ASSIGNMENT_STATUS.NOTIFIED
      });

      matchedAssignments.push(assignment);

      // Create in-app notification for contractor
      if (contractor.userId) {
        await Notification.create({
          userId: contractor.userId._id,
          title: 'New Lead Assignment',
          message: `You have been matched with lead ${lead.referenceNo} for ${lead.serviceCategoryId.name} in ${leadSector}, ${leadCity}.`,
          link: `/contractor/leads/${lead._id}`,
          type: 'lead_assigned'
        });
      }
    }
  }

  // Update lead status if matched
  if (matchedAssignments.length > 0 && lead.status === LEAD_STATUS.NEW) {
    lead.status = LEAD_STATUS.MATCHED;
    lead.statusHistory.push({
      status: LEAD_STATUS.MATCHED,
      note: `Matched with ${matchedAssignments.length} approved contractor(s) automatically.`,
      timestamp: new Date()
    });
    await lead.save();
  }

  return {
    matchedCount: matchedAssignments.length,
    assignments: matchedAssignments
  };
};

module.exports = { runMatchingForLead };
