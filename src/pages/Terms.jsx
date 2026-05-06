import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="page-container py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl font-display font-bold">Terms of Service</h1>
          <p className="text-slate-600 dark:text-slate-300">These Terms of Service govern your use of the Super Deals Staffing platform. By using our site, you agree to follow these terms and all applicable laws.</p>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">Use of the Platform</h2>
            <p className="text-slate-600 dark:text-slate-300">You agree to use the platform lawfully, honestly, and responsibly. Misuse of the service, including fraudulent activity or improper job postings, is prohibited.</p>
          </section>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">User Accounts</h2>
            <p className="text-slate-600 dark:text-slate-300">You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
          </section>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
            <p className="text-slate-600 dark:text-slate-300">All content on this platform, including text and graphics, is owned by Super Deals Staffing or licensors and may not be copied without permission.</p>
          </section>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="text-slate-600 dark:text-slate-300">If you have questions about these terms, contact us at hrsuperdealsbbsr@gmail.com.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
