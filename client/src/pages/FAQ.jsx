import React from 'react';
import { HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const list = [
    { q: 'Is Banwao free to use for homeowners?', a: 'Yes! Submitting requirements and receiving comparable quotations is completely free for homeowners.' },
    { q: 'Does Banwao guarantee contractor work or lowest prices?', a: 'Banwao is a discovery and matching marketplace. It facilitates transparent connection and comparison. It does not automatically guarantee the lowest price or work completion.' },
    { q: 'How do contractors get verified?', a: 'Contractors undergo admin document verification, experience checks, and portfolio audits before receiving the Verified badge.' },
    { q: 'Can I track my enquiry without creating an account?', a: 'Yes! Guest users receive a unique lead reference number (e.g., BNW-2026-XXXX) and can track their enquiry using their phone number.' },
    { q: 'Which regions are served?', a: 'Banwao initially serves all sectors of Noida and Greater Noida, India.' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black font-heading text-slate-900">Frequently Asked Questions</h1>
        <p className="text-slate-600 text-sm">Answers to common questions about Banwao marketplace</p>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-forest-700 shrink-0" />
              <span>{item.q}</span>
            </h3>
            <p className="text-xs text-slate-600 ml-7 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
