import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { 
  Building2, 
  Menu, 
  X, 
  User, 
  LogOut, 
  FileText, 
  ShieldCheck, 
  ChevronDown,
  Bell,
  Sparkles,
  Megaphone
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = () => {
      apiFetch('/services/settings/public')
        .then((res) => { if (res.success) setSiteSettings(res.settings); })
        .catch(() => {});
    };

    fetchSettings();

    window.addEventListener('site-settings-updated', fetchSettings);
    return () => window.removeEventListener('site-settings-updated', fetchSettings);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Contractors', path: '/contractors' },
    { name: 'Locations', path: '/locations' },
    { name: 'Projects', path: '/projects' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  const isActive = (path) => location.pathname === path;

  const siteName = siteSettings?.siteName || 'Banwao';
  const siteTagline = siteSettings?.siteTagline || 'Noida & Greater Noida';

  return (
    <header className="sticky top-0 z-40 bg-warm-50/95 backdrop-blur-md border-b border-warm-200">
      
      {/* Dynamic Announcement Banner from Admin CMS */}
      {siteSettings?.isAnnouncementVisible && siteSettings?.announcementText && (
        <div className="bg-forest-900 text-gold-400 text-[11px] font-semibold py-1.5 px-4 text-center border-b border-forest-800 flex items-center justify-center gap-2">
          <Megaphone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span>{siteSettings.announcementText}</span>
          {siteSettings.announcementLink && (
            <Link to={siteSettings.announcementLink} className="underline text-white ml-1 hover:text-gold-300">
              Learn More →
            </Link>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Dynamic Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            {siteSettings?.logoImageUrl ? (
              <img
                src={siteSettings.logoImageUrl}
                alt={siteName}
                className="h-11 w-auto object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-forest-700 text-gold-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 border border-gold-500/30">
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className="text-2xl font-bold font-heading text-forest-900 tracking-tight flex items-center gap-1">
                {siteName} <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-wide">
                {siteTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-forest-700 ${
                  isActive(link.path) ? 'text-forest-700 font-semibold border-b-2 border-forest-700 py-1' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/get-quotes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-medium text-sm shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5 border border-gold-500/20"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Get Free Quotes</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-warm-300 bg-white hover:border-forest-400 transition-colors shadow-sm text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] text-forest-700 font-medium capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-elevated border border-warm-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>

                    {user.role === 'customer' && (
                      <Link
                        to="/customer/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-forest-700" />
                        <span>My Enquiries & Quotes</span>
                      </Link>
                    )}

                    {user.role === 'contractor' && (
                      <Link
                        to="/contractor/portal"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-forest-700" />
                        <span>Contractor Portal</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-gold-600" />
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-forest-900 hover:bg-forest-100/60 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-forest-700 text-forest-800 hover:bg-forest-700 hover:text-white transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/get-quotes"
              className="px-3 py-1.5 rounded-lg bg-forest-700 text-white text-xs font-semibold"
            >
              Get Quotes
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl border border-warm-300 text-slate-700 hover:bg-warm-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-warm-200 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path) ? 'bg-forest-50 text-forest-800 font-semibold' : 'text-slate-700 hover:bg-warm-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1 text-xs text-slate-500 font-medium">
                  Signed in as <span className="font-bold text-slate-800">{user.name}</span> ({user.role})
                </div>
                {user.role === 'customer' && (
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-forest-50 text-forest-800 text-sm font-semibold"
                  >
                    Customer Dashboard
                  </Link>
                )}
                {user.role === 'contractor' && (
                  <Link
                    to="/contractor/portal"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-forest-50 text-forest-800 text-sm font-semibold"
                  >
                    Contractor Portal
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-gold-50 text-gold-900 text-sm font-semibold"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 font-medium hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-forest-700 text-forest-800 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-forest-700 text-white font-medium text-sm"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
