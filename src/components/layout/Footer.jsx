import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="page-container grid gap-8 py-14 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/logo.PNG" alt="Super Deals" className="h-10 w-10 rounded-xl object-cover bg-white" />
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
            <li><Link to="/" className="transition hover:text-white">About Us</Link></li>
            <li><Link to="/seeker/opportunities" className="transition hover:text-white">Jobs</Link></li>
            <li><Link to="/register" className="transition hover:text-white">Contact</Link></li>
            <li><Link to="/" className="transition hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/" className="transition hover:text-white">Terms</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Follow Us</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-2xl border border-slate-700 px-3 py-2 transition hover:border-white hover:text-white">LinkedIn</span>
            <span className="rounded-2xl border border-slate-700 px-3 py-2 transition hover:border-white hover:text-white">Twitter</span>
            <span className="rounded-2xl border border-slate-700 px-3 py-2 transition hover:border-white hover:text-white">Facebook</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/70 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} Super Deals Staffing. Built for modern hiring.</div>
    </footer>
  );
}
