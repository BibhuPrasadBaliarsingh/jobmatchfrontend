import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, Briefcase, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-16 py-5 border-b border-ink-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">JM</span>
          </div>
          <span className="font-display font-bold text-ink-900 text-lg">JobMatch</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary btn-sm">Sign in</Link>
          <Link to="/register" className="btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-16 pt-20 pb-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-50 border border-sage-200 rounded-full text-xs font-medium text-sage-800 mb-8">
          <Zap size={12} />
          Skill-based intelligent matching
        </div>

        <h1 className="font-display text-5xl lg:text-7xl font-bold text-ink-900 leading-[1.05] tracking-tight mb-6 text-balance">
          Where talent meets
          <br />
          <span className="text-sage-600">opportunity</span>
        </h1>

        <p className="text-ink-500 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          JobMatch intelligently connects job seekers with the right opportunities — and recruiters with the right candidates — through admin-driven, skill-first matching.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/register?role=seeker" className="btn-primary btn-lg">
            Find a job <ArrowRight size={18} />
          </Link>
          <Link to="/register?role=recruiter" className="btn-secondary btn-lg">
            Hire talent
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-16 py-20 bg-ink-50 border-y border-ink-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-ink-900 mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Build your profile',
                desc: 'Seekers add skills, experience, and preferred roles. Recruiters post their job requirements.',
                color: 'bg-sage-50 text-sage-600',
              },
              {
                icon: Zap,
                title: 'Admin matches',
                desc: 'Our admin reviews profiles and jobs, runs the matching algorithm, and sends curated matches.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: Briefcase,
                title: 'Both sides decide',
                desc: 'Seekers accept or decline opportunities. Recruiters accept or reject candidates. Hiring happens.',
                color: 'bg-coral-50 text-coral-600',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-semibold text-ink-900 text-lg mb-2">{title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="px-6 lg:px-16 py-20 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-center text-ink-900 mb-12">Built for everyone</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seeker card */}
          <div className="card p-8 border-sage-200">
            <h3 className="font-display font-bold text-xl text-ink-900 mb-2">Job Seekers</h3>
            <p className="text-ink-500 text-sm mb-5">Create your profile once and let matched opportunities come to you.</p>
            <ul className="space-y-2.5 mb-6">
              {['Build a rich skill profile', 'Receive curated job matches', 'Accept or decline opportunities', 'Track application status'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-ink-700">
                  <CheckCircle size={15} className="text-sage-600 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/register?role=seeker" className="btn-sage w-full justify-center">
              Join as a Seeker
            </Link>
          </div>

          {/* Recruiter card */}
          <div className="card p-8 border-amber-200">
            <h3 className="font-display font-bold text-xl text-ink-900 mb-2">Recruiters</h3>
            <p className="text-ink-500 text-sm mb-5">Post requirements and receive pre-screened, skill-matched candidates.</p>
            <ul className="space-y-2.5 mb-6">
              {['Post detailed job requirements', 'Receive matched candidate profiles', 'Accept or shortlist candidates', 'Manage all roles in one place'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-ink-700">
                  <CheckCircle size={15} className="text-amber-600 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/register?role=recruiter" className="btn-primary w-full justify-center">
              Join as a Recruiter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 px-6 py-8 text-center text-sm text-ink-400">
        © {new Date().getFullYear()} JobMatch. Built with MERN stack.
      </footer>
    </div>
  );
}
