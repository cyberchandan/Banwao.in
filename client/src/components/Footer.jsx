import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Footer = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);

  useEffect(() => {
    const fetchFooterData = () => {
      apiFetch('/services/settings/public')
        .then((res) => { if (res.success) setSiteSettings(res.settings); })
        .catch(() => {});

      apiFetch('/services')
        .then((res) => { if (res.success) setCategories(res.categories || []); })
        .catch(() => {});

      apiFetch('/services/areas/all')
        .then((res) => { if (res.success) setServiceAreas(res.areas || []); })
        .catch(() => {});
    };

    fetchFooterData();

    window.addEventListener('site-settings-updated', fetchFooterData);
    window.addEventListener('categories-updated', fetchFooterData);
    window.addEventListener('service-areas-updated', fetchFooterData);

    return () => {
      window.removeEventListener('site-settings-updated', fetchFooterData);
      window.removeEventListener('categories-updated', fetchFooterData);
      window.removeEventListener('service-areas-updated', fetchFooterData);
    };
  }, []);

  const name = siteSettings?.siteName || 'Banwao';
  const tagline = siteSettings?.footerTagline || '“Ghar banana ho ya sajana, sahi logon se Banwao!”';
  const servingText = siteSettings?.footerServingText || 'Serving homeowners & verified contractors in Noida & Greater Noida, India.';
  const phone = siteSettings?.contactPhone || '+91 98765 43210';
  const email = siteSettings?.supportEmail || 'support@banwao.in';
  const address = siteSettings?.officeAddress || 'Sector 62, Noida, Uttar Pradesh';
  const desc = siteSettings?.footerDescription || "Noida & Greater Noida's leading marketplace connecting homeowners with verified local construction contractors.";
  const copyright = siteSettings?.footerCopyright || `© ${new Date().getFullYear()} ${name}. All rights reserved.`;

  const col1Title = siteSettings?.footerCol1Title || 'POPULAR SERVICES';
  const col2Title = siteSettings?.footerCol2Title || 'SERVICE AREAS';
  const col3Title = siteSettings?.footerCol3Title || 'COMPANY & LEGAL';

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
              {tagline}
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

          {/* Dynamic Services Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">{col1Title}</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/services/${cat.slug}`} className="hover:text-gold-400 transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/services/new-house-construction" className="hover:text-gold-400 transition-colors">New House Construction</Link></li>
                  <li><Link to="/services/turnkey-construction" className="hover:text-gold-400 transition-colors">Turnkey Material + Labour</Link></li>
                  <li><Link to="/services/independent-floor-construction" className="hover:text-gold-400 transition-colors">Independent Floor Construction</Link></li>
                  <li><Link to="/services/home-renovation" className="hover:text-gold-400 transition-colors">Home Renovation</Link></li>
                  <li><Link to="/services/painting-services" className="hover:text-gold-400 transition-colors">Painting & Texture</Link></li>
                  <li><Link to="/services/roof-waterproofing" className="hover:text-gold-400 transition-colors">Roof Waterproofing</Link></li>
                </>
              )}
              <li className="pt-1"><Link to="/services" className="text-gold-400 font-medium hover:underline">View All Services →</Link></li>
            </ul>
          </div>

          {/* Dynamic Service Areas Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">{col2Title}</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {serviceAreas.length > 0 ? (
                serviceAreas.slice(0, 6).map((area) => (
                  <li key={area._id}>
                    <Link to={`/locations/${area.city.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-gold-400 transition-colors">
                      {area.sector} ({area.city})
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/locations/noida" className="hover:text-gold-400 transition-colors">Noida Sector 62 & Central</Link></li>
                  <li><Link to="/locations/noida" className="hover:text-gold-400 transition-colors">Noida Sector 50 & 75</Link></li>
                  <li><Link to="/locations/noida" className="hover:text-gold-400 transition-colors">Noida Expressway Sectors</Link></li>
                  <li><Link to="/locations/greater-noida" className="hover:text-gold-400 transition-colors">Greater Noida West (Extension)</Link></li>
                  <li><Link to="/locations/greater-noida" className="hover:text-gold-400 transition-colors">Pari Chowk & Knowledge Park</Link></li>
                  <li><Link to="/locations/greater-noida" className="hover:text-gold-400 transition-colors">Alpha, Beta & Gamma Sectors</Link></li>
                </>
              )}
              <li className="pt-1"><Link to="/locations" className="text-gold-400 font-medium hover:underline">View All Locations →</Link></li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">{col3Title}</h3>
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
            <span>{servingText}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
