import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building2, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { apiFetch } from '../services/api';

export const ServiceDetail = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiFetch(`/services/${slug}`)
      .then((res) => {
        if (res.success) setCategory(res.category);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="max-w-5xl mx-auto py-20 px-4"><div className="h-96 bg-warm-200/50 animate-pulse rounded-3xl"></div></div>;
  }

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading">Service Category Not Found</h2>
        <p className="text-slate-600 text-sm">The requested service area could not be found.</p>
        <Link to="/services" className="inline-block px-5 py-2.5 rounded-xl bg-forest-700 text-white text-sm font-bold">
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </button>

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-elevated bg-forest-900 text-white min-h-[300px] flex items-end p-8 sm:p-12 border border-forest-800">
        <img
          src={category.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop'}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-400 bg-forest-800/90 px-3 py-1 rounded-full border border-gold-500/30">
            Noida & Greater Noida Service Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading">{category.name}</h1>
          <p className="text-slate-200 text-sm sm:text-base">{category.shortDesc}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900">Service Overview & Scope</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {category.fullDesc || category.shortDesc}
            </p>

            <div className="pt-4 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">What is included in Banwao quotes?</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>Itemized breakdown of Labour cost and Material specifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>Clear exclusions list and milestone timeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>Verified local contractors active in your sector</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Sticky CTA */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl p-6 border border-warm-200 shadow-elevated space-y-6">
            <div className="space-y-2">
              <h3 className="font-bold font-heading text-slate-900 text-lg">Need {category.name}?</h3>
              <p className="text-xs text-slate-500">Get up to 3 comparable quotations from verified local contractors.</p>
            </div>

            <Link
              to={`/get-quotes?category=${category.slug}`}
              className="w-full py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-card transition-all"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Get Free Quotes</span>
            </Link>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-forest-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold-500" />
              <span>No commitment • 100% Free</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
