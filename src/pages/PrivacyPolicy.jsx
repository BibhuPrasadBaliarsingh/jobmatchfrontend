import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="page-container py-20">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-4xl font-display font-bold">Privacy Policy</h1>
          <p className="text-slate-600 dark:text-slate-300">At Super Deals Staffing, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our services.</p>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p className="text-slate-600 dark:text-slate-300">We collect information you provide directly to us when registering, applying for jobs, or contacting support, such as name, email, phone number, location, resume details, and preferences.</p>
          </section>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">How We Use Your Data</h2>
            <p className="text-slate-600 dark:text-slate-300">We use collected data to match candidates with job opportunities, manage accounts, communicate with you, and improve our platform.</p>
          </section>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p className="text-slate-600 dark:text-slate-300">We take reasonable measures to protect your information, but no online service can guarantee absolute security. We encourage you to safeguard your account credentials.</p>
          </section>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p className="text-slate-600 dark:text-slate-300">If you have questions about this Privacy Policy, reach out to us at hrsuperdealsbbsr@gmail.com.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
