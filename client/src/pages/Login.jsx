import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Building2, LogIn, KeyRound, Mail, Sparkles } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        if (res.user.role === 'admin') navigate('/admin/dashboard');
        else if (res.user.role === 'contractor') navigate('/contractor/portal');
        else navigate('/customer/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-400 font-bold flex items-center justify-center mx-auto shadow-md border border-gold-500/30">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Sign In to Banwao</h1>
        <p className="text-xs text-slate-500">Access your customer dashboard, contractor portal, or admin control center</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card space-y-6">
        
        {/* Quick Demo Fill Options */}
        <div className="bg-warm-50 p-3.5 rounded-2xl border border-warm-200 space-y-2">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Quick Demo Login Shortcuts:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer@banwao.in', 'CustomerPass123!')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-forest-50 border border-slate-200 text-[10px] font-bold text-forest-900"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('apexbuildtech@banwao.in', 'ContractorPass123!')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-forest-50 border border-slate-200 text-[10px] font-bold text-forest-900"
            >
              Contractor
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@banwao.in', 'AdminPass123!')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-gold-50 border border-gold-300 text-[10px] font-bold text-gold-900"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="flex items-center px-3 bg-slate-50 border border-slate-200 rounded-xl">
              <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 text-xs bg-transparent outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="flex items-center px-3 bg-slate-50 border border-slate-200 rounded-xl">
              <KeyRound className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 text-xs bg-transparent outline-none text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm transition-all shadow-card flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-forest-700 hover:underline">
            Register Account
          </Link>
        </div>

      </div>

    </div>
  );
};
