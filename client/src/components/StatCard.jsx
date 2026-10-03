import React from 'react';

export const StatCard = ({ icon: Icon, title, value, subtitle, color = 'forest' }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-warm-200 hover:shadow-elevated transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold font-heading text-slate-900 mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            color === 'gold' ? 'bg-gold-50 text-gold-700 border border-gold-200' :
            color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            color === 'green' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            'bg-forest-50 text-forest-800 border border-forest-200'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
