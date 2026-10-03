import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';

// Pages
import { Home } from './pages/Home';
import { ServiceList } from './pages/ServiceList';
import { ServiceDetail } from './pages/ServiceDetail';
import { Locations } from './pages/Locations';
import { ContractorDirectory } from './pages/ContractorDirectory';
import { ContractorProfile } from './pages/ContractorProfile';
import { Projects } from './pages/Projects';
import { HowItWorks } from './pages/HowItWorks';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { CancellationPolicy } from './pages/CancellationPolicy';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LeadSubmitMultiStep } from './pages/LeadSubmitMultiStep';
import { GuestLeadTrack } from './pages/GuestLeadTrack';

// Protected Dashboards
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CustomerLeadDetail } from './pages/CustomerLeadDetail';
import { ContractorDashboard } from './pages/ContractorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Protected Route Guard Helper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-20 text-center text-xs font-bold text-slate-500">Loading Banwao account...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-warm-50 text-slate-800">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/:city" element={<Locations />} />
          <Route path="/contractors" element={<ContractorDirectory />} />
          <Route path="/contractors/:id" element={<ContractorProfile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/get-quotes" element={<LeadSubmitMultiStep />} />
          <Route path="/guest-track" element={<GuestLeadTrack />} />

          {/* Customer Portal */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/leads/:id"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <CustomerLeadDetail />
              </ProtectedRoute>
            }
          />

          {/* Contractor Portal */}
          <Route
            path="/contractor/portal"
            element={
              <ProtectedRoute allowedRoles={['contractor']}>
                <ContractorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Control Center */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
