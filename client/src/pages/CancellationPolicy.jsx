import React from 'react';

export const CancellationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-white rounded-3xl border border-warm-200 shadow-card my-12">
      <h1 className="text-3xl font-bold font-heading text-slate-900">Cancellation & Dispute Resolution Policy</h1>
      <p className="text-xs text-slate-400">Last updated: October 2026</p>

      <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>This policy outlines the rules governing enquiry cancellation, contractor withdrawal of quotations, and administrative dispute handling on Banwao.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">1. Homeowner Enquiry Cancellation</h2>
        <p>Homeowners may cancel an active quote request at any time prior to selecting a contractor or before physical site work commences. Once work is marked as in-progress or completed, status transitions are managed in coordination with admin support.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">2. Contractor Quotation Withdrawal</h2>
        <p>Contractors can edit or withdraw submitted quotations prior to customer selection. Withdrawn quotations are archived and marked inactive.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">3. Dispute Support & Admin Moderation</h2>
        <p>In the event of a disagreement regarding scope specifications or timeline delays, Banwao admin team provides activity audit logs and mediation assistance upon request.</p>
      </div>
    </div>
  );
};
