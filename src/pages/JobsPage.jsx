import React, { useEffect, useState } from 'react';
import { PageHeader, SectionLoader, EmptyState } from '../components/common/UI';
import { Sparkles } from 'lucide-react';
import { jobsApi } from '../services/api';
import JobCard from '../components/layout/JobCard';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await jobsApi.getAll({ page: 1, limit: 20 });
        setJobs(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="page-container py-16">
        <PageHeader
          title="Explore Jobs"
          subtitle="Browse the latest opportunities and apply after signing in."
        />

        {loading ? (
          <SectionLoader />
        ) : error ? (
          <div className="rounded-3xl border border-coral-200 bg-coral-50 p-8 text-coral-700">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No job listings yet"
            message="We are working to add new jobs soon. Check back later."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
