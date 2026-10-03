import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShieldCheck, Star, MapPin, Award, Building2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export const ContractorDirectory = () => {
  const [contractors, setContractors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/services')
      .then((res) => { if (res.success) setCategories(res.categories); })
      .catch(() => {});
  }, []);

  const fetchContractors = () => {
    setLoading(true);
    let url = `/contractors?search=${encodeURIComponent(search)}&category=${category}&verifiedOnly=${verifiedOnly}`;
    apiFetch(url)
      .then((res) => {
        if (res.success) setContractors(res.contractors);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContractors();
  }, [category, verifiedOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContractors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Directory Banner */}
      <div className="bg-forest-900 text-white p-8 sm:p-12 rounded-3xl shadow-elevated relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-forest-800 px-3 py-1 rounded-full border border-gold-500/30">
            Noida & Greater Noida Verified Network
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading">
            Contractor Directory
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Browse verified local builders, painters, renovators, and home maintenance contractors.
          </p>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-warm-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        <form onSubmit={handleSearchSubmit} className="md:col-span-5 flex items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search business name, skill or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-slate-900"
          />
        </form>

        <div className="md:col-span-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none"
          >
            <option value="">All Service Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 w-full">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-forest-700 focus:ring-forest-500"
            />
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>Verified Badge Only</span>
          </label>
        </div>

      </div>

      {/* Contractor Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-warm-200/50 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : contractors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold font-heading text-slate-900">No Contractors Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contractors.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 font-black font-heading text-lg flex items-center justify-center border border-forest-200">
                    {c.businessName.charAt(0)}
                  </div>
                  {c.isVerifiedBadge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-500" /> Verified Partner
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg font-heading">{c.businessName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" /> {c.ratingAvg || 4.5}
                    </span>
                    <span>({c.reviewCount || 0} reviews)</span>
                    <span>• {c.experienceYears} yrs exp</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{c.description}</p>

                {/* Service areas */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  <span className="truncate">{(c.serviceAreas || []).slice(0, 3).join(', ')}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/contractors/${c.id}`}
                  className="text-xs font-bold text-forest-700 hover:text-forest-900"
                >
                  View Full Profile & Works →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
