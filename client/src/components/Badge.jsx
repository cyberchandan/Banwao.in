import React from 'react';

export const StatusBadge = ({ status }) => {
  const map = {
    new: { label: 'New Enquiry', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    reviewing: { label: 'In Review', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    matched: { label: 'Matched Contractors', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    quotations_received: { label: 'Quotations Received', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold' },
    customer_selecting: { label: 'Selecting Contractor', bg: 'bg-amber-50 text-amber-800 border-amber-300' },
    contractor_selected: { label: 'Contractor Selected', bg: 'bg-forest-100 text-forest-900 border-forest-300 font-bold' },
    in_progress: { label: 'Work In Progress', bg: 'bg-blue-100 text-blue-900 border-blue-300 font-semibold' },
    completed: { label: 'Project Completed', bg: 'bg-green-100 text-green-900 border-green-300 font-bold' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
    closed: { label: 'Closed', bg: 'bg-slate-100 text-slate-700 border-slate-300' },
    
    // Contractor statuses
    pending: { label: 'Pending Approval', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
    approved: { label: 'Verified Partner', bg: 'bg-forest-100 text-forest-800 border-forest-300 font-semibold' },
    rejected: { label: 'Application Rejected', bg: 'bg-red-50 text-red-700 border-red-200' },
    suspended: { label: 'Suspended', bg: 'bg-gray-100 text-gray-700 border-gray-300' }
  };

  const config = map[status] || { label: status, bg: 'bg-slate-100 text-slate-800 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${config.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {config.label}
    </span>
  );
};
