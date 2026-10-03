import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/api';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  ShieldCheck, 
  Copy, 
  FileText,
  Clock
} from 'lucide-react';

export const LeadSubmitMultiStep = () => {
  const [searchParams] = useSearchParams();
  const initialCategorySlug = searchParams.get('category') || '';
  const initialCity = searchParams.get('city') || 'Noida';

  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  // Form Fields State
  const [serviceCategoryId, setServiceCategoryId] = useState('');
  const [propertyType, setPropertyType] = useState('independent_house');
  const [workType, setWorkType] = useState('new_construction');
  const [city, setCity] = useState(initialCity);
  const [sector, setSector] = useState('Sector 62');
  const [address, setAddress] = useState('');
  const [builtUpArea, setBuiltUpArea] = useState('2400');
  const [budgetMin, setBudgetMin] = useState('4000000');
  const [budgetMax, setBudgetMax] = useState('6000000');
  const [constructionType, setConstructionType] = useState('material_and_labour');
  const [desiredStartDate, setDesiredStartDate] = useState('Immediate (Next 15 days)');
  const [expectedTimeline, setExpectedTimeline] = useState('3-6 Months');
  const [description, setDescription] = useState('Need complete end-to-end residential construction for a 3-story independent house. Require turnkey material and labour quotation.');
  
  // Contact State
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerPhone, setCustomerPhone] = useState(user ? user.phone : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : '');
  const [preferredContactMethod, setPreferredContactMethod] = useState('phone');
  const [consent, setConsent] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    apiFetch('/services')
      .then((res) => {
        if (res.success) {
          setCategories(res.categories);
          if (initialCategorySlug) {
            const matched = res.categories.find(c => c.slug === initialCategorySlug);
            if (matched) setServiceCategoryId(matched._id);
          } else if (res.categories.length > 0) {
            setServiceCategoryId(res.categories[0]._id);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [initialCategorySlug]);

  const handleNext = () => {
    if (step === 1 && !serviceCategoryId) {
      addToast('Please select a service category', 'error');
      return;
    }
    if (step === 3 && (!sector || !city)) {
      addToast('Please specify city and sector/locality', 'error');
      return;
    }
    if (step === 4 && !description) {
      addToast('Please provide brief project requirements', 'error');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      addToast('Please accept platform terms and consent to receive quotations', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('serviceCategoryId', serviceCategoryId);
      formData.append('propertyType', propertyType);
      formData.append('workType', workType);
      formData.append('city', city);
      formData.append('sector', sector);
      formData.append('address', address);
      formData.append('builtUpArea', builtUpArea);
      formData.append('budgetMin', budgetMin);
      formData.append('budgetMax', budgetMax);
      formData.append('constructionType', constructionType);
      formData.append('desiredStartDate', desiredStartDate);
      formData.append('expectedTimeline', expectedTimeline);
      formData.append('description', description);
      formData.append('customerName', customerName);
      formData.append('customerPhone', customerPhone);
      formData.append('customerEmail', customerEmail);
      formData.append('preferredContactMethod', preferredContactMethod);

      if (images && images.length > 0) {
        Array.from(images).forEach(file => {
          formData.append('referenceImages', file);
        });
      }

      const res = await apiFetch('/leads', {
        method: 'POST',
        body: formData
      });

      if (res.success) {
        setSubmittedLead(res.lead);
        addToast('Enquiry submitted successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit enquiry. Please check your input.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferenceNumber = () => {
    if (submittedLead?.referenceNo) {
      navigator.clipboard.writeText(submittedLead.referenceNo);
      addToast('Reference number copied to clipboard!', 'info');
    }
  };

  if (submittedLead) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-elevated space-y-6">
          <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto border-2 border-forest-300">
            <CheckCircle2 className="w-10 h-10 text-forest-700" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
              Enquiry Submitted Successfully
            </span>
            <h1 className="text-3xl font-black font-heading text-slate-900">Get Ready for Quotations!</h1>
            <p className="text-xs text-slate-600">
              Your request has been matched with {submittedLead.matchedCount || 'multiple'} verified local contractors in {sector}, {city}.
            </p>
          </div>

          {/* Reference Box */}
          <div className="bg-forest-900 text-white rounded-2xl p-6 space-y-3 relative">
            <p className="text-xs text-slate-300">Your Unique Enquiry Reference Number</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black font-heading tracking-wider text-gold-400">
                {submittedLead.referenceNo}
              </span>
              <button
                type="button"
                onClick={copyReferenceNumber}
                className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold-400 transition-colors"
                title="Copy Reference Number"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {submittedLead.accessCode && (
              <p className="text-[11px] text-slate-300 pt-2 border-t border-forest-800">
                Guest Access PIN: <span className="font-mono font-bold text-white">{submittedLead.accessCode}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {user ? (
              <Link
                to="/customer/dashboard"
                className="w-full py-3.5 rounded-xl bg-forest-700 text-white text-xs font-bold shadow-card flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Go to Customer Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/guest-track"
                className="w-full py-3.5 rounded-xl bg-forest-700 text-white text-xs font-bold shadow-card flex items-center justify-center gap-2"
              >
                <span>Track Enquiry Status Now</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
          Banwao Multi-Step Form
        </span>
        <h1 className="text-3xl font-black font-heading text-slate-900">Get Free Comparable Quotations</h1>
        <p className="text-xs sm:text-sm text-slate-600">Takes less than 2 minutes • Verified Noida & Greater Noida Contractors</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-warm-200 shadow-card">
        <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
          <span>Step {step} of 5</span>
          <span>
            {step === 1 && 'Service Category'}
            {step === 2 && 'Property & Work Type'}
            {step === 3 && 'Location & Sector'}
            {step === 4 && 'Project Specifications'}
            {step === 5 && 'Contact Info & Submit'}
          </span>
        </div>
        <div className="h-2.5 bg-warm-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-forest-700 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-warm-200 shadow-elevated">
        
        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold font-heading text-slate-900">1. Select Required Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setServiceCategoryId(cat._id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    serviceCategoryId === cat._id
                      ? 'border-2 border-forest-700 bg-forest-50/60 shadow-sm'
                      : 'border-warm-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{cat.shortDesc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Property & Work Type */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold font-heading text-slate-900">2. Property & Work Type</h2>
            
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">Property Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'plot', label: 'Empty Plot' },
                  { id: 'independent_house', label: 'Independent Villa/House' },
                  { id: 'flat', label: 'Apartment / Flat' },
                  { id: 'lig_floor', label: 'Builder Floor / LIG' },
                  { id: 'commercial', label: 'Commercial Property' },
                  { id: 'other', label: 'Other Property' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPropertyType(item.id)}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold ${
                      propertyType === item.id ? 'bg-forest-700 text-white border-forest-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800">Work Type</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'new_construction', label: 'New Construction (Fresh Build)' },
                  { id: 'additional_floor', label: 'Additional Floor Construction' },
                  { id: 'renovation', label: 'Full Home Renovation / Remodeling' },
                  { id: 'repair', label: 'Repair & Maintenance Work' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWorkType(item.id)}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold ${
                      workType === item.id ? 'bg-forest-700 text-white border-forest-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Location */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold font-heading text-slate-900">3. Project Location</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                >
                  <option value="Noida">Noida</option>
                  <option value="Greater Noida">Greater Noida</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sector / Locality *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 62, Sector 150, Gr. Noida West"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address (Optional)</label>
              <input
                type="text"
                placeholder="Plot no / Block / House no details"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Specifications */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold font-heading text-slate-900">4. Project Specifications & Budget</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Built-Up Area (Sq Ft)</label>
                <input
                  type="number"
                  placeholder="e.g. 2400"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Min Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 4000000"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Budget (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 6000000"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">Contract Structure</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'material_and_labour', label: 'Turnkey (Material + Labour)' },
                  { id: 'labour_only', label: 'Labour Only' },
                  { id: 'not_sure', label: 'Not Sure (Need Advice)' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConstructionType(item.id)}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold ${
                      constructionType === item.id ? 'bg-forest-700 text-white border-forest-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Requirements & Scope *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your construction requirement, floor count, preferred material brands, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Reference Floor Plans / Images (Optional)</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => setImages(e.target.files)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-forest-50 file:text-forest-700 hover:file:bg-forest-100"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Contact Info */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold font-heading text-slate-900">5. Customer Contact Details</h2>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ankit Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ankit@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="bg-warm-50 p-4 rounded-2xl border border-warm-200 space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="rounded text-forest-700 focus:ring-forest-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700">
                  I agree to Banwao terms & privacy policy, and consent to receive comparable quotations from matched contractors.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-card flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>{submitting ? 'Submitting Enquiry...' : 'Submit & Receive Quotes'}</span>
            </button>
          </form>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div></div>}

          {step < 5 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
