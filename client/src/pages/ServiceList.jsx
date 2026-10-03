import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight, Sparkles, Building2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export const ServiceList = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/services')
      .then((res) => {
        if (res.success) setCategories(res.categories);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.shortDesc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="bg-forest-900 text-white p-8 sm:p-12 rounded-3xl shadow-elevated relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-forest-800 px-3 py-1 rounded-full border border-gold-500/30">
            Noida & Greater Noida Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading">
            Home Construction & Maintenance Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Select a service category to request comparable estimates from verified local contractors.
          </p>
        </div>
      </div>

      {/* Filter & Search Input */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-warm-200 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Filter services (e.g. Painting, Waterproofing, Turnkey...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-2 text-sm bg-transparent outline-none text-slate-900"
        />
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-warm-200/60 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold font-heading text-lg">
                  {cat.name}
                </h3>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed">{cat.shortDesc}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services/${cat.slug}`}
                    className="text-xs font-bold text-slate-700 hover:text-forest-700 flex items-center gap-1"
                  >
                    <span>View Service Guide</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/get-quotes?category=${cat.slug}`}
                    className="px-3.5 py-1.5 rounded-lg bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>Get Quotes</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
