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
  Edit,
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

  // Edit Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editExperienceYears, setEditExperienceYears] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editServiceAreas, setEditServiceAreas] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Portfolio Upload Modal
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [uploadingPortfolioImg, setUploadingPortfolioImg] = useState(false);
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

  const profile = data?.profile;
  const stats = data?.stats;
  const leads = data?.leads || [];

  const openProfileModal = () => {
    if (profile) {
      setEditBusinessName(profile.businessName || '');
      setEditExperienceYears(profile.experienceYears || '0');
      setEditDescription(profile.description || '');
      setEditSkills(Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '');
      setEditServiceAreas(Array.isArray(profile.serviceAreas) ? profile.serviceAreas.join(', ') : profile.serviceAreas || '');
    }
    setProfileModalOpen(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await apiFetch('/contractors/portal/profile', {
        method: 'PUT',
        body: JSON.stringify({
          businessName: editBusinessName,
          experienceYears: Number(editExperienceYears),
          description: editDescription,
          skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
          serviceAreas: editServiceAreas.split(',').map(s => s.trim()).filter(Boolean)
        })
      });

      if (res.success) {
        addToast('Business profile details updated successfully!', 'success');
        setProfileModalOpen(false);
        fetchDashboard();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update business profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

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

  const handlePortfolioFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingPortfolioImg(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const resData = await response.json();
      if (resData.success) {
        setPortfolioUrl(resData.url);
        addToast('Photo uploaded from system!', 'success');
      } else {
        addToast(resData.message || 'Upload failed', 'error');
      }
    } catch (err) {
      addToast('Error uploading file', 'error');
    } finally {
      setUploadingPortfolioImg(false);
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
        setPortfolioTitle('');
        setPortfolioUrl('');
        setPortfolioDesc('');
        fetchDashboard();
      }
    } catch (err) {
      addToast(err.message || 'Could not add portfolio image', 'error');
    } finally {
      setSubmittingPortfolio(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto py-20 px-4"><div className="h-96 bg-warm-200/50 animate-pulse rounded-3xl"></div></div>;

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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openProfileModal}
            className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Edit className="w-4 h-4 text-gold-400" />
            <span>Edit Business Profile</span>
          </button>
          
          <button
            onClick={() => setPortfolioModalOpen(true)}
            className="px-5 py-2.5 rounded-xl border border-forest-700 text-forest-800 hover:bg-forest-50 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
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

      {/* Active Business Profile Card Overview */}
      <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base font-heading text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-forest-700" />
            <span>Public Business Profile Details</span>
          </h3>
          <button
            onClick={openProfileModal}
            className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="md:col-span-2 space-y-2">
            <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">About Business Description</p>
            <p className="text-slate-700 leading-relaxed bg-warm-50 p-4 rounded-2xl border border-warm-200">
              {profile?.description || 'No business description provided yet. Click "Edit Business Profile" to add details about your company.'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">Specialization Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-forest-50 text-forest-800 rounded-lg border border-forest-200 font-semibold text-[11px]">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">No skills specified</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1.5">Service Areas Covered</p>
              <div className="flex flex-wrap gap-1.5">
                {profile?.serviceAreas && profile.serviceAreas.length > 0 ? (
                  profile.serviceAreas.map((area, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 font-semibold text-[11px]">
                      {area}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">Noida & Greater Noida</span>
                )}
              </div>
            </div>
          </div>
        </div>
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

      {/* EDIT BUSINESS PROFILE MODAL */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-elevated border border-warm-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Contractor Settings</span>
                <h3 className="text-xl font-bold font-heading text-slate-900">Edit Contractor Business Details</h3>
              </div>
              <button onClick={() => setProfileModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Firm / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={editBusinessName}
                    onChange={(e) => setEditBusinessName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
                    placeholder="e.g. Vishvanath Building Contractor"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Years of Experience *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editExperienceYears}
                    onChange={(e) => setEditExperienceYears(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">About Business Description</label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none leading-relaxed text-slate-900"
                  placeholder="Describe your firm's construction expertise, materials used, past client work, and reliability..."
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialization Skills & Offerings (Comma-separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. Turnkey Construction, Interior Fit-out, Waterproofing, Architectural Design"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Sectors Covered (Comma-separated)</label>
                <input
                  type="text"
                  value={editServiceAreas}
                  onChange={(e) => setEditServiceAreas(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. Sector 50, Sector 62, Noida Expressway, Greater Noida West"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-7 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold shadow-md transition-all"
                >
                  {savingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

              {/* Photo Upload from System */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Project Photo Upload</label>
                <label className="block cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 text-forest-900 border-2 border-dashed border-slate-300 rounded-xl transition-all font-bold shadow-sm">
                    <Upload className="w-4 h-4 text-gold-600" />
                    <span>{uploadingPortfolioImg ? 'Uploading Photo...' : 'Upload Photo from System'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePortfolioFileUpload}
                    disabled={uploadingPortfolioImg}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Or Image URL *</label>
                <input type="url" required placeholder="https://images.unsplash.com/..." value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono" />
              </div>
              
              {portfolioUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
                  <img src={portfolioUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

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
