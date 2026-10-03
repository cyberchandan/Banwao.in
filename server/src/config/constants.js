module.exports = {
  ROLES: {
    CUSTOMER: 'customer',
    CONTRACTOR: 'contractor',
    ADMIN: 'admin'
  },
  CONTRACTOR_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended'
  },
  LEAD_STATUS: {
    NEW: 'new',
    REVIEWING: 'reviewing',
    MATCHED: 'matched',
    QUOTATIONS_RECEIVED: 'quotations_received',
    CUSTOMER_SELECTING: 'customer_selecting',
    CONTRACTOR_SELECTED: 'contractor_selected',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    CLOSED: 'closed'
  },
  ASSIGNMENT_STATUS: {
    NOTIFIED: 'notified',
    VIEWED: 'viewed',
    QUOTED: 'quoted',
    DECLINED: 'declined'
  },
  QUOTATION_STATUS: {
    SUBMITTED: 'submitted',
    SELECTED: 'selected',
    REJECTED: 'rejected',
    WITHDRAWN: 'withdrawn'
  },
  PROPERTY_TYPES: [
    'plot',
    'independent_house',
    'flat',
    'lig_floor',
    'villa',
    'commercial',
    'other'
  ],
  WORK_TYPES: [
    'new_construction',
    'additional_floor',
    'renovation',
    'repair'
  ],
  CONSTRUCTION_TYPES: [
    'material_and_labour',
    'labour_only',
    'not_sure'
  ],
  CITIES: ['Noida', 'Greater Noida'],
  MAX_MATCHED_CONTRACTORS_PER_LEAD: 5
};
