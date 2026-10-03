import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Calculator, 
  Clock, 
  Star, 
  MapPin, 
  ChevronRight,
  HelpCircle,
  Award,
  Layers,
  Hammer,
  Paintbrush,
  ShieldAlert
} from 'lucide-react';
import { apiFetch } from '../services/api';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Noida');
  const [categories, setCategories] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories and featured projects and site settings
    apiFetch('/services')
      .then(res => { if (res.success) setCategories(res.categories); })
      .catch(() => {});

    apiFetch('/projects?featured=true')
      .then(res => { if (res.success) setFeaturedProjects(res.projects); })
      .catch(() => {});

    apiFetch('/services/settings/public')
      .then(res => { if (res.success) setSiteSettings(res.settings); })
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}&city=${selectedCity}`);
    } else {
      navigate(`/services`);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Submit Project Details',
      desc: 'Tell us your service need, property type, area in sq ft, location in Noida/Greater Noida, and target budget.'
    },
    {
      num: '02',
      title: 'Matched with Local Pros',
      desc: 'Our engine matches your request with verified local contractors active in your sector.'
    },
    {
      num: '03',
      title: 'Compare Quotes Side-by-Side',
      desc: 'Receive comparable estimates detailing labour costs, material breakdown, and timelines.'
    },
    {
      num: '04',
      title: 'Hire Sahi Contractor',
      desc: 'Review portfolio works, ratings, and select your preferred contractor to start work.'
    }
  ];

  const faqs = [
    {
      q: 'Is requesting quotations on Banwao free for homeowners?',
      a: 'Yes, 100% free! Homeowners can submit requirements and compare quotes from multiple contractors without any hidden fee or commitment.'
    },
    {
      q: 'Which locations are currently covered by Banwao?',
      a: 'Banwao actively serves all sectors of Noida (Sectors 1 to 168, Expressway) and Greater Noida (including Noida Extension/West, Knowledge Park, Alpha, Beta, Gamma, Delta, Zeta, and Omega).'
    },
    {
      q: 'How are contractors verified on Banwao?',
      a: 'Contractors undergo admin document inspection, business location check, experience validation, and previous project portfolio review before earning the Verified badge.'
    },
    {
      q: 'Can I request quotes for labour-only or turnkey contracts?',
      a: 'Yes! Banwao supports turnkey material + labour packages, labour-only contracts, and specialized sub-contracts for painting, waterproofing, electrical, or plumbing.'
    }
  ];

  // Dynamic Content Fallbacks
  const heroBadge = siteSettings?.heroBadgeText || 'Noida & Greater Noida’s Trusted Home Marketplace';
  const heroTitle = siteSettings?.heroHeadline || 'Ghar banana ho ya sajana, sahi logon se Banwao!';
  const heroTitleColor = siteSettings?.heroHeadlineColor || '#ffffff';
  const heroAccentColor = siteSettings?.heroHeadlineAccentColor || '#f59e0b';
  const heroFontSizeSetting = siteSettings?.heroHeadlineFontSize || 'large';

  let heroFontSizeClass = 'text-3xl sm:text-4xl lg:text-5xl';
  let heroCustomStyle = { color: heroTitleColor };

  if (heroFontSizeSetting === 'small') heroFontSizeClass = 'text-xl sm:text-2xl lg:text-3xl';
  else if (heroFontSizeSetting === 'normal') heroFontSizeClass = 'text-2xl sm:text-3xl lg:text-4xl';
  else if (heroFontSizeSetting === 'large') heroFontSizeClass = 'text-3xl sm:text-4xl lg:text-5xl';
  else if (heroFontSizeSetting === 'xlarge') heroFontSizeClass = 'text-3xl sm:text-5xl lg:text-6xl';
  else if (heroFontSizeSetting === 'huge') heroFontSizeClass = 'text-4xl sm:text-6xl lg:text-7xl';
  else if (heroFontSizeSetting) heroCustomStyle.fontSize = heroFontSizeSetting;

  const headlineParts = heroTitle.includes(',') 
    ? [heroTitle.substring(0, heroTitle.indexOf(',') + 1), heroTitle.substring(heroTitle.indexOf(',') + 1)]
    : [heroTitle, ''];

  const heroSub = siteSettings?.heroSubheadline || 'Connect with verified local contractors for new house construction, builder floors, full home renovation, painting, plumbing, electrical, and waterproofing. Get comparable quotes directly from matched pros.';
  const heroImg = siteSettings?.heroImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop';
  const heroCardTitle = siteSettings?.heroCardTitle || 'Independent Floor Construction';
  const heroCardSub = siteSettings?.heroCardSubtitle || 'Sector 50, Noida • Turnkey Contract';
  
  const stat1Num = siteSettings?.heroStat1Number || '100%';
  const stat1Label = siteSettings?.heroStat1Label || 'Free Quotes';
  const stat2Num = siteSettings?.heroStat2Number || '12+';
  const stat2Label = siteSettings?.heroStat2Label || 'Service Categories';
  const stat3Num = siteSettings?.heroStat3Number || 'Verified';
  const stat3Label = siteSettings?.heroStat3Label || 'Local Pros';

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION - FIT 100VH VIEWPORT */}
      <section className="relative overflow-hidden bg-forest-900 text-white rounded-b-[2.5rem] shadow-elevated min-h-[calc(100vh-5rem)] flex items-center py-4 sm:py-6 lg:py-6">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-800/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Hero Text & CTA */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/80 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>{heroBadge}</span>
              </div>

              <h1 className={`${heroFontSizeClass} font-black font-heading tracking-tight leading-[1.1]`} style={heroCustomStyle}>
                {headlineParts[0]}
                {headlineParts[1] && (
                  <>
                    <br />
                    <span className="italic" style={{ color: heroAccentColor }}>
                      {headlineParts[1]}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                {heroSub}
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl text-slate-800 shrink-0 border border-slate-200">
                  <MapPin className="w-4 h-4 text-forest-700" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Noida">Noida</option>
                    <option value="Greater Noida">Greater Noida</option>
                  </select>
                </div>

                <div className="flex-1 flex items-center px-3 bg-white rounded-xl text-slate-800 border border-slate-200">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search: Painting, Turnkey, Renovation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-1.5 text-xs sm:text-sm bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Search Services</span>
                </button>
              </form>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                <Link
                  to="/get-quotes"
                  className="px-6 py-2.5 sm:py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs sm:text-sm shadow-elevated border border-gold-500/40 flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Get Free Quotations Now</span>
                </Link>

                <Link
                  to="/guest-track"
                  className="px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
                >
                  Track Existing Enquiry
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 mt-1 grid grid-cols-3 gap-2 border-t border-forest-800/60 max-w-lg">
                <div className="text-center lg:text-left">
                  <p className="text-lg sm:text-xl font-bold font-heading text-gold-400">{stat1Num}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300">{stat1Label}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-lg sm:text-xl font-bold font-heading text-gold-400">{stat2Num}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300">{stat2Label}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-lg sm:text-xl font-bold font-heading text-gold-400">{stat3Num}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-300">{stat3Label}</p>
                </div>
              </div>

            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src={heroImg}
                  alt={heroCardTitle}
                  className="w-full h-[260px] sm:h-[300px] lg:h-[340px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white text-slate-900 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest-700 text-gold-400 flex items-center justify-center font-bold shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{heroCardTitle}</h4>
                      <p className="text-[11px] text-slate-600">{heroCardSub}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* POPULAR SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
            Comprehensive Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900">Popular Home Construction & Services</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Select a service category below to request comparable quotations from local contractors in Noida and Greater Noida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.slice(0, 6).map((cat) => (
              <Link
                key={cat._id}
                to={`/services/${cat.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  {cat.isPopular && (
                    <span className="absolute top-3 right-3 bg-gold-500 text-forest-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                      Popular
                    </span>
                  )}
                  <h3 className="absolute bottom-3 left-4 right-4 text-white font-bold font-heading text-lg">
                    {cat.name}
                  </h3>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.shortDesc}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-forest-700 group-hover:text-forest-900">
                    <span>Get Quotes & Details</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // Skeleton / Placeholder loader
            [1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-warm-200/50 animate-pulse rounded-2xl"></div>
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-forest-700 text-forest-800 font-bold text-sm hover:bg-forest-700 hover:text-white transition-all shadow-sm"
          >
            <span>Explore All 12 Construction Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-warm-100 py-16 border-y border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-100 px-3 py-1 rounded-full">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900">How Banwao Works</h2>
            <p className="text-slate-600 text-sm">
              Connecting homeowners with local contractors through transparent quotation comparison.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-card border border-warm-200 relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-forest-900 text-gold-400 font-black font-heading text-xl flex items-center justify-center shadow-md">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold font-heading text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/get-quotes"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-card hover:shadow-elevated transition-all"
            >
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>Start Free Quote Request</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
              Architectural Works
            </span>
            <h2 className="text-3xl font-bold font-heading text-slate-900 mt-2">Recent Projects in Noida & Gr. Noida</h2>
          </div>
          <Link to="/projects" className="text-forest-700 font-bold text-sm flex items-center gap-1 hover:underline">
            <span>View Full Portfolio Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-card">
              <div className="h-52 overflow-hidden">
                <img
                  src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-forest-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{p.location?.sector}, {p.location?.city}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                {p.estimatedCostRange && (
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-slate-400">Est. Budget:</span>
                    <span className="font-bold text-slate-800">{p.estimatedCostRange}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTRACTOR ONBOARDING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 rounded-3xl p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden border border-forest-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-forest-800/80 px-3 py-1 rounded-full border border-gold-500/30">
              For Construction Contractors
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading">
              Are you a contractor in Noida or Greater Noida?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Grow your business with genuine customer leads. Join Banwao as a verified partner to receive enquiry details and submit custom quotations directly.
            </p>
            <div className="pt-2">
              <Link
                to="/register?role=contractor"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-sm shadow-md transition-transform hover:scale-105"
              >
                <span>Register as a Contractor Partner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold font-heading text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Everything you need to know about Banwao platform</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-warm-200 shadow-card">
              <h3 className="font-bold text-slate-900 text-base flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 ml-8 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
