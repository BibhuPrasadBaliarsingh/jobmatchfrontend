import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const [logoSrc, setLogoSrc] = useState('/logo.PNG');

  useEffect(() => {
    const getLogo = () => (document.documentElement.classList.contains('dark') ? '/logodrak.PNG' : '/logodrak.PNG');
    setLogoSrc(getLogo());

    const handleThemeChange = (event) => {
      setLogoSrc(event.detail === 'dark' ? '/logodrak.PNG' : '/logodrak.PNG');
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  return (
    <footer className="bg-[#00253D] text-white dark:bg-black dark:text-white">
      <div className="page-container grid gap-8 py-14 lg:grid-cols-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Super Deals" className="h-10 w-10 rounded-xl object-cover " />
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Super Deals</p>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-300">Super Deals Staffing connects businesses with reliable talent and helps job seekers grow new careers with certainty.</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Services</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li><Link to="/" className="transition hover:text-white">Temporary Staffing</Link></li>
            <li><Link to="/" className="transition hover:text-white">Permanent Hiring</Link></li>
            <li><Link to="/" className="transition hover:text-white">Contract Hiring</Link></li>
            <li><Link to="/" className="transition hover:text-white">Executive Search</Link></li>
            <li><Link to="/" className="transition hover:text-white">Payroll Support</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Company</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li><Link to="/about" className="transition hover:text-white">About Us</Link></li>
            <li><Link to="/seeker/opportunities" className="transition hover:text-white">Jobs</Link></li>
            <li><Link to="/register" className="transition hover:text-white">Contact</Link></li>
            <li><Link to="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="transition hover:text-white">Terms</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Contact</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            <li>
              <a href="https://wa.me/919937805982" target="_blank" rel="noreferrer" className="transition hover:text-white">
                WhatsApp: +91 99378 05982
              </a>
            </li>
            <li>Mobile: +91 99378 05982</li>
            <li>
              <a href="mailto:hrsuperdealsbbsr@gmail.com" className="transition hover:text-white">
                hrsuperdealsbbsr@gmail.com
              </a>
            </li>
            <li>Bhubaneswar, Odisha, India</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Follow Us</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-slate-300">
            <a
              href="https://www.linkedin.com/in/samir-das-0135b6171/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 transition hover:border-white hover:text-white"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 transition hover:border-white hover:text-white"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 transition hover:border-white hover:text-white"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/70 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} Super Deals Staffing. Built for modern hiring.</div>
    </footer>
  );
}
