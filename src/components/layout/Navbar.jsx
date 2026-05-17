import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.PNG');
  const { user } = useAuth();

  useEffect(() => {
    const getLogo = () => (document.documentElement.classList.contains('dark') ? '/logodrak.PNG' : '/logo.png');
    setLogoSrc(getLogo());

    const handleThemeChange = (event) => {
      setLogoSrc(event.detail === 'dark' ? '/logodrak.PNG' : '/logo.png');
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const uploadResumeLink = user?.role === 'seeker' ? '/seeker/profile' : '/register?role=seeker';
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Jobs', to: '/seeker/opportunities' },
    { label: 'Upload Resume', to: uploadResumeLink },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-[#00253D]/95 text-white shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-black/95 dark:text-white">
      <div className="page-container flex flex-wrap items-center justify-between gap-4 py-4 md:py-5">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoSrc} alt="Super Deals" className="h-11 w-11 object-cover" />
          <div>
            <p className="text-lg font-medium text-white">Super Deals</p>
            <p className="text-xs text-slate-200/80">I’m always with you</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-100">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="transition-colors duration-150 hover:text-amber-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/register?role=seeker"
            className="btn btn-secondary btn-sm hidden md:inline-flex text-sm"
          >
            Create New Profile
          </Link>

          <Link
            to="/login"
            className="btn btn-primary btn-sm hidden md:inline-flex text-sm"
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
        <div className="md:hidden border-t border-slate-700 bg-[#00253D]/95 px-4 pb-5 shadow-sm dark:border-slate-800 dark:bg-black/95">
          <div className="flex flex-col gap-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800 hover:text-amber-300"
              >
                {item.label}
              </Link>
            ))}

            {/* ✅ Login Button for Mobile */}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 text-center btn btn-primary rounded-2xl text-sm font-medium"
            >
              Login
            </Link>

            <Link
              to="/register?role=seeker"
              onClick={() => setOpen(false)}
              className="mt-2 text-center btn btn-secondary rounded-2xl text-sm font-medium"
            >
              Create New Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
