import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="page-container grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src="/logo.PNG" alt="Super Deals" className="h-10 w-10 rounded-xl object-cover bg-white" />
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Super Deals</p>
          </div>
          <h2 className="text-2xl font-display font-semibold">Your next hire starts here.</h2>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-300 uppercase tracking-wide">Contact</p>
          <p className="mt-4 text-slate-200 text-sm leading-7">Reach our team for hiring support, candidate matching, and premium staffing services.</p>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <p className="font-semibold text-white">Email</p>
            <p>contact@superdeals.com</p>
          </div>
          <div>
            <p className="font-semibold text-white">Location</p>
            <p>Odisha, India</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/70 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} Super Deals. Built for modern hiring.</div>
    </footer>
  );
}
