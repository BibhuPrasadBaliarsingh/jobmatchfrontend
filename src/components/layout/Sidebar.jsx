import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, Briefcase, Bell, LogOut,
  ChevronLeft, ChevronRight, Users, Settings, Menu, X,
  Zap, FileText, Search, Shield
} from 'lucide-react';

const NAV_ITEMS = {
  seeker: [
    { to: '/seeker/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/seeker/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/seeker/opportunities', icon: Briefcase, label: 'Opportunities' },
    { to: '/seeker/profile', icon: User, label: 'My Profile' },
  ],
  recruiter: [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/recruiter/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/recruiter/post-job', icon: FileText, label: 'Post a Job' },
    { to: '/recruiter/candidates', icon: Users, label: 'Candidates' },
    { to: '/recruiter/profile', icon: User, label: 'Company Profile' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/match-engine', icon: Zap, label: 'Match Engine' },
    { to: '/admin/matches', icon: Settings, label: 'All Matches' },
    { to: '/admin/seekers', icon: Search, label: 'Seekers' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/admin/post-job', icon: FileText, label: 'Post a Job' },
    { to: '/admin/settings', icon: Shield, label: 'Settings' },
  ],
};

const ROLE_LABELS = { seeker: 'Job Seeker', recruiter: 'Recruiter', admin: 'Admin' };
const ROLE_COLORS = {
  seeker: 'bg-sage-100 text-sage-800',
  recruiter: 'bg-amber-100 text-amber-800',
  admin: 'bg-coral-100 text-coral-700',
};

export default function Sidebar({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.PNG');

  useEffect(() => {
    const getLogo = () => (document.documentElement.classList.contains('dark') ? '/logodrak.PNG' : '/logo.png');
    setLogoSrc(getLogo());

    const handleThemeChange = (event) => {
      setLogoSrc(event.detail === 'dark' ? '/logodrak.PNG' : '/logo.png');
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const navItems = NAV_ITEMS[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-ink-100 dark:border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ">
          <img src={logoSrc} alt="Super Deals" className="h-11 w-11 object-cover" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-display font-bold text-ink-900 dark:text-slate-100 text-base tracking-tight">Super Deals Staffing</span>
          </div>
        )}
      </div>

      {/* User pill */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <div className="bg-ink-50 dark:bg-slate-800/60 rounded-xl p-3">
            <p className="font-medium text-ink-900 dark:text-slate-100 text-sm truncate">{user?.name}</p>
            <span className={`badge mt-1 ${ROLE_COLORS[user?.role]}`}>{ROLE_LABELS[user?.role]}</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `${isActive ? 'sidebar-link-active' : 'sidebar-link'} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-ink-100 dark:border-slate-800 pt-3">
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-coral-600 hover:bg-coral-50 hover:text-coral-700 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-ink-50 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-ink-100 dark:border-slate-800 transition-all duration-300 relative flex-shrink-0
          ${collapsed ? 'w-16' : 'w-56'}`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-ink-200 rounded-full flex items-center justify-center
                     text-ink-500 hover:text-ink-900 shadow-sm transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-ink-100 dark:border-slate-800 z-50 lg:hidden
                        transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 btn-ghost p-1.5 rounded-lg"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-ink-100 dark:border-slate-800 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="btn-ghost p-1.5 rounded-lg">
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Super Deals Staffing" className="h-10 w-10 rounded-2xl object-cover" />
            <span className="font-display font-bold text-ink-900 dark:text-slate-100">Super Deals</span>
          </Link>
          <div className="w-8" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
