import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/api';
import { StatusBadge } from '../components/Badge';
import { Search, Clock, FileText, CheckCircle2, Building2 } from 'lucide-react';

export const GuestLeadTrack = () => {
  const [referenceNo, setReferenceNo] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const { addToast } = useToast();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!referenceNo || !phone) {
      addToast('Please enter both reference number and phone number', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch('/leads/guest-track', {
        method: 'POST',
        body: JSON.stringify({ referenceNo, phone })
      });

      if (res.success) {
        setLeadData(res);
        addToast('Enquiry details loaded!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'No lead enquiry found with those details', 'error');
      setLeadData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 font-bold flex items-center justify-center mx-auto shadow-md border border-gold-500/30">
          <Search className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black font-heading text-slate-900">Track Guest Enquiry</h1>
        <p className="text-xs text-slate-500">Enter your Reference Number (e.g. BNW-2026-XXXX) & Phone Number</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-card">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reference Number *</label>
            <input
              type="text"
              required
              placeholder="BNW-2026-1042"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value.toUpperCase())}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1"
            >
              <span>{loading ? 'Searching...' : 'Track Lead'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Box */}
      {leadData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-warm-200 shadow-elevated space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs text-slate-400 font-medium">Reference Code</p>
              <h2 className="text-2xl font-black font-heading text-slate-900">{leadData.lead.referenceNo}</h2>
            </div>
            <StatusBadge status={leadData.lead.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block">Service Needed:</span>
              <span className="font-bold text-slate-800">{leadData.lead.service?.name || 'Service'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block">Location:</span>
              <span className="font-bold text-slate-800">{leadData.lead.location?.sector}, {leadData.lead.location?.city}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block">Quotations Received:</span>
              <span className="font-bold text-forest-800">{leadData.quotationsCount} Quote(s)</span>
            </div>
          </div>

          {/* Quotations summary list */}
          {leadData.quotations && leadData.quotations.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold font-heading text-slate-900 text-base">Submitted Quotations</h3>
              <div className="space-y-3">
                {leadData.quotations.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-warm-50 border border-warm-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{q.contractor?.businessName}</h4>
                      <p className="text-xs text-slate-500">Timeline: {q.estimatedTimeline} • Validity: {q.validityDays} days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black font-heading text-forest-900">₹{Number(q.totalAmount).toLocaleString('en-IN')}</p>
                      <span className="text-[10px] font-bold uppercase text-forest-700">{q.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
