import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">Contact Banwao Support</h1>
        <p className="text-slate-600 text-sm">We are here to assist homeowners and contractor partners in Noida & Gr. Noida.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-forest-900 text-white rounded-3xl p-8 space-y-6 shadow-elevated">
          <h2 className="text-xl font-bold font-heading">Get in Touch</h2>
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
              <span>Banwao Marketplace Hub, Sector 62, Noida, Uttar Pradesh 201309, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold-400 shrink-0" />
              <span>+91 (120) 456-7890</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold-400 shrink-0" />
              <span>support@banwao.in</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-warm-200 shadow-card">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-forest-700 mx-auto" />
              <h3 className="text-lg font-bold font-heading text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-600">Thank you for reaching out. Our support representative will respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold font-heading text-slate-900">Send Us a Message</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input required type="text" placeholder="Full Name" className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email / Phone</label>
                <input required type="text" placeholder="Email or Phone Number" className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea required rows={4} placeholder="How can we help you?" className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
