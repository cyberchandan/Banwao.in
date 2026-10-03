import React from 'react';
import { X, Check, ShieldCheck, Star, Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';

export const QuoteComparisonModal = ({ isOpen, onClose, quotations, onSelectQuote, isSelecting }) => {
  if (!isOpen || !quotations || quotations.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-warm-50 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-elevated border border-warm-300 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-forest-900 text-white flex items-center justify-between border-b border-forest-800 shrink-0">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Banwao Side-by-Side Quotation Matrix</span>
            <h2 className="text-xl font-bold font-heading">Compare Contractor Estimates ({quotations.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Side by Side Scrollable Grid */}
        <div className="p-6 overflow-x-auto overflow-y-auto space-y-6">
          <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Note: Platform facilitates transparent comparison. Review scope details and exclusions carefully before selecting your preferred contractor partner.</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[600px]">
            {quotations.map((q, idx) => {
              const contractor = q.contractorId || q.contractor;
              const isSelected = q.status === 'selected';

              return (
                <div
                  key={q._id || q.id || idx}
                  className={`bg-white rounded-2xl border flex flex-col justify-between shadow-card hover:shadow-elevated transition-all ${
                    isSelected ? 'border-2 border-forest-700 ring-2 ring-forest-500/20' : 'border-warm-200'
                  }`}
                >
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="border-b border-slate-100 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Option #{idx + 1}</span>
                        {contractor?.isVerifiedBadge && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                            <ShieldCheck className="w-3 h-3 text-gold-500" /> Verified
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mt-1">{contractor?.businessName || 'Contractor Partner'}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current mr-1" /> {contractor?.ratingAvg || 4.5}
                        </span>
                        <span>({contractor?.reviewCount || 0} reviews)</span>
                        <span>• {contractor?.experienceYears || 5} yrs exp</span>
                      </div>
                    </div>

                    {/* Total Amount Badge */}
                    <div className="bg-forest-50 border border-forest-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-forest-700 font-medium">Total Quotation Price</p>
                      <p className="text-2xl font-black font-heading text-forest-900 mt-0.5">
                        ₹{q.totalAmount ? Number(q.totalAmount).toLocaleString('en-IN') : '0'}
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                        <span className="text-slate-500">Labour Cost:</span>
                        <span className="font-semibold text-slate-800">₹{Number(q.labourCost || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                        <span className="text-slate-500">Material Cost:</span>
                        <span className="font-semibold text-slate-800">₹{Number(q.materialCost || 0).toLocaleString('en-IN')}</span>
                      </div>
                      {q.otherCharges > 0 && (
                        <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                          <span className="text-slate-500">Other / Misc Charges:</span>
                          <span className="font-semibold text-slate-800">₹{Number(q.otherCharges).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 border-b border-dashed border-slate-100">
                        <span className="text-slate-500">Estimated Timeline:</span>
                        <span className="font-semibold text-forest-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {q.estimatedTimeline}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Quote Validity:</span>
                        <span className="font-semibold text-slate-700">{q.validityDays || 30} days</span>
                      </div>
                    </div>

                    {/* Detailed Scope */}
                    <div className="bg-warm-50 rounded-xl p-3 border border-warm-200">
                      <p className="text-xs font-bold text-slate-800 mb-1">Scope of Work Included:</p>
                      <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                        {q.scopeDetails}
                      </p>
                    </div>

                    {/* Exclusions */}
                    {q.exclusions && (
                      <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100">
                        <p className="text-xs font-bold text-rose-800 mb-1">Work Exclusions:</p>
                        <p className="text-xs text-rose-700 whitespace-pre-line leading-relaxed max-h-24 overflow-y-auto">
                          {q.exclusions}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selection Button */}
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                    {isSelected ? (
                      <button disabled className="w-full py-2.5 rounded-xl bg-forest-700 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-gold-400" /> Selected Partner
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectQuote(q._id || q.id)}
                        disabled={isSelecting}
                        className="w-full py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 hover:shadow-md"
                      >
                        Select This Quotation
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
