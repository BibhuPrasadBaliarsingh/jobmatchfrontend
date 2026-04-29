import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const uploadResumeLink = user?.role === 'seeker' ? '/seeker/profile' : '/register?role=seeker';
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Jobs', to: '/seeker/opportunities' },
    { label: 'Upload Resume', to: uploadResumeLink },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-slate-950/85">
      <div className="page-container flex items-center justify-between gap-6 py-4 md:py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.PNG" alt="Super Deals" className="h-11 w-11 object-cover" />
          <div>
            <p className="text-lg font-medium text-slate-900 dark:text-slate-100">Super Deals</p>
            {/* <p className="text-xs text-slate-500">JobMatchPro</p> */}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-200">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="transition-colors duration-150 hover:text-primary-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="btn btn-sm hidden md:inline-flex text-sm bg-red-500 text-white hover:bg-red-600 border-none"
          >
            Login
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-4 pb-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex flex-col gap-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-primary-700 dark:text-slate-200 dark:hover:bg-slate-900/60"
              >
                {item.label}
              </Link>
            ))}

            {/* ✅ Login Button for Mobile */}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 text-center bg-red-500 text-white py-3 rounded-2xl text-sm font-medium hover:bg-red-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
