import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LogoSlider from '../components/layout/LogoSlider';
import { Briefcase, CheckCircle2, Users } from 'lucide-react';

const stats = [
  { value: '5,000+', label: 'Candidates Placed' },
  { value: '200+', label: 'Hiring Partners' },
  { value: '10+', label: 'Industries Served' },
  { value: '95%', label: 'Client Satisfaction' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="space-y-20 pt-20">
        <section className="page-container grid gap-12 items-center lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.32em] text-orange-500">About Super Deals</p>
            <h1 className="text-5xl font-display font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
              We connect talent with opportunity across Odisha and beyond.
            </h1>
            <p className="max-w-2xl text-lg leading-9 text-slate-600 dark:text-slate-300">
              Super Deals Staffing is a trusted manpower and recruitment partner for businesses and job seekers. We help companies hire quickly and help candidates find meaningful work in IT, hospitality, logistics, finance, security, and more.
            </p>
          </div>
          <div className="rounded-[2rem] bg-slate-100 p-10 shadow-soft dark:bg-slate-900">
            <div className="flex flex-col gap-6">
              <div className="rounded-[1.75rem] bg-orange-500/10 p-6">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Our Promise</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-3">Fast response, quality candidate screening, and reliable hiring support for every business need.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-950">
                    <p className="text-3xl font-bold text-slate-950 dark:text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-container bg-slate-950 text-white rounded-[2rem] p-14 shadow-soft">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500 text-white">
                <Users size={24} />
              </div>
              <h2 className="text-xl font-semibold">Candidate-first support</h2>
              <p className="text-slate-200">We guide job seekers from registration through placement with personalized support and employer matchmaking.</p>
            </div>
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500 text-white">
                <Briefcase size={24} />
              </div>
              <h2 className="text-xl font-semibold">Employer-ready talent</h2>
              <p className="text-slate-200">Our talent pool includes pre-screened candidates across multiple sectors, ready for immediate deployment.</p>
            </div>
            <div className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500 text-white">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-xl font-semibold">Trusted quality</h2>
              <p className="text-slate-200">We focus on quality, reliability, and timely delivery so both businesses and job seekers win.</p>
            </div>
          </div>
        </section>

        <LogoSlider
          label="Trusted by Growing Businesses"
          title="Trusted by Growing Businesses"
          description="Our premium staffing partners rely on fast delivery, reliable talent, and real results."
        />
      </main>
      <Footer />
    </div>
  );
}
