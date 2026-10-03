import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/api';
import { StatusBadge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { 
  ShieldCheck, 
  Building2, 
  FileText, 
  Plus, 
  MapPin, 
  Check, 
  Clock, 
  Upload, 
  AlertCircle,
  X
} from 'lucide-react';

export const ContractorDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quote Submission Modal State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [labourCost, setLabourCost] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [otherCharges, setOtherCharges] = useState('');
  const [scopeDetails, setScopeDetails] = useState('');
  const [exclusions, setExclusions] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  const [estimatedTimeline, setEstimatedTimeline] = useState('2 Months');
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Portfolio Upload Modal
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [submittingPortfolio, setSubmittingPortfolio] = useState(false);

  const fetchDashboard = () => {
    setLoading(true);
    apiFetch('/contractors/portal/dashboard')
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openQuoteModal = (leadObj) => {
    setSelectedLead(leadObj);
    setLabourCost('');
    setMaterialCost('');
    setOtherCharges('');
    setScopeDetails(`Scope of work for ${leadObj.service} in ${leadObj.location?.sector}:\n- RCC structure / brickwork & plaster\n- Premium plumbing & electrical fittings\n- Quality tile flooring & site cleaning.`);
    setExclusions('Municipal clearance fees, electricity meter installation costs.');
    setEstimatedTimeline(leadObj.expectedTimeline || '2 Months');
    setQuoteModalOpen(true);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLead || !labourCost || !scopeDetails) {
      addToast('Please enter labour cost and scope details', 'error');
      return;
    }

    try {
      setSubmittingQuote(true);
      const res = await apiFetch('/quotations', {
        method: 'POST',
        body: JSON.stringify({
          leadId: selectedLead.id,
          labourCost,
          materialCost,
          otherCharges,
          scopeDetails,
          exclusions,
          validityDays,
          estimatedTimeline
        })
      });

      if (res.success) {
        addToast('Quotation submitted successfully!', 'success');
        setQuoteModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit quotation', 'error');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingPortfolio(true);
      const res = await apiFetch('/contractors/portal/portfolio', {
        method: 'POST',
        body: JSON.stringify({
          title: portfolioTitle,
          url: portfolioUrl,
          description: portfolioDesc
        })
      });

      if (res.success) {
        addToast('Portfolio work added successfully!', 'success');
        setPortfolioModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      addToast(err.message || 'Could not add portfolio image', 'error');
    } finally {
      setSubmittingPortfolio(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto py-20 px-4"><div className="h-96 bg-warm-200/50 animate-pulse rounded-3xl"></div></div>;

  const profile = data?.profile;
  const stats = data?.stats;
  const leads = data?.leads || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Profile Banner */}
      <div className="bg-white p-8 rounded-3xl border border-warm-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
              Contractor Partner Portal
            </span>
            <StatusBadge status={profile?.verificationStatus} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {profile?.businessName}
          </h1>
          <p className="text-xs text-slate-500">
            {profile?.experienceYears} Years Exp • Rating: {profile?.ratingAvg} ★ ({profile?.reviewCount} reviews)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPortfolioModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border border-forest-700 text-forest-800 hover:bg-forest-50 font-bold text-xs flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-forest-700" />
            <span>Add Portfolio Work</span>
          </button>
        </div>
      </div>

      {/* Warning Notice if Pending */}
      {profile?.verificationStatus === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Your contractor registration is currently under admin document review. The Verified Badge will appear once checks are completed. You can view assigned leads and prepare draft quotations in the meantime.
          </span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Assigned Leads" value={stats?.totalAssigned || 0} icon={FileText} color="forest" />
        <StatCard title="Submitted Quotes" value={stats?.totalQuoted || 0} icon={Building2} color="blue" />
        <StatCard title="Selected Quotes" value={stats?.totalSelected || 0} icon={ShieldCheck} color="gold" />
        <StatCard title="Profile Score" value={`${profile?.completeness || 70}%`} icon={Check} color="green" />
      </div>

      {/* Lead Inbox Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-slate-900">Lead Inbox & Matching Requests ({leads.length})</h2>

        {leads.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold font-heading text-slate-900">No Leads Assigned Yet</h3>
            <p className="text-xs text-slate-500">When new customer enquiries match your service category and sector in Noida/Greater Noida, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((item) => {
              const lead = item.lead;
              const hasQuoted = item.assignmentStatus === 'quoted';

              return (
                <div
                  key={item.assignmentId}
                  className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card space-y-4"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-slate-400">{lead.referenceNo}</span>
                        <StatusBadge status={lead.status} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg font-heading">{lead.service}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-forest-700" />
                          {lead.location?.sector}, {lead.location?.city}
                        </span>
                        <span>• Built Area: {lead.builtUpArea || 'N/A'} Sq Ft</span>
                        <span>• Target: ₹{Number(lead.budgetRange?.min || 0).toLocaleString('en-IN')} - ₹{Number(lead.budgetRange?.max || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => openQuoteModal(lead)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1 ${
                          hasQuoted ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-forest-700 text-white hover:bg-forest-800'
                        }`}
                      >
                        {hasQuoted ? 'Edit Quotation' : 'Submit Quotation'}
                      </button>
                    </div>
                  </div>

                  {/* Requirements Text */}
                  <div className="p-4 rounded-xl bg-warm-50 border border-warm-200 text-xs text-slate-600">
                    <p className="font-bold text-slate-800 mb-1">Customer Requirements:</p>
                    <p className="line-clamp-3">{lead.description}</p>
                    <p className="text-[11px] text-forest-800 mt-2 font-semibold">Match Reason: {item.matchReason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUOTE SUBMISSION MODAL */}
      {quoteModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-elevated border border-warm-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400">Ref: {selectedLead.referenceNo}</span>
                <h3 className="text-xl font-bold font-heading text-slate-900">Submit Custom Quotation</h3>
              </div>
              <button onClick={() => setQuoteModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Labour Cost (₹) *</label>
                  <input type="number" required placeholder="e.g. 150000" value={labourCost} onChange={(e) => setLabourCost(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material Cost (₹)</label>
                  <input type="number" placeholder="e.g. 350000" value={materialCost} onChange={(e) => setMaterialCost(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Other / Misc Charges (₹)</label>
                  <input type="number" placeholder="e.g. 20000" value={otherCharges} onChange={(e) => setOtherCharges(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold" />
                </div>
              </div>

              <div className="bg-forest-50 p-3 rounded-xl border border-forest-200 text-center">
                <span className="text-slate-600 font-medium">Calculated Total Estimate: </span>
                <span className="font-black text-lg text-forest-900">
                  ₹{(Number(labourCost || 0) + Number(materialCost || 0) + Number(otherCharges || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Timeline *</label>
                  <input type="text" required placeholder="e.g. 45 Days" value={estimatedTimeline} onChange={(e) => setEstimatedTimeline(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quote Validity (Days)</label>
                  <input type="number" value={validityDays} onChange={(e) => setValidityDays(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scope of Work Included *</label>
                <textarea rows={4} required value={scopeDetails} onChange={(e) => setScopeDetails(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Exclusions</label>
                <textarea rows={2} value={exclusions} onChange={(e) => setExclusions(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setQuoteModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold">Cancel</button>
                <button type="submit" disabled={submittingQuote} className="px-6 py-2.5 rounded-xl bg-forest-700 text-white font-bold">{submittingQuote ? 'Submitting...' : 'Submit Quotation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTFOLIO UPLOAD MODAL */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-warm-200 space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">Add Portfolio Project Work</h3>
            <form onSubmit={handlePortfolioSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
                <input type="text" required placeholder="e.g. 3BHK Renovation - Sec 50 Noida" value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL *</label>
                <input type="url" required placeholder="https://images.unsplash.com/..." value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
                <textarea rows={2} placeholder="Brief summary of executed work..." value={portfolioDesc} onChange={(e) => setPortfolioDesc(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setPortfolioModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold">Cancel</button>
                <button type="submit" disabled={submittingPortfolio} className="px-5 py-2 rounded-xl text-white bg-forest-700 font-bold">{submittingPortfolio ? 'Adding...' : 'Add Work'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
