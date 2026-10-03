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
      <div className="bg-forest-900 text-white p-8 sm:p-12 rounded-3xl shadow-elevated relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <Link to="/locations/noida" className={`px-3 py-1 rounded-full text-xs font-bold ${selectedCity === 'Noida' ? 'bg-gold-500 text-forest-950' : 'bg-forest-800 text-slate-300'}`}>Noida</Link>
            <Link to="/locations/greater-noida" className={`px-3 py-1 rounded-full text-xs font-bold ${selectedCity === 'Greater Noida' ? 'bg-gold-500 text-forest-950' : 'bg-forest-800 text-slate-300'}`}>Greater Noida</Link>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading">
            Construction & Services in {selectedCity}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Banwao connects plot owners and residents in {selectedCity} with verified local contractors for new house construction, independent floors, and remodeling.
          </p>
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
