import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LogoSlider from '../components/layout/LogoSlider';
import JobCard from '../components/layout/JobCard';
import { useAuth } from '../context/AuthContext';

const jobs = [
  {
    company: 'Elevate Tech',
    title: 'Senior Product Designer',
    salary: '₹18L - ₹24L/yr',
    location: 'Bhubaneswar',
    qualification: 'B.Des / Design',
    experience: '5+ years',
    logo: 'https://media.licdn.com/dms/image/v2/D560BAQFFvoobar7g0w/company-logo_200_200/B56Z2WJ2WwIYAI-/0/1776340659574/elevate_tech_india_pvt_ltd_logo?e=2147483647&v=beta&t=2UfEsQLAllYckK8A16oraDqm1-VAcmK1FO8vvvhnIDE',
  },
  {
    company: 'RedPeak Solutions',
    title: 'Full Stack Engineer',
    salary: '₹15L - ₹20L/yr',
    location: 'Bengaluru',
    qualification: 'B.Tech / MCA',
    experience: '3+ years',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8ao-tErXIs4_156e23tl4u48n7hrCjt3uRw&s',
  },
  {
    company: 'Nova Labs',
    title: 'Growth Marketing Lead',
    salary: '₹12L - ₹16L/yr',
    location: 'Mumbai',
    qualification: 'MBA / Marketing',
    experience: '4+ years',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH9CQ7grzCnp22JU502KJHEU8V8nQpOqptQQ&s',
  },
  {
    company: 'PivotWorks',
    title: 'Data Analyst',
    salary: '₹9L - ₹12L/yr',
    location: 'Hyderabad',
    qualification: 'B.Sc / B.Tech',
    experience: '2+ years',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdayKPDZR3NE8cHH9hNDQJneZE4T8XUhPegA&s',
  },
  {
    company: 'Summit Health',
    title: 'HR Business Partner',
    salary: '₹11L - ₹14L/yr',
    location: 'Odisha',
    qualification: 'MBA / HR',
    experience: '4+ years',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROGfE-GvrF8hiAWc3_gPvb1aSN3GgwC6-duQ&s',
  },
  {
    company: 'CodaEdge',
    title: 'Cloud Operations Engineer',
    salary: '₹13L - ₹17L/yr',
    location: 'Pune',
    qualification: 'B.Tech / AWS cert',
    experience: '3+ years',
    logo: 'https://www.codedgeacademy.com/logoheader.png',
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const uploadResumeLink = user?.role === 'seeker' ? '/seeker/profile' : '/register?role=seeker';

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="space-y-24">
        <section className="bg-slate-50 dark:bg-slate-950">
          <div className="page-container grid gap-10 items-center py-20 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm">
                <Zap size={16} />
                Smart job matching across multiple industries
              </div>

              <div className="space-y-5 max-w-2xl">
                <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-slate-950 dark:text-slate-50 leading-tight">
                  Find Your Perfect Job Match
                </h1>
                <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Smart job matching across multiple industries. Connect with top employers, track your applications, and land roles that fit your experience.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to={uploadResumeLink} className="btn-primary btn-lg w-full sm:w-auto">
                  Upload Resume
                </Link>
                <Link to="/seeker/opportunities" className="btn-outline btn-lg w-full sm:w-auto">
                  Browse Jobs
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-slate-100">
              <img
                src="/job-match.png"
                alt="Job search illustration"
                className="h-full w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </section>

        <section className="page-container">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-primary-600">Open roles for top talent</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-bold text-slate-950">
              Featured openings that match your ambitions
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={`${job.company}-${job.title}`} job={job} />
            ))}
          </div>
        </section>

        <LogoSlider />
      </main>

      <Footer />
    </div>
  );
}
