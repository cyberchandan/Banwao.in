import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/api';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/Badge';
import { 
  ShieldCheck, 
  FileText, 
  Users, 
  Download, 
  Search, 
  Check, 
  X, 
  AlertTriangle,
  UserCheck,
  Building2,
  ListFilter,
  Radio,
  Lock,
  Unlock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Globe,
  Layers,
  Sparkles,
  Eye,
  Star,
  Clock,
  ExternalLink,
  Settings,
  Megaphone,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [tab, setTab] = useState('leads'); // 'leads' | 'contractors' | 'cms' | 'activity'
  const [cmsSubTab, setCmsSubTab] = useState('categories'); // 'categories' | 'areas' | 'settings'

  const [metrics, setMetrics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLead, setSearchLead] = useState('');
  const [searchContractor, setSearchContractor] = useState('');

  // Lead Action Modals
  const [selectedLead, setSelectedLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  // Quotes Inspection Modal State
  const [quotesModalOpen, setQuotesModalOpen] = useState(false);
  const [inspectingLead, setInspectingLead] = useState(null);
  const [leadQuotations, setLeadQuotations] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  // Manual Assignment State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedContractorId, setSelectedContractorId] = useState('');
  const [assignReason, setAssignReason] = useState('Manual Admin Lead Routing');
  const [broadcasting, setBroadcasting] = useState(false);

  // CMS State
  const [categories, setCategories] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Banwao',
    siteTagline: 'Noida & Greater Noida',
    logoImageUrl: '',
    announcementText: '',
    isAnnouncementVisible: true,
    announcementLink: '/get-quotes',
    contactPhone: '',
    whatsappPhone: '',
    supportEmail: '',
    officeAddress: '',
    heroBadgeText: '',
    heroHeadline: '',
    heroHeadlineColor: '#ffffff',
    heroHeadlineAccentColor: '#f59e0b',
    heroHeadlineFontSize: 'large',
    heroSubheadline: '',
    heroImageUrl: '',
    heroCardTitle: '',
    heroCardSubtitle: '',
    heroStat1Number: '',
    heroStat1Label: '',
    heroStat2Number: '',
    heroStat2Label: '',
    heroStat3Number: '',
    heroStat3Label: '',
    footerDescription: '',
    footerCopyright: ''
  });

  // CMS Category Form Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    icon: 'Wrench',
    shortDesc: '',
    fullDesc: '',
    isPopular: false,
    imageUrl: '',
    displayOrder: 0,
    isActive: true
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingImage(true);
      const res = await apiFetch('/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (res.success && res.url) {
        addToast('Photo uploaded successfully from system!', 'success');
        setCategoryForm((prev) => ({ ...prev, imageUrl: res.url }));
      }
    } catch (err) {
      addToast(err.message || 'Photo upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSettingsFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadingImage(true);
      const res = await apiFetch('/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (res.success && res.url) {
        addToast('Image uploaded successfully from system!', 'success');
        setSiteSettings((prev) => ({ ...prev, [fieldName]: res.url }));
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // CMS Service Area Form Modal
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [areaForm, setAreaForm] = useState({
    city: 'Noida',
    sector: '',
    pincode: '',
    isActive: true
  });

  const fetchAdminData = () => {
    setLoading(true);
    apiFetch('/admin/dashboard')
      .then((res) => {
        if (res.success) {
          setMetrics(res.metrics);
          setActivities(res.recentActivities || []);
        }
      })
      .catch((err) => console.error(err));

    apiFetch('/admin/leads')
      .then((res) => { if (res.success) setLeads(res.leads); })
      .catch((err) => console.error(err));

    apiFetch('/admin/contractors')
      .then((res) => { if (res.success) setContractors(res.contractors); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchCMSData = () => {
    apiFetch('/admin/categories')
      .then((res) => { if (res.success) setCategories(res.categories); })
      .catch((err) => console.error(err));

    apiFetch('/admin/areas')
      .then((res) => { if (res.success) setServiceAreas(res.areas); })
      .catch((err) => console.error(err));

    apiFetch('/services/settings/public')
      .then((res) => { if (res.success && res.settings) setSiteSettings(res.settings); })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAdminData();
    fetchCMSData();
  }, []);

  // Inspect Quotations for a lead
  const handleInspectQuotations = async (lead) => {
    setInspectingLead(lead);
    setQuotesModalOpen(true);
    setLoadingQuotes(true);
    try {
      const res = await apiFetch(`/admin/leads/${lead._id}/quotations`);
      if (res.success) {
        setLeadQuotations(res.quotations || []);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch quotations', 'error');
    } finally {
      setLoadingQuotes(false);
    }
  };

  // Admin selects quote on behalf of customer
  const handleAdminSelectQuote = async (quotationId) => {
    if (!window.confirm('Select this quotation for the customer deal?')) return;
    try {
      const res = await apiFetch('/quotations/select', {
        method: 'POST',
        body: JSON.stringify({ quotationId })
      });
      if (res.success) {
        addToast(res.message, 'success');
        setQuotesModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Quote selection failed', 'error');
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      const res = await apiFetch(`/admin/leads/${selectedLead._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, adminNotes })
      });

      if (res.success) {
        addToast(res.message, 'success');
        setStatusModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleManualAssign = async (e) => {
    e.preventDefault();
    if (!selectedLead || !selectedContractorId) {
      addToast('Please select a contractor to assign', 'error');
      return;
    }

    try {
      const res = await apiFetch(`/admin/leads/${selectedLead._id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ contractorId: selectedContractorId, reason: assignReason })
      });

      if (res.success) {
        addToast(res.message, 'success');
        setAssignModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Assignment failed', 'error');
    }
  };

  const handleBroadcastAssign = async (leadId) => {
    if (!window.confirm('Broadcast this lead to ALL active approved contractors in a single click?')) return;

    try {
      setBroadcasting(true);
      const res = await apiFetch(`/admin/leads/${leadId}/broadcast-assign`, {
        method: 'POST'
      });

      if (res.success) {
        addToast(res.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Broadcast assignment failed', 'error');
    } finally {
      setBroadcasting(false);
    }
  };

  const handleToggleUserBlock = async (userId, isCurrentlyActive) => {
    const action = isCurrentlyActive ? 'BLOCK / SUSPEND' : 'UNBLOCK / ACTIVATE';
    if (!window.confirm(`Are you sure you want to ${action} this account?`)) return;

    try {
      const res = await apiFetch(`/admin/users/${userId}/toggle-block`, {
        method: 'PUT'
      });

      if (res.success) {
        addToast(res.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Account toggle failed', 'error');
    }
  };

  const handleContractorVerification = async (contractorId, status, isBadge) => {
    try {
      const res = await apiFetch(`/admin/contractors/${contractorId}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ verificationStatus: status, isVerifiedBadge: isBadge })
      });

      if (res.success) {
        addToast(res.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message || 'Verification update failed', 'error');
    }
  };

  const handleCSVExport = (type) => {
    window.open(`/api/v1/admin/export/${type}`, '_blank');
  };

  // --- CMS Save Functions ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory ? `/admin/categories/${editingCategory._id}` : '/admin/categories';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(categoryForm)
      });

      if (res.success) {
        addToast(res.message, 'success');
        setCategoryModalOpen(false);
        fetchCMSData();
      }
    } catch (err) {
      addToast(err.message || 'Category save failed', 'error');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Delete this service category from public site?')) return;
    try {
      const res = await apiFetch(`/admin/categories/${catId}`, { method: 'DELETE' });
      if (res.success) {
        addToast(res.message, 'success');
        fetchCMSData();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleSaveServiceArea = async (e) => {
    e.preventDefault();
    try {
      const method = editingArea ? 'PUT' : 'POST';
      const url = editingArea ? `/admin/areas/${editingArea._id}` : '/admin/areas';

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(areaForm)
      });

      if (res.success) {
        addToast(res.message, 'success');
        setAreaModalOpen(false);
        fetchCMSData();
      }
    } catch (err) {
      addToast(err.message || 'Service area save failed', 'error');
    }
  };

  const handleDeleteServiceArea = async (areaId) => {
    if (!window.confirm('Delete this service area sector?')) return;
    try {
      const res = await apiFetch(`/admin/areas/${areaId}`, { method: 'DELETE' });
      if (res.success) {
        addToast(res.message, 'success');
        fetchCMSData();
      }
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(siteSettings)
      });

      if (res.success) {
        addToast(res.message, 'success');
        fetchCMSData();
        window.dispatchEvent(new Event('site-settings-updated'));
      }
    } catch (err) {
      addToast(err.message || 'Settings update failed', 'error');
    }
  };

  const filteredLeads = leads.filter(l =>
    l.referenceNo.toLowerCase().includes(searchLead.toLowerCase()) ||
    (l.location?.sector || '').toLowerCase().includes(searchLead.toLowerCase()) ||
    (l.customerId?.name || l.guestContact?.name || '').toLowerCase().includes(searchLead.toLowerCase()) ||
    (l.selectedContractorId?.businessName || '').toLowerCase().includes(searchLead.toLowerCase())
  );

  const filteredContractors = contractors.filter(c =>
    c.businessName.toLowerCase().includes(searchContractor.toLowerCase()) ||
    (c.userId?.name || '').toLowerCase().includes(searchContractor.toLowerCase()) ||
    (c.userId?.phone || '').includes(searchContractor)
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Premium Header */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-800 text-white p-8 rounded-3xl shadow-elevated border border-forest-700/50 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400 bg-forest-800/80 px-3.5 py-1 rounded-full border border-gold-500/30 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              Banwao Control Center & Dynamic CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">Admin Dashboard & Operations Portal</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage enquiry deals, view all contractor quote submissions with highlighted customer choice, and dynamically edit public site content.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => handleCSVExport('leads')}
            className="px-4 py-2.5 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-white font-bold text-xs border border-gold-500/30 flex items-center gap-2 shadow-sm transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-gold-400" /> Export Leads CSV
          </button>
          <button
            onClick={() => handleCSVExport('contractors')}
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" /> Export Contractors CSV
          </button>
        </div>
      </div>

      {/* Database Metrics Overview Row */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Leads" value={metrics.totalLeads} subtitle={`${metrics.newLeads} new, ${metrics.activeLeads} active`} icon={FileText} color="forest" />
          <StatCard title="Active Projects" value={metrics.activeLeads} subtitle={`${metrics.completedLeads} completed`} icon={Building2} color="blue" />
          <StatCard title="Contractor Network" value={metrics.approvedContractors} subtitle={`${metrics.pendingContractors} pending, ${metrics.suspendedContractors} suspended`} icon={UserCheck} color="gold" />
          <StatCard title="Quotations Total" value={metrics.totalQuotations} subtitle={`${metrics.totalCustomers} registered customers`} icon={ShieldCheck} color="green" />
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-warm-200 shadow-sm flex flex-wrap items-center gap-2 text-xs font-bold">
        <button
          onClick={() => setTab('leads')}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            tab === 'leads' ? 'bg-forest-900 text-gold-400 shadow-md' : 'text-slate-600 hover:bg-warm-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Lead Operations ({leads.length})</span>
        </button>

        <button
          onClick={() => setTab('contractors')}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            tab === 'contractors' ? 'bg-forest-900 text-gold-400 shadow-md' : 'text-slate-600 hover:bg-warm-100 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Contractors & Account Controls ({contractors.length})</span>
        </button>

        <button
          onClick={() => setTab('cms')}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            tab === 'cms' ? 'bg-forest-900 text-gold-400 shadow-md' : 'text-slate-600 hover:bg-warm-100 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Public Site CMS & Dynamic Content</span>
        </button>

        <button
          onClick={() => setTab('activity')}
          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
            tab === 'activity' ? 'bg-forest-900 text-gold-400 shadow-md' : 'text-slate-600 hover:bg-warm-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>System Audit Trail ({activities.length})</span>
        </button>
      </div>

      {/* TAB 1: LEAD ENQUIRIES & QUOTE COMPARISON MATRIX */}
      {tab === 'leads' && (
        <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl font-heading text-slate-900">Enquiry Leads & Contractor Quotes Matrix</h2>
              <p className="text-xs text-slate-500">View customer requirements, inspect contractor submitted quotes, and highlight deal selections.</p>
            </div>
            
            <div className="flex items-center bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 w-full sm:w-80 shadow-inner">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search ref code, customer, contractor..."
                value={searchLead}
                onChange={(e) => setSearchLead(e.target.value)}
                className="w-full text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5">Ref Code</th>
                  <th className="p-3.5">Customer Contact (Admin)</th>
                  <th className="p-3.5">Selected Contractor (Admin)</th>
                  <th className="p-3.5">Quotes Received</th>
                  <th className="p-3.5">Service & Location</th>
                  <th className="p-3.5">Budget (₹)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions & Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((l) => {
                  const custName = l.customerId?.name || l.guestContact?.name || 'Guest Homeowner';
                  const custPhone = l.customerId?.phone || l.guestContact?.phone || 'N/A';
                  const custEmail = l.customerId?.email || l.guestContact?.email || 'N/A';

                  const contractor = l.selectedContractorId;
                  const quote = l.selectedQuotationId;
                  const quotesCount = l.quotesCount || 0;

                  return (
                    <tr key={l._id} className="hover:bg-warm-50/60 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{l.referenceNo}</td>
                      
                      {/* Customer Info Card */}
                      <td className="p-3.5 bg-amber-50/50 rounded-xl my-1 min-w-[190px]">
                        <p className="font-bold text-slate-900 text-sm">{custName}</p>
                        <p className="text-[11px] text-forest-800 font-semibold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gold-600" /> {custPhone}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400" /> {custEmail}
                        </p>
                      </td>

                      {/* Selected Contractor Card */}
                      <td className="p-3.5 bg-blue-50/50 rounded-xl my-1 min-w-[210px]">
                        {contractor ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <ShieldCheck className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                              <span className="truncate">{contractor.businessName}</span>
                            </div>
                            <p className="text-[11px] text-slate-700 font-medium">Owner: {contractor.userId?.name || 'Partner'}</p>
                            <p className="text-[11px] text-forest-800 font-bold flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gold-600" /> {contractor.userId?.phone || 'N/A'}
                            </p>
                            {quote && (
                              <div className="mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-black inline-block border border-emerald-300">
                                Agreed Quote: ₹{Number(quote.totalAmount).toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No contractor selected yet</span>
                        )}
                      </td>

                      {/* Quotations Inspection Button */}
                      <td className="p-3.5 min-w-[140px]">
                        <button
                          onClick={() => handleInspectQuotations(l)}
                          className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-forest-700" />
                          <span>Inspect Quotes ({quotesCount})</span>
                        </button>
                      </td>

                      <td className="p-3.5">
                        <p className="font-semibold text-slate-900">{l.serviceCategoryId?.name}</p>
                        <p className="text-[10px] text-slate-500">{l.location?.sector}, {l.location?.city}</p>
                      </td>

                      <td className="p-3.5 font-semibold text-slate-800">
                        ₹{Number(l.budgetRange?.min || 0).toLocaleString('en-IN')} - ₹{Number(l.budgetRange?.max || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="p-3.5"><StatusBadge status={l.status} /></td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleBroadcastAssign(l._id)}
                            disabled={broadcasting}
                            className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all"
                            title="Single click assign lead to ALL active contractors"
                          >
                            <Radio className="w-3.5 h-3.5" /> Broadcast All Pros
                          </button>
                          <button
                            onClick={() => { setSelectedLead(l); setAssignModalOpen(true); }}
                            className="px-3 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-[11px] transition-all"
                          >
                            Assign Pro
                          </button>
                          <button
                            onClick={() => { setSelectedLead(l); setNewStatus(l.status); setStatusModalOpen(true); }}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] transition-all"
                          >
                            Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACTOR MANAGEMENT & USER BLOCKING */}
      {tab === 'contractors' && (
        <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl font-heading text-slate-900">Contractor Verification & Account Control Center</h2>
              <p className="text-xs text-slate-500">Approve contractors, issue verified badges, or suspend accounts in 1 click.</p>
            </div>

            <div className="flex items-center bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 w-full sm:w-72 shadow-inner">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search firm, owner, phone..."
                value={searchContractor}
                onChange={(e) => setSearchContractor(e.target.value)}
                className="w-full text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5">Business / Firm</th>
                  <th className="p-3.5">Owner Contact (Admin Only)</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">Badge</th>
                  <th className="p-3.5">Account Status & One-Click Block</th>
                  <th className="p-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContractors.map((c) => {
                  const isUserActive = c.userId ? c.userId.isActive : true;

                  return (
                    <tr key={c._id} className="hover:bg-warm-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 text-sm">{c.businessName}</td>
                      <td className="p-3.5 bg-amber-50/50 rounded-xl my-1">
                        <p className="font-semibold text-slate-900 text-xs">{c.userId?.name}</p>
                        <p className="text-[11px] text-forest-800 font-bold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gold-600" /> {c.userId?.phone}
                        </p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" /> {c.userId?.email}
                        </p>
                      </td>
                      <td className="p-3.5"><StatusBadge status={c.verificationStatus} /></td>
                      <td className="p-3.5">
                        {c.isVerifiedBadge ? (
                          <span className="text-forest-800 font-bold text-[10px] bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">Badge Active</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">No Badge</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {isUserActive ? (
                          <button
                            onClick={() => handleToggleUserBlock(c.userId?._id, true)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Lock className="w-3.5 h-3.5" /> Block / Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleUserBlock(c.userId?._id, false)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Unlock className="w-3.5 h-3.5" /> Unblock Account
                          </button>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        {c.verificationStatus !== 'approved' && (
                          <button
                            onClick={() => handleContractorVerification(c._id, 'approved', true)}
                            className="px-3 py-1.5 rounded-xl bg-forest-700 text-white font-bold text-[11px] shadow-sm hover:bg-forest-800 transition-all"
                          >
                            Approve Partner
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC PUBLIC SITE CONTENT CMS */}
      {tab === 'cms' && (
        <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-warm-200 pb-4">
            <div>
              <h2 className="font-bold text-xl font-heading text-slate-900">Dynamic Public Site CMS</h2>
              <p className="text-xs text-slate-500">Edit service offerings, location sectors, hero stats, and announcement text shown publicly on Banwao website.</p>
            </div>

            {/* CMS Sub-tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setCmsSubTab('categories')}
                className={`px-4 py-2 rounded-lg transition-all ${cmsSubTab === 'categories' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setCmsSubTab('areas')}
                className={`px-4 py-2 rounded-lg transition-all ${cmsSubTab === 'areas' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Sectors / Areas ({serviceAreas.length})
              </button>
              <button
                onClick={() => setCmsSubTab('settings')}
                className={`px-4 py-2 rounded-lg transition-all ${cmsSubTab === 'settings' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Banner & Contact Settings
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: SERVICE CATEGORIES CMS */}
          {cmsSubTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Public Service Offerings</h3>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({
                      name: '',
                      slug: '',
                      icon: 'Wrench',
                      shortDesc: '',
                      fullDesc: '',
                      isPopular: false,
                      imageUrl: '',
                      displayOrder: categories.length + 1,
                      isActive: true
                    });
                    setCategoryModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Service Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat._id} className="bg-warm-50/50 rounded-2xl p-4 border border-warm-200 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-400">Order: #{cat.displayOrder}</span>
                        <div className="flex items-center gap-1.5">
                          {cat.isPopular && <span className="bg-gold-500 text-forest-950 font-bold text-[10px] px-2 py-0.5 rounded-full">Popular</span>}
                          {cat.isActive ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">Active</span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full">Inactive</span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{cat.shortDesc}</p>
                    </div>

                    <div className="pt-2 border-t border-warm-200/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">/{cat.slug}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({
                              name: cat.name,
                              slug: cat.slug,
                              icon: cat.icon || 'Wrench',
                              shortDesc: cat.shortDesc,
                              fullDesc: cat.fullDesc || '',
                              isPopular: cat.isPopular || false,
                              imageUrl: cat.imageUrl || '',
                              displayOrder: cat.displayOrder || 0,
                              isActive: cat.isActive !== undefined ? cat.isActive : true
                            });
                            setCategoryModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: SERVICE LOCATIONS & SECTORS CMS */}
          {cmsSubTab === 'areas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Covered Sectors & Locations</h3>
                <button
                  onClick={() => {
                    setEditingArea(null);
                    setAreaForm({ city: 'Noida', sector: '', pincode: '', isActive: true });
                    setAreaModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Sector / Location
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="p-3">City</th>
                      <th className="p-3">Sector / Area</th>
                      <th className="p-3">Pincode</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {serviceAreas.map((area) => (
                      <tr key={area._id} className="hover:bg-warm-50/50">
                        <td className="p-3 font-bold text-slate-900">{area.city}</td>
                        <td className="p-3 font-semibold text-slate-800">{area.sector}</td>
                        <td className="p-3 font-mono text-slate-500">{area.pincode || 'N/A'}</td>
                        <td className="p-3">
                          {area.isActive ? (
                            <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Active</span>
                          ) : (
                            <span className="text-rose-800 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">Inactive</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => {
                              setEditingArea(area);
                              setAreaForm({
                                city: area.city,
                                sector: area.sector,
                                pincode: area.pincode || '',
                                isActive: area.isActive !== undefined ? area.isActive : true
                              });
                              setAreaModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteServiceArea(area._id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: HEADER, HERO, BANNER & FOOTER DYNAMIC CMS */}
          {cmsSubTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              
              {/* SECTION 1: HEADER & LOGO BRANDING */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-forest-700" />
                  <span>Header Branding & Site Logo</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Site Brand Name</label>
                    <input
                      type="text"
                      value={siteSettings.siteName || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
                      placeholder="Banwao"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Header Sub-Tagline</label>
                    <input
                      type="text"
                      value={siteSettings.siteTagline || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteTagline: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                      placeholder="Noida & Greater Noida"
                    />
                  </div>
                </div>

                {/* Logo Image Upload from System */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="block font-semibold text-slate-700 text-xs">Custom Logo Photo</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl transition-all text-xs font-bold shadow-sm">
                        <Upload className="w-4 h-4 text-forest-700" />
                        <span>{uploadingImage ? 'Uploading Logo...' : 'Upload Logo Photo from System'}</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSettingsFileUpload(e, 'logoImageUrl')}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    {siteSettings.logoImageUrl && (
                      <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-white p-1">
                        <img src={siteSettings.logoImageUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: TOP ANNOUNCEMENT BANNER */}
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-600" />
                    <span>Public Top Announcement Bar</span>
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteSettings.isAnnouncementVisible}
                      onChange={(e) => setSiteSettings({ ...siteSettings, isAnnouncementVisible: e.target.checked })}
                      className="rounded text-forest-700 w-4 h-4"
                    />
                    <span>Show Announcement Bar</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Text</label>
                    <input
                      type="text"
                      value={siteSettings.announcementText || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, announcementText: e.target.value })}
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl outline-none text-xs font-medium"
                      placeholder="e.g. Get Instant Free Quotations in Noida & Greater Noida!"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Link URL</label>
                    <input
                      type="text"
                      value={siteSettings.announcementLink || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, announcementLink: e.target.value })}
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-xl outline-none text-xs font-mono"
                      placeholder="/get-quotes"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: HERO SECTION CONTENT & HERO IMAGE */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  <span>Hero Section Headline, Dynamic Badges & Image Showcase</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hero Pill Badge Text</label>
                    <input
                      type="text"
                      value={siteSettings.heroBadgeText || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroBadgeText: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-semibold text-forest-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Main Hero Headline</label>
                    <input
                      type="text"
                      value={siteSettings.heroHeadline || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadline: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-900 text-sm"
                    />
                  </div>

                  {/* Headline Color, Accent Color & Font Size Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Headline Main Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteSettings.heroHeadlineColor || '#ffffff'}
                          onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadlineColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          value={siteSettings.heroHeadlineColor || '#ffffff'}
                          onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadlineColor: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono text-xs"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Accent Color ("sahi logon se Banwao!")</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteSettings.heroHeadlineAccentColor || '#f59e0b'}
                          onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadlineAccentColor: e.target.value })}
                          className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          value={siteSettings.heroHeadlineAccentColor || '#f59e0b'}
                          onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadlineAccentColor: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono text-xs"
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Headline Text Size</label>
                      <select
                        value={siteSettings.heroHeadlineFontSize || 'large'}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroHeadlineFontSize: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-semibold"
                      >
                        <option value="small">Small (36px - 44px)</option>
                        <option value="normal">Normal / Medium (44px - 52px)</option>
                        <option value="large">Large (Standard 56px)</option>
                        <option value="xlarge">Extra Large (64px - 72px)</option>
                        <option value="huge">Huge / Massive (72px - 84px)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hero Subheadline Text</label>
                    <textarea
                      rows={2}
                      value={siteSettings.heroSubheadline || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, heroSubheadline: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Hero Showcase Image Upload from System */}
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <label className="block font-semibold text-slate-700">Hero Section Showcase Image</label>
                    
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 p-3 bg-white hover:bg-slate-100 text-forest-900 border-2 border-dashed border-slate-300 rounded-xl transition-all text-xs font-bold shadow-sm">
                          <Upload className="w-4 h-4 text-gold-600" />
                          <span>{uploadingImage ? 'Uploading Hero Image...' : 'Upload Hero Showcase Photo from System'}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSettingsFileUpload(e, 'heroImageUrl')}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Or paste Hero Image URL:</span>
                      <input
                        type="text"
                        value={siteSettings.heroImageUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroImageUrl: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none font-mono text-xs"
                      />
                    </div>

                    {siteSettings.heroImageUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-100">
                        <img src={siteSettings.heroImageUrl} alt="Hero Showcase Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Hero Overlay Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hero Image Card Overlay Title</label>
                      <input
                        type="text"
                        value={siteSettings.heroCardTitle || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroCardTitle: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hero Image Card Overlay Subtitle</label>
                      <input
                        type="text"
                        value={siteSettings.heroCardSubtitle || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, heroCardSubtitle: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Hero Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Stat 1 Value & Label</label>
                      <input type="text" value={siteSettings.heroStat1Number || ''} onChange={(e) => setSiteSettings({...siteSettings, heroStat1Number: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs font-bold" />
                      <input type="text" value={siteSettings.heroStat1Label || ''} onChange={(e) => setSiteSettings({...siteSettings, heroStat1Label: e.target.value})} className="w-full p-1.5 bg-white border rounded-lg text-[11px] mt-1" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Stat 2 Value & Label</label>
                      <input type="text" value={siteSettings.heroStat2Number || ''} onChange={(e) => setSiteSettings({...siteSettings, heroStat2Number: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs font-bold" />
                      <input type="text" value={siteSettings.heroStat2Label || ''} onChange={(e) => setSiteSettings({...siteSettings, heroStat2Label: e.target.value})} className="w-full p-1.5 bg-white border rounded-lg text-[11px] mt-1" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Stat 3 Value & Label</label>
                      <input type="text" value={siteSettings.heroStat3Number || ''} onChange={(e) => setSiteSettings({...siteSettings, heroStat3Number: e.target.value})} className="w-full p-2 bg-white border rounded-lg text-xs font-bold" />
                      <input type="text" value={siteSettings.heroStat3Label || ''} onChange={(e) => setSiteSettings({...siteSettings, heroStat3Label: e.target.value})} className="w-full p-1.5 bg-white border rounded-lg text-[11px] mt-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: FOOTER & CONTACT DETAILS */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-forest-700" />
                  <span>Footer Description, Copyright & Public Contact Info</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Footer Brand Tagline Quote</label>
                    <input
                      type="text"
                      value={siteSettings.footerTagline || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerTagline: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900"
                      placeholder="“Ghar banana ho ya sajana, sahi logon se Banwao!”"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Footer Bottom Serving Note</label>
                    <input
                      type="text"
                      value={siteSettings.footerServingText || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerServingText: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-medium text-slate-900"
                      placeholder="Serving homeowners & verified contractors in Noida & Greater Noida, India."
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Footer Brand Description</label>
                    <textarea
                      rows={2}
                      value={siteSettings.footerDescription || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerDescription: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Copyright Notice Text</label>
                    <input
                      type="text"
                      value={siteSettings.footerCopyright || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerCopyright: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Public Contact Phone</label>
                      <input
                        type="text"
                        value={siteSettings.contactPhone || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone Number</label>
                      <input
                        type="text"
                        value={siteSettings.whatsappPhone || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsappPhone: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={siteSettings.supportEmail || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Office Address</label>
                      <input
                        type="text"
                        value={siteSettings.officeAddress || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, officeAddress: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="px-8 py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-all">
                  Save All Header, Hero & Footer Changes
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* TAB 4: SYSTEM AUDIT TRAIL */}
      {tab === 'activity' && (
        <div className="bg-white rounded-3xl p-6 border border-warm-200 shadow-card space-y-4">
          <h2 className="font-bold text-lg font-heading text-slate-900">System Activity Audit Log</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {activities.map((a) => (
              <div key={a._id} className="p-3 rounded-xl bg-warm-50 border border-warm-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-forest-800 uppercase">{a.action}</span>
                  <p className="text-slate-600 mt-0.5">{JSON.stringify(a.details)}</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL 1: INSPECT ALL CONTRACTOR QUOTES FOR ENQUIRY ================= */}
      {quotesModalOpen && inspectingLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-warm-50 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-elevated border border-warm-300 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-gold-400 font-bold bg-forest-900 px-2.5 py-0.5 rounded-full border border-gold-500/30">
                    Admin Quote Inspection Center
                  </span>
                  <span className="font-mono text-xs text-slate-300">Ref: {inspectingLead.referenceNo}</span>
                </div>
                <h2 className="text-xl font-bold font-heading mt-1">All Contractor Submitted Quotations ({leadQuotations.length})</h2>
              </div>
              <button
                onClick={() => setQuotesModalOpen(false)}
                className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {loadingQuotes ? (
                <div className="py-12 text-center text-slate-500 font-medium animate-pulse">
                  Loading contractor quotations...
                </div>
              ) : leadQuotations.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-medium bg-white rounded-2xl border border-warm-200">
                  No quotations submitted by contractors yet for this enquiry.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {leadQuotations.map((q, idx) => {
                    const contractor = q.contractorId;
                    const isSelectedByCustomer = inspectingLead.selectedQuotationId?.toString() === q._id?.toString() || q.status === 'selected';

                    return (
                      <div
                        key={q._id}
                        className={`bg-white rounded-2xl border flex flex-col justify-between shadow-card relative transition-all ${
                          isSelectedByCustomer
                            ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/20'
                            : 'border-warm-200'
                        }`}
                      >
                        {/* Customer Choice Highlight Ribbon */}
                        {isSelectedByCustomer && (
                          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs px-4 py-1.5 rounded-t-xl flex items-center justify-between shadow-md">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-gold-300" />
                              SELECTED BY CUSTOMER ★
                            </span>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase">Deal Chosen</span>
                          </div>
                        )}

                        <div className="p-5 space-y-4">
                          {/* Contractor Info Header */}
                          <div className="border-b border-slate-100 pb-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quote #{idx + 1}</span>
                              {contractor?.isVerifiedBadge && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-200">
                                  <ShieldCheck className="w-3 h-3 text-gold-500" /> Verified Partner
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">{contractor?.businessName || 'Contractor'}</h3>
                            
                            {/* Contact Details (Admin View Only) */}
                            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80 text-xs space-y-0.5 mt-2">
                              <p className="font-semibold text-slate-800">Owner: {contractor?.userId?.name || 'N/A'}</p>
                              <p className="text-[11px] text-forest-800 font-bold flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gold-600" /> {contractor?.userId?.phone || 'N/A'}
                              </p>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" /> {contractor?.userId?.email || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {/* Cost Breakdown */}
                          <div className="bg-forest-900 text-white rounded-2xl p-4 text-center shadow-sm">
                            <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Total Quoted Amount</p>
                            <p className="text-2xl font-black font-heading mt-1">
                              ₹{Number(q.totalAmount).toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                              <span className="text-slate-500">Labour Cost:</span>
                              <span className="font-bold text-slate-900">₹{Number(q.labourCost || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                              <span className="text-slate-500">Material Cost:</span>
                              <span className="font-bold text-slate-900">₹{Number(q.materialCost || 0).toLocaleString('en-IN')}</span>
                            </div>
                            {q.otherCharges > 0 && (
                              <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Other Charges:</span>
                                <span className="font-bold text-slate-900">₹{Number(q.otherCharges).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            <div className="flex justify-between py-1">
                              <span className="text-slate-500">Estimated Timeline:</span>
                              <span className="font-bold text-forest-800">{q.estimatedTimeline}</span>
                            </div>
                          </div>

                          {/* Scope Details */}
                          <div className="bg-warm-50 rounded-xl p-3 border border-warm-200">
                            <p className="text-xs font-bold text-slate-900 mb-1">Scope Details:</p>
                            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed max-h-28 overflow-y-auto">
                              {q.scopeDetails}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                          {isSelectedByCustomer ? (
                            <div className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-gold-300" /> Currently Selected Deal Quote
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAdminSelectQuote(q._id)}
                              className="w-full py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-all shadow-sm"
                            >
                              Select Quote On Customer Behalf
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: STATUS UPDATE ================= */}
      {statusModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-warm-200 space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">Update Status for {selectedLead.referenceNo}</h3>
            <form onSubmit={handleStatusUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">
                  <option value="new">new</option>
                  <option value="reviewing">reviewing</option>
                  <option value="matched">matched</option>
                  <option value="quotations_received">quotations_received</option>
                  <option value="customer_selecting">customer_selecting</option>
                  <option value="contractor_selected">contractor_selected</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                  <option value="closed">closed</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Audit Note</label>
                <textarea rows={3} placeholder="Note reason for status update..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setStatusModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white bg-forest-700 font-bold">Update Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: MANUAL ASSIGNMENT ================= */}
      {assignModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-warm-200 space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">Manually Assign Contractor to {selectedLead.referenceNo}</h3>
            <form onSubmit={handleManualAssign} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Approved Contractor</label>
                <select value={selectedContractorId} onChange={(e) => setSelectedContractorId(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">
                  <option value="">-- Choose Contractor --</option>
                  {contractors.filter(c => c.verificationStatus === 'approved').map(c => (
                    <option key={c._id} value={c._id}>{c.businessName} ({c.experienceYears} yrs exp)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Note</label>
                <input type="text" value={assignReason} onChange={(e) => setAssignReason(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAssignModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-forest-950 bg-gold-500 font-bold">Assign Contractor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: CMS CATEGORY FORM ================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-elevated border border-warm-200 space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">
              {editingCategory ? 'Edit Service Category' : 'Create New Service Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
                      setCategoryForm({ ...categoryForm, name, slug: editingCategory ? categoryForm.slug : slug });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    placeholder="e.g. Turnkey Construction"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                    placeholder="turnkey-construction"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.shortDesc}
                  onChange={(e) => setCategoryForm({ ...categoryForm, shortDesc: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="Short tagline shown on service cards..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={categoryForm.fullDesc}
                  onChange={(e) => setCategoryForm({ ...categoryForm, fullDesc: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="Detailed description of service scope..."
                ></textarea>
              </div>

              {/* Photo Upload from System or URL */}
              <div className="space-y-2 border-t border-b border-slate-100 py-3">
                <label className="block font-semibold text-slate-700">Category Photo / Image</label>
                
                {/* Upload from system button */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 p-3 bg-forest-50 hover:bg-forest-100 text-forest-800 border-2 border-dashed border-forest-300 rounded-xl transition-all text-xs font-bold shadow-sm">
                      <Upload className="w-4 h-4 text-forest-700" />
                      <span>{uploadingImage ? 'Uploading Photo from System...' : 'Upload Photo from System'}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Paste URL option */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">Or paste Image URL manually:</span>
                  <input
                    type="text"
                    value={categoryForm.imageUrl}
                    onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-xs"
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                  />
                </div>

                {/* Image Preview Thumbnail */}
                {categoryForm.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100 flex items-center justify-center">
                    <img
                      src={categoryForm.imageUrl}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, imageUrl: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={categoryForm.displayOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-2 pt-2">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryForm.isPopular}
                      onChange={(e) => setCategoryForm({ ...categoryForm, isPopular: e.target.checked })}
                      className="rounded text-gold-500 w-4 h-4"
                    />
                    <span>Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                      className="rounded text-forest-700 w-4 h-4"
                    />
                    <span>Active Publicly</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setCategoryModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white bg-forest-700 font-bold">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: CMS SERVICE AREA FORM ================= */}
      {areaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-warm-200 space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900">
              {editingArea ? 'Edit Service Location' : 'Add New Sector / Area'}
            </h3>
            <form onSubmit={handleSaveServiceArea} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City *</label>
                <select
                  value={areaForm.city}
                  onChange={(e) => setAreaForm({ ...areaForm, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                >
                  <option value="Noida">Noida</option>
                  <option value="Greater Noida">Greater Noida</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sector / Area Name *</label>
                <input
                  type="text"
                  required
                  value={areaForm.sector}
                  onChange={(e) => setAreaForm({ ...areaForm, sector: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="e.g. Sector 150 or Knowledge Park III"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={areaForm.pincode}
                  onChange={(e) => setAreaForm({ ...areaForm, pincode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  placeholder="201310"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={areaForm.isActive}
                    onChange={(e) => setAreaForm({ ...areaForm, isActive: e.target.checked })}
                    className="rounded text-forest-700 w-4 h-4"
                  />
                  <span>Active Location</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setAreaModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white bg-forest-700 font-bold">Save Location</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
