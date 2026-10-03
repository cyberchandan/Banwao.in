import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Building2, UserCheck, ShieldCheck } from 'lucide-react';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'contractor' ? 'contractor' : 'customer';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Contractor specific state
  const [businessName, setBusinessName] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [serviceAreas, setServiceAreas] = useState('Noida Sector 62, Greater Noida West');
  const [skills, setSkills] = useState('Construction, Renovation, Turnkey');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const { registerCustomer, registerContractor } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      if (role === 'customer') {
        const res = await registerCustomer({ name, email, phone, password });
        if (res.success) {
          addToast('Customer account registered successfully!', 'success');
          navigate('/customer/dashboard');
        }
      } else {
        const res = await registerContractor({
          name,
          email,
          phone,
          password,
          businessName,
          experienceYears,
          serviceAreas,
          skills,
          description
        });
        if (res.success) {
          addToast('Contractor profile submitted for admin verification!', 'success');
          navigate('/contractor/portal');
        }
      }
    } catch (err) {
      addToast(err.message || 'Registration failed. Please check input values.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 font-bold flex items-center justify-center mx-auto shadow-md border border-gold-500/30">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Create Banwao Account</h1>
        <p className="text-xs text-slate-500">Join as a Homeowner or Contractor Partner in Noida & Gr. Noida</p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-warm-200/60 p-1.5 rounded-2xl border border-warm-300">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            role === 'customer' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-forest-700" />
          <span>Homeowner Account</span>
        </button>
        <button
          type="button"
          onClick={() => setRole('contractor')}
          className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            role === 'contractor' ? 'bg-white text-forest-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-gold-600" />
          <span>Contractor Partner</span>
        </button>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="ramesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          {/* Contractor Profile Extra Fields */}
          {role === 'contractor' && (
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">Business & Verification Info</span>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Firm Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kumar Buildtech & Infra"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Service Sectors</label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 62, Gr. Noida Extension"
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Skills & Specializations</label>
                <input
                  type="text"
                  placeholder="e.g. Turnkey, Painting, Waterproofing"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your construction experience, equipment, and work quality..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                ></textarea>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm transition-all shadow-card flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Registering...' : `Register as ${role === 'contractor' ? 'Contractor' : 'Homeowner'}`}</span>
          </button>

        </form>

        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-forest-700 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>

    </div>
  );
};
