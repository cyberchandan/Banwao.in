import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

export const Locations = () => {
  const { city } = useParams();
  const selectedCity = city === 'greater-noida' ? 'Greater Noida' : 'Noida';

  const noidaSectors = [
    'Sector 18 (Commercial & Market)',
    'Sector 50 (Premium Independent Houses & Builder Floors)',
    'Sector 62 (IT Hub & Residential Complexes)',
    'Sector 75 & 78 (7X Sector Modern High-rise & Independent Flats)',
    'Noida Expressway (Sector 128, 137, 142, 150 Luxury Villas)'
  ];

  const grNoidaSectors = [
    'Greater Noida West / Noida Extension (Sectors 1, 2, 4, 16B & Tech Zone)',
    'Pari Chowk & Knowledge Park 1, 2, 3',
    'Alpha 1 & 2, Beta 1 & 2, Gamma 1 & 2',
    'Delta 1, 2 & 3, Zeta 1 & 2, Omega 1 & 2'
  ];

  const currentSectors = selectedCity === 'Greater Noida' ? grNoidaSectors : noidaSectors;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-forest-900 text-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-elevated relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-forest-800/60 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Text & Navigation */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 p-1 bg-forest-950/60 rounded-full border border-forest-800">
              <Link 
                to="/locations/noida" 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCity === 'Noida' ? 'bg-gold-500 text-forest-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                Noida Sectors
              </Link>
              <Link 
                to="/locations/greater-noida" 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCity === 'Greater Noida' ? 'bg-gold-500 text-forest-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                Greater Noida
              </Link>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">
              Construction & Services in <span className="text-gold-400 italic">{selectedCity}</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Banwao connects plot owners and residents in {selectedCity} with verified local contractors for new house construction, builder floors, interior design, and full home remodeling.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                to={`/get-quotes?city=${selectedCity}`}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-forest-950" />
                <span>Get Free Quotes in {selectedCity}</span>
              </Link>
            </div>
          </div>

          {/* Right Side Visual Feature Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500 text-forest-950 flex items-center justify-center font-bold shadow-md shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{selectedCity} Coverage</h4>
                    <p className="text-[10px] text-slate-300">Verified Local Network</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-forest-800 border border-gold-500/30 text-gold-400 text-[10px] font-bold tracking-wide">
                  Active Region
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-forest-950/50 p-3 rounded-xl border border-white/10 text-center lg:text-left">
                  <p className="text-lg font-bold font-heading text-gold-400">50+</p>
                  <p className="text-[11px] text-slate-300 font-medium">Verified Contractors</p>
                </div>
                <div className="bg-forest-950/50 p-3 rounded-xl border border-white/10 text-center lg:text-left">
                  <p className="text-lg font-bold font-heading text-gold-400">24-48h</p>
                  <p className="text-[11px] text-slate-300 font-medium">Avg. Quote Time</p>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2 text-xs text-slate-300 bg-forest-950/30 p-2.5 rounded-xl border border-white/5">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Sector-matched contractors with portfolio validation</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sectors Covered */}
      <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-6">
        <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-forest-700" />
          <span>Active Service Sectors in {selectedCity}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSectors.map((sector, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-warm-50 border border-warm-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <span className="text-xs font-semibold text-slate-800">{sector}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-warm-100 rounded-3xl p-8 border border-warm-200 text-center space-y-4">
        <h3 className="text-2xl font-bold font-heading text-slate-900">Constructing or Renovating in {selectedCity}?</h3>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">Get up to 3 comparable quotations from verified local contractors active in your sector.</p>
        <Link
          to={`/get-quotes?city=${selectedCity}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-card"
        >
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>Get Free Quotes in {selectedCity}</span>
        </Link>
      </div>

    </div>
  );
};
