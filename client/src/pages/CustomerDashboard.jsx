import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { StatusBadge } from '../components/Badge';
import { FileText, ChevronRight, Plus, MapPin, Building2, Clock } from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/leads/my-leads')
      .then((res) => {
        if (res.success) setLeads(res.leads);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-warm-200 shadow-card">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">Homeowner Portal</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage your active construction enquiries & contractor quotations.</p>
        </div>

        <Link
          to="/get-quotes"
          className="px-6 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>New Quote Request</span>
        </Link>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-slate-900">Your Enquiries ({leads.length})</h2>

        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="h-28 bg-warm-200/50 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 space-y-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold font-heading text-slate-900">No Active Enquiries</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted any construction or home service requests yet.
            </p>
            <Link to="/get-quotes" className="inline-block px-5 py-2.5 rounded-xl bg-forest-700 text-white text-xs font-bold">
              Submit Your First Enquiry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card hover:shadow-elevated transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-slate-400">{l.referenceNo}</span>
                    <StatusBadge status={l.status} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg font-heading">{l.service?.name || 'Requested Service'}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      {l.location?.sector}, {l.location?.city}
                    </span>
                    <span>• {l.propertyType.replace('_', ' ')}</span>
                    <span className="font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-100">
                      {l.quoteCount} Quotation(s) Received
                    </span>
                  </div>
                </div>

                <Link
                  to={`/customer/leads/${l.id}`}
                  className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0"
                >
                  <span>View Details & Quotes</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
