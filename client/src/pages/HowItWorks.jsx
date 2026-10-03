import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ShieldCheck, Users, Calculator, FileText } from 'lucide-react';

export const HowItWorks = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-100 px-3 py-1 rounded-full">
          Transparent Marketplace Process
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-slate-900">How Banwao Works</h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Banwao simplifies home construction and repairs in Noida & Greater Noida.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 font-black text-xl flex items-center justify-center shrink-0">1</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">Submit Your Project Requirement</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Fill out our multi-step form detailing your service type, property specifications, built-up area in sq ft, target budget, desired start date, and location sector in Noida or Greater Noida.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 font-black text-xl flex items-center justify-center shrink-0">2</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">Automatic & Admin Match with Local Pros</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Our backend algorithm matches your enquiry with verified local contractors active in your sector and specialized in your project scope.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 font-black text-xl flex items-center justify-center shrink-0">3</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">Side-by-Side Quotation Comparison</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">View detailed cost estimates detailing labour costs, material breakdown, inclusions, exclusions, and estimated timelines side-by-side on your dashboard.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 font-black text-xl flex items-center justify-center shrink-0">4</div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">Select Sahi Contractor & Commence Work</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Choose your preferred contractor, request a site visit, and proceed with complete confidence.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link to="/get-quotes" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-card">
          <Sparkles className="w-5 h-5 text-gold-400" />
          <span>Get Started Now</span>
        </Link>
      </div>
    </div>
  );
};
