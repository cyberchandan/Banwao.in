import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/api';
import { StatusBadge } from '../components/Badge';
import { QuoteComparisonModal } from '../components/QuoteComparisonModal';
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Clock, 
  Check, 
  Star, 
  ShieldCheck, 
  Sparkles,
  XCircle,
  MessageSquare
} from 'lucide-react';

export const CustomerLeadDetail = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [selecting, setSelecting] = useState(false);
  
  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchLeadDetail = () => {
    setLoading(true);
    apiFetch(`/leads/${id}`)
      .then((res) => {
        if (res.success) {
          setLead(res.lead);
          setQuotations(res.quotations || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeadDetail();
  }, [id]);

  const handleSelectQuotation = async (quotationId) => {
    try {
      setSelecting(true);
      const res = await apiFetch('/quotations/select', {
        method: 'POST',
        body: JSON.stringify({ quotationId })
      });

      if (res.success) {
        addToast(res.message, 'success');
        setComparing(false);
        fetchLeadDetail();
      }
    } catch (err) {
      addToast(err.message || 'Failed to select contractor', 'error');
    } finally {
      setSelecting(false);
    }
  };

  const handleCancelLead = async () => {
    if (!window.confirm('Are you sure you want to cancel this enquiry?')) return;
    try {
      const res = await apiFetch(`/leads/${id}/cancel`, { method: 'PUT' });
      if (res.success) {
        addToast('Enquiry cancelled successfully', 'info');
        fetchLeadDetail();
      }
    } catch (err) {
      addToast(err.message || 'Could not cancel enquiry', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!lead.selectedContractorId) return;

    try {
      setSubmittingReview(true);
      const res = await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          leadId: lead._id,
          contractorId: lead.selectedContractorId._id || lead.selectedContractorId,
          rating,
          title: reviewTitle,
          comment: reviewComment
        })
      });

      if (res.success) {
        addToast(res.message, 'success');
        setShowReviewModal(false);
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto py-20 px-4"><div className="h-96 bg-warm-200/50 animate-pulse rounded-3xl"></div></div>;

  if (!lead) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading">Enquiry Not Found</h2>
        <Link to="/customer/dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-forest-700 text-white text-xs font-bold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link to="/customer/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4" /> Back to Customer Dashboard
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-xs text-slate-400">{lead.referenceNo}</span>
            <StatusBadge status={lead.status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {lead.serviceCategoryId?.name || 'Requested Service'}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-forest-700" />
              {lead.location?.sector}, {lead.location?.city}
            </span>
            <span>• Submitted {new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {quotations.length > 0 && (
            <button
              onClick={() => setComparing(true)}
              className="px-5 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Compare Quotes ({quotations.length})</span>
            </button>
          )}

          {!['completed', 'cancelled', 'closed'].includes(lead.status) && (
            <button
              onClick={handleCancelLead}
              className="p-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold"
              title="Cancel Request"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Details & Quotations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Details */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900">Project Requirements</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{lead.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
              <div className="p-3 rounded-xl bg-warm-50 border border-warm-200">
                <span className="text-slate-400 block">Built-Up Area:</span>
                <span className="font-bold text-slate-800">{lead.builtUpArea || 'N/A'} Sq Ft</span>
              </div>
              <div className="p-3 rounded-xl bg-warm-50 border border-warm-200">
                <span className="text-slate-400 block">Target Budget:</span>
                <span className="font-bold text-slate-800">
                  ₹{Number(lead.budgetRange?.min || 0).toLocaleString('en-IN')} - ₹{Number(lead.budgetRange?.max || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-warm-50 border border-warm-200">
                <span className="text-slate-400 block">Contract Type:</span>
                <span className="font-bold text-slate-800 capitalize">{lead.constructionType.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Quotations List */}
          <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-heading text-slate-900">Contractor Quotations ({quotations.length})</h2>
              {quotations.length > 0 && (
                <button onClick={() => setComparing(true)} className="text-xs font-bold text-forest-700 hover:underline">
                  Open Side-by-Side Matrix
                </button>
              )}
            </div>

            {quotations.length === 0 ? (
              <p className="text-xs text-slate-500">No contractor quotations submitted yet. Your lead has been dispatched to matched pros.</p>
            ) : (
              <div className="space-y-4">
                {quotations.map((q) => {
                  const contractor = q.contractorId;
                  const isSelected = q.status === 'selected';

                  return (
                    <div
                      key={q._id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isSelected ? 'border-2 border-forest-700 bg-forest-50/40' : 'border-warm-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">{contractor?.businessName}</h3>
                            {contractor?.isVerifiedBadge && (
                              <span className="text-[10px] font-bold text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">Timeline: {q.estimatedTimeline} • Validity: {q.validityDays} days</p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-black font-heading text-forest-900">
                            ₹{Number(q.totalAmount).toLocaleString('en-IN')}
                          </p>
                          {isSelected ? (
                            <span className="text-xs font-bold text-forest-800 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-gold-500" /> Selected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSelectQuotation(q._id)}
                              disabled={selecting}
                              className="mt-1 px-4 py-1.5 rounded-lg bg-forest-700 text-white text-xs font-bold shadow-sm"
                            >
                              Select Quote
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Scope:</span> {q.scopeDetails}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review Button if Selected */}
          {lead.selectedContractorId && (
            <div className="bg-forest-900 text-white rounded-3xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold font-heading text-lg">Feedback & Review</h3>
                <p className="text-xs text-slate-300">Rate your experience with {lead.selectedContractorId.businessName}</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gold-500 text-forest-950 font-bold text-xs shadow-md"
              >
                Write Review
              </button>
            </div>
          )}

        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm font-heading">Status Audit Log</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(lead.statusHistory || []).map((h, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between font-bold text-[10px] text-slate-700">
                    <span className="uppercase">{h.status}</span>
                    <span>{new Date(h.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Comparison Modal */}
      <QuoteComparisonModal
        isOpen={comparing}
        onClose={() => setComparing(false)}
        quotations={quotations}
        onSelectQuote={handleSelectQuotation}
        isSelecting={selecting}
      />

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-warm-200 space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">Write Contractor Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">
                  <option value={5}>5 Stars - Excellent Work</option>
                  <option value={4}>4 Stars - Good Experience</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectations</option>
                  <option value={1}>1 Star - Unsatisfactory</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Review Title</label>
                <input type="text" placeholder="e.g. Great quality construction" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Review *</label>
                <textarea rows={3} required placeholder="Describe work quality, adherence to timeline, and communication..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowReviewModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100">Cancel</button>
                <button type="submit" disabled={submittingReview} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-forest-700">{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
