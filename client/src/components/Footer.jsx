import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Footer = () => {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = () => {
      apiFetch('/services/settings/public')
        .then((res) => { if (res.success) setSiteSettings(res.settings); })
        .catch(() => {});
    };

    fetchSettings();

    window.addEventListener('site-settings-updated', fetchSettings);
    return () => window.removeEventListener('site-settings-updated', fetchSettings);
  }, []);

  const name = siteSettings?.siteName || 'Banwao';
  const phone = siteSettings?.contactPhone || '+91 98765 43210';
  const email = siteSettings?.supportEmail || 'support@banwao.in';
  const address = siteSettings?.officeAddress || 'Sector 62, Noida, Uttar Pradesh';
  const desc = siteSettings?.footerDescription || "Noida & Greater Noida's leading marketplace connecting homeowners with verified local construction contractors.";
  const copyright = siteSettings?.footerCopyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`;

  return (
    <footer className="bg-forest-950 text-slate-300 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              {siteSettings?.logoImageUrl ? (
                <img src={siteSettings.logoImageUrl} alt={name} className="h-10 w-auto object-contain rounded-lg" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center border border-gold-500/40">
                  <Building2 className="w-5 h-5" />
                </div>
              )}
              <span className="text-2xl font-bold font-heading text-white">
                {name}
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              “Ghar banana ho ya sajana, sahi logon se Banwao!”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {desc}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-forest-900">
              <p className="flex items-center gap-2 text-forest-300">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Phone: {phone}</span>
              </p>
              <p className="flex items-center gap-2 text-forest-300">
                <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Email: {email}</span>
              </p>
              <p className="flex items-center gap-2 text-forest-300">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Office: {address}</span>
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-gold-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Local Contractors • Transparent Quotes</span>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Popular Services</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/services/new-construction" className="hover:text-gold-400 transition-colors">New House Construction</Link></li>
              <li><Link to="/services/turnkey-construction" className="hover:text-gold-400 transition-colors">Turnkey Material + Labour</Link></li>
              <li><Link to="/services/independent-floor-construction" className="hover:text-gold-400 transition-colors">Independent Floor Floors</Link></li>
              <li><Link to="/services/home-renovation" className="hover:text-gold-400 transition-colors">Home Renovation</Link></li>
              <li><Link to="/services/painting-services" className="hover:text-gold-400 transition-colors">Painting & Texture</Link></li>
              <li><Link to="/services/waterproofing" className="hover:text-gold-400 transition-colors">Roof Waterproofing</Link></li>
              <li><Link to="/services" className="text-gold-400 font-medium hover:underline">View All Services →</Link></li>
            </ul>
          </div>

          {/* Locations Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Service Areas</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/locations" className="hover:text-gold-400 transition-colors">Noida Sector 62 & Central</Link></li>
              <li><Link to="/locations" className="hover:text-gold-400 transition-colors">Noida Sector 50 & 75</Link></li>
              <li><Link to="/locations" className="hover:text-gold-400 transition-colors">Noida Expressway (Sec 128, 137, 150)</Link></li>
              <li><Link to="/locations" className="hover:text-gold-400 transition-colors">Greater Noida West (Extension)</Link></li>
              <li><Link to="/locations" className="hover:text-gold-400 transition-colors">Pari Chowk & Knowledge Park</Link></li>
              <li><Link to="/locations" className="hover:text-gold-400 transition-colors">Omega, Alpha & Zeta Sectors</Link></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Company & Legal</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/how-it-works" className="hover:text-gold-400 transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About {name}</Link></li>
              <li><Link to="/contractors" className="hover:text-gold-400 transition-colors">Contractor Directory</Link></li>
              <li><Link to="/register?role=contractor" className="text-gold-400 hover:underline">Join as a Contractor</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-gold-400 transition-colors">FAQs</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-gold-400 transition-colors">Dispute Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-forest-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>{copyright}</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Serving homeowners & verified contractors in Noida & Greater Noida, India.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
