import React, { useState, useEffect } from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { apiFetch } from '../services/api';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/projects')
      .then((res) => { if (res.success) setProjects(res.projects); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="bg-forest-900 text-white p-8 sm:p-12 rounded-3xl shadow-elevated relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-forest-800 px-3 py-1 rounded-full border border-gold-500/30">
            Noida & Gr. Noida Architectural Gallery
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading">
            Completed Projects Portfolio
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Explore recent house construction, independent floors, and home renovation projects completed by local contractors.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 bg-warm-200/50 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-card hover:shadow-elevated transition-all space-y-4">
              <div className="h-56 overflow-hidden">
                <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-forest-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.location?.sector}, {p.location?.city}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-heading">{p.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{p.description}</p>
                {p.estimatedCostRange && (
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-400">Budget Range:</span>
                    <span className="font-bold text-slate-800">{p.estimatedCostRange}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
