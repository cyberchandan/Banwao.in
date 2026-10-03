import React from 'react';
import { Building2, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-forest-900 text-white p-8 sm:p-12 rounded-3xl shadow-elevated">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-forest-800 px-3 py-1 rounded-full border border-gold-500/30">
            About Banwao
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading">
            Ghar banana ho ya sajana, sahi logon se Banwao!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Banwao is a dedicated construction and home-services marketplace connecting Indian homeowners with verified local contractors initially across Noida and Greater Noida.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-4">
        <h2 className="text-xl font-bold font-heading text-slate-900">Our Platform Philosophy</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Building a house or renovating your home is one of life’s biggest investments. Banwao was built to bring structure, transparency, and objective comparison to the fragmented local contractor market in NCR.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The platform facilitates discovery and connections. It does not automatically guarantee the lowest price, contractor quality, or work completion, allowing homeowners to evaluate comparable quotations side-by-side with full clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card space-y-2">
          <ShieldCheck className="w-8 h-8 text-gold-500" />
          <h3 className="font-bold text-slate-900 text-base font-heading">Verified Partners</h3>
          <p className="text-xs text-slate-600">Contractor profiles undergo admin verification checks before receiving verified status.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card space-y-2">
          <HeartHandshake className="w-8 h-8 text-forest-700" />
          <h3 className="font-bold text-slate-900 text-base font-heading">Transparent Comparison</h3>
          <p className="text-xs text-slate-600">Compare labour costs, material breakdown, timeline, and scope side-by-side.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card space-y-2">
          <Award className="w-8 h-8 text-amber-600" />
          <h3 className="font-bold text-slate-900 text-base font-heading">Localized Focus</h3>
          <p className="text-xs text-slate-600">Tailored specifically for plot owners and high-rise residents in Noida & Gr. Noida.</p>
        </div>
      </div>
    </div>
  );
};
