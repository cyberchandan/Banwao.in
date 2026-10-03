import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Award, CheckCircle2, ArrowLeft, Sparkles, Building2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export const ContractorProfile = () => {
  const { id } = useParams();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/contractors/${id}`)
      .then((res) => {
        if (res.success) setContractor(res.contractor);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto py-20 px-4"><div className="h-96 bg-warm-200/50 animate-pulse rounded-3xl"></div></div>;

  if (!contractor) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading">Contractor Not Found</h2>
        <p className="text-slate-600 text-sm">The requested contractor profile is not available.</p>
        <Link to="/contractors" className="inline-block px-5 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-bold">
          Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <Link to="/contractors" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4" /> Back to Contractor Directory
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-forest-900 text-gold-400 font-black font-heading text-3xl flex items-center justify-center shadow-md border border-gold-500/30 shrink-0">
            {contractor.businessName.charAt(0)}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">{contractor.businessName}</h1>
              {contractor.isVerifiedBadge && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
                  <ShieldCheck className="w-4 h-4 text-gold-500" /> Banwao Verified Partner
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current mr-1" /> {contractor.ratingAvg || 4.8}
              </span>
              <span>({contractor.reviewCount || 0} reviews)</span>
              <span>• {contractor.experienceYears} Years Experience</span>
            </div>
          </div>
        </div>

        <Link
          to="/get-quotes"
          className="px-6 py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-card flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Request Quotation</span>
        </Link>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Info */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900">About Business</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{contractor.description}</p>
          </div>

          {/* Portfolio Images */}
          {contractor.portfolioImages && contractor.portfolioImages.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-4">
              <h2 className="text-xl font-bold font-heading text-slate-900">Approved Project Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contractor.portfolioImages.map((img, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm space-y-2">
                    <img src={img.url} alt={img.title} className="w-full h-44 object-cover" />
                    <div className="p-3">
                      <h4 className="font-bold text-xs text-slate-900">{img.title}</h4>
                      {img.description && <p className="text-[11px] text-slate-500 mt-0.5">{img.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900">Customer Feedback & Reviews ({contractor.reviews?.length || 0})</h2>
            {contractor.reviews && contractor.reviews.length > 0 ? (
              <div className="space-y-4">
                {contractor.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">{rev.customerName}</span>
                      <span className="flex items-center text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" /> {rev.rating} / 5
                      </span>
                    </div>
                    {rev.title && <h4 className="font-semibold text-xs text-slate-900">{rev.title}</h4>}
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No public customer reviews recorded yet.</p>
            )}
          </div>

        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4">
            <h3 className="font-bold font-heading text-slate-900 text-base">Service Areas Covered</h3>
            <div className="flex flex-wrap gap-2">
              {(contractor.serviceAreas || []).map((area, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-forest-50 text-forest-800 text-xs font-semibold border border-forest-200">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4">
            <h3 className="font-bold font-heading text-slate-900 text-base">Specialized Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(contractor.skills || []).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
