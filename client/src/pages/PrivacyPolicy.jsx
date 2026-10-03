import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-white rounded-3xl border border-warm-200 shadow-card my-12">
      <h1 className="text-3xl font-bold font-heading text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last updated: October 2026</p>

      <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>At Banwao, we respect your privacy and are committed to protecting personal data collected through our construction marketplace platform.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">1. Data Collection</h2>
        <p>We collect essential information required to connect homeowners with suitable contractors, including your name, contact phone, email, project locality sector, built-up area, and project budget.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">2. Data Usage & Contractor Matching</h2>
        <p>Your project details and approximate location are shared only with matched, authorized contractor partners for the purpose of providing comparable cost estimates. Private contact details are protected and never sold to third-party telemarketers.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">3. Cookies & Security</h2>
        <p>We use secure HttpOnly authentication cookies to maintain session security. All communications are protected under standard encryption protocol.</p>
      </div>
    </div>
  );
};
