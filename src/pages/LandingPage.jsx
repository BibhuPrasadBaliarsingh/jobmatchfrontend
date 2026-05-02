import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, CheckCircle2, Users, Sparkles } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const clientLogos = [
  'Mercury Logistics',
  'BrightWave',
  'Summit Health',
  'CoreEdge',
  'BluePeak',
  'Nexa Finance',
];

const services = [
  { title: 'Temporary Staffing', description: 'Quick workforce support for urgent needs.' },
  { title: 'Permanent Hiring', description: 'Find long-term talent for key roles.' },
  { title: 'Contract Hiring', description: 'Flexible hiring for project-based work.' },
  { title: 'Executive Search', description: 'Leadership hiring for critical positions.' },
  { title: 'Bulk Hiring', description: 'Scale teams quickly and efficiently.' },
  { title: 'Payroll Support', description: 'Smooth employee management solutions.' },
];

const reasons = [
  'Fast Hiring Turnaround',
  'Pre-Screened Candidates',
  'Industry-Specific Expertise',
  'Quality Talent Pool',
  'Scalable Hiring Solutions',
  'Dedicated Support Team',
];

const industries = [
  'IT & Software',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Logistics',
  'Finance',
  'Hospitality',
  'Telecom',
];

const stats = [
  { value: '5000+', label: 'Candidates Placed' },
  { value: '200+', label: 'Hiring Partners' },
  { value: '10+', label: 'Industries Served' },
  { value: '95%', label: 'Client Satisfaction' },
];

const testimonials = [
  { quote: 'Super Deals Staffing helped us hire quality candidates quickly.', author: 'Asha N., HR Director' },
  { quote: 'Professional team with fast response and excellent service.', author: 'Rohan K., Operations Lead' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const seekerLink = user?.role === 'seeker' ? '/seeker/profile' : '/register?role=seeker';
  const recruiterLink = user?.role === 'recruiter' ? '/recruiter/dashboard' : '/register?role=recruiter';

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="space-y-24">
        <section className="bg-slate-950 text-white">
          <div className="page-container grid gap-12 items-center py-24 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              

              <div className="space-y-6 max-w-3xl">
                <p className="text-sm uppercase tracking-[0.32em] text-orange-300">Staffing & workforce solutions</p>
                <h1 className="text-5xl font-display font-bold tracking-tight text-white sm:text-6xl">
                  Right Talent. Right Time. Right Results.
                </h1>
                <p className="max-w-2xl text-lg leading-9 text-slate-300">
                  We connect top talent with leading companies through temporary staffing, permanent hiring, contract recruitment, and workforce solutions.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={recruiterLink} className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
                  Hire Talent
                  <ArrowRight size={18} />
                </Link>
                <Link to="/seeker/opportunities" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/95 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100">
                  Find Jobs
                </Link>
              </div>

              <p className="text-sm text-slate-300">5000+ Candidates Placed | Trusted by Leading Teams</p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-slate-800/70 p-6 shadow-soft ring-1 ring-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_38%)]" />
              <img
                src="/job-match.png"
                alt="Recruiters meeting clients"
                className="relative h-[420px] w-full rounded-[1.75rem] object-cover shadow-xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </section>

        <section className="page-container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Trusted by Growing Businesses</p>
            <h2 className="mt-4 text-3xl font-display font-bold text-slate-950">Trusted by Growing Businesses</h2>
            <p className="mt-4 text-slate-600">Our premium staffing partners rely on fast delivery, reliable talent, and real results.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {clientLogos.map((name) => (
              <div key={name} className="flex h-24 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-center text-sm font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm filter grayscale transition hover:filter-none hover:shadow-hover">
                {name}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 dark:bg-slate-900">
          <div className="page-container py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Our Staffing Services</p>
              <h2 className="mt-4 text-3xl font-display font-bold text-slate-950 dark:text-white">Our Staffing Services</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Flexible, premium staffing services tailored for hiring success across every team.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">{service.title}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Why Super Deals Staffing</p>
            <h2 className="mt-4 text-3xl font-display font-bold text-slate-950">Why Super Deals Staffing</h2>
            <p className="mt-4 text-slate-600">A premium staffing partner designed for growing businesses and hardworking professionals.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <div key={reason} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3 text-orange-500">
                  <CheckCircle2 size={22} />
                  <span className="font-semibold text-slate-950 dark:text-white">{reason}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 dark:bg-slate-900">
          <div className="page-container py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Serving Diverse Industries</p>
              <h2 className="mt-4 text-3xl font-display font-bold text-slate-950 dark:text-white">Serving Diverse Industries</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry) => (
                <div key={industry} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{industry}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-container grid gap-8 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-10 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.32em] text-orange-300">Need Skilled Talent Fast?</p>
            <h2 className="mt-4 text-3xl font-display font-bold">Need Skilled Talent Fast?</h2>
            <p className="mt-4 text-slate-300">We simplify hiring with smart sourcing, screening, and quick placements.</p>
            <Link
              to={recruiterLink}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Request Talent
            </Link>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-10 shadow-soft">
            <p className="text-sm uppercase tracking-[0.32em] text-orange-500">Looking for the Right Opportunity?</p>
            <h2 className="mt-4 text-3xl font-display font-bold text-slate-950">Looking for the Right Opportunity?</h2>
            <p className="mt-4 text-slate-600">Explore openings that match your skills, experience, and career goals.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to={seekerLink} className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Upload Resume
              </Link>
              <Link to="/seeker/opportunities" className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="page-container py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-orange-300">Our Impact</p>
              <h2 className="mt-4 text-3xl font-display font-bold">Our Impact</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[1.75rem] bg-slate-900/80 p-8 text-center shadow-soft">
                  <p className="text-4xl font-semibold text-white">{item.value}</p>
                  <p className="mt-3 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-orange-500">What Clients Say</p>
            <h2 className="mt-4 text-3xl font-display font-bold text-slate-950">What Clients Say</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.author} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
                <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">“{item.quote}”</p>
                <p className="mt-6 font-semibold text-slate-950 dark:text-white">{item.author}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-orange-500 text-white">
          <div className="page-container rounded-[2rem] border border-white/10 bg-orange-500/95 p-14 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-orange-100/80">Ready to Build Your Team?</p>
                <h2 className="mt-4 text-4xl font-display font-bold">Ready to Build Your Team?</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-orange-100/90">Partner with Super Deals Staffing for reliable hiring solutions.</p>
              </div>
              <Link className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/25 transition hover:bg-slate-800" to={recruiterLink}>
                Get Started Today
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
