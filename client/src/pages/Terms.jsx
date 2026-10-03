import React from 'react';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-white rounded-3xl border border-warm-200 shadow-card my-12">
      <h1 className="text-3xl font-bold font-heading text-slate-900">Terms of Service</h1>
      <p className="text-xs text-slate-400">Last updated: October 2026</p>

      <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>Welcome to Banwao. By accessing or using our marketplace platform, you agree to comply with the following Terms of Service.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">1. Marketplace Scope</h2>
        <p>Banwao is an independent online platform connecting homeowners in Noida & Greater Noida with local construction and home repair contractors. The platform facilitates discovery, lead assignment, and side-by-side quotation comparison.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">2. No Automatic Guarantees</h2>
        <p>Banwao facilitates discovery and connections; it does not automatically guarantee the lowest price, contractor quality, or completion of physical work. Homeowners are advised to perform standard diligence and execute formal written agreements with hired contractors.</p>

        <h2 className="text-base font-bold text-slate-900 pt-2">3. User Responsibilities</h2>
        <p>Users must provide accurate project requirements and refrain from submitting fraudulent or malicious lead requests.</p>
      </div>
    </div>
  );
};
