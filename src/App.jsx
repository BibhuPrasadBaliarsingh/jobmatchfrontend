import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Seeker pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';
import SeekerOpportunities from './pages/seeker/SeekerOpportunities';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';
import PostJob from './pages/recruiter/PostJob';
import RecruiterCandidates from './pages/recruiter/RecruiterCandidates';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSeekers from './pages/admin/AdminSeekers';
import AdminRecruiters from './pages/admin/AdminRecruiters';
import AdminJobs from './pages/admin/AdminJobs';
import AdminMatches from './pages/admin/AdminMatches';
import AdminMatchEngine from './pages/admin/AdminMatchEngine';

// Common
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import LoadingScreen from './components/common/LoadingScreen';
import ThemeToggle from './components/common/ThemeToggle';

// ─── Route Guards ─────────────────────────────────────────────────────────────
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return children;
};

const getUserLanding = (user) => {
  if (!user) return '/login';
  if (user.role === 'seeker' && user.phone && user.location) return '/seeker/profile';
  return `/${user.role}/dashboard`;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={getUserLanding(user)} replace />;
  return children;
};

// ─── App Routes ───────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
    <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

    {/* Seeker */}
    <Route path="/seeker/dashboard" element={<PrivateRoute role="seeker"><SeekerDashboard /></PrivateRoute>} />
    <Route path="/seeker/profile" element={<PrivateRoute role="seeker"><SeekerProfile /></PrivateRoute>} />
    <Route path="/seeker/opportunities" element={<PrivateRoute role="seeker"><SeekerOpportunities /></PrivateRoute>} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<Terms />} />

    {/* Recruiter */}
    <Route path="/recruiter/dashboard" element={<PrivateRoute role="recruiter"><RecruiterDashboard /></PrivateRoute>} />
    <Route path="/recruiter/profile" element={<PrivateRoute role="recruiter"><RecruiterProfile /></PrivateRoute>} />
    <Route path="/recruiter/post-job" element={<PrivateRoute role="recruiter"><PostJob /></PrivateRoute>} />
    <Route path="/recruiter/candidates" element={<PrivateRoute role="recruiter"><RecruiterCandidates /></PrivateRoute>} />

    {/* Admin */}
    <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
    <Route path="/admin/seekers" element={<PrivateRoute role="admin"><AdminSeekers /></PrivateRoute>} />
    <Route path="/admin/recruiters" element={<PrivateRoute role="admin"><AdminRecruiters /></PrivateRoute>} />
    <Route path="/admin/jobs" element={<PrivateRoute role="admin"><AdminJobs /></PrivateRoute>} />
    <Route path="/admin/matches" element={<PrivateRoute role="admin"><AdminMatches /></PrivateRoute>} />
    <Route path="/admin/match-engine" element={<PrivateRoute role="admin"><AdminMatchEngine /></PrivateRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ThemeToggle />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1610',
              color: '#f5f4f2',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
            success: { iconTheme: { primary: '#45825e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f74f3a', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
