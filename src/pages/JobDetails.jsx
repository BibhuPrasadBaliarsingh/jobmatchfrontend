import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsApi } from '../services/api';
import { PageHeader, SectionLoader, SkillTags, EmptyState } from '../components/common/UI';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Clock, Globe, Sparkles } from 'lucide-react';

function sanitizePhone(phone) {
  if (!phone) return null;
  return String(phone).replace(/[^0-9]/g, '');
}

function openWhatsApp(phone, message) {
  const cleaned = sanitizePhone(phone);
  if (!cleaned) return;
  window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`, '_blank');
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        const res = await jobsApi.getOne(id);
        setJob(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load job details.');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const handleApply = () => {
    if (!user) {
      return navigate('/login', {
        state: {
          from: `/jobs/${id}`,
          jobPreview: {
            id,
            title: job?.title,
            companyName: job?.companyName,
            location: job?.location,
            jobType: job?.jobType,
            experienceRequired: job?.experienceRequired,
            salaryRange: job?.salaryRange,
          },
        },
      });
    }

    if (user.role === 'seeker') {
      const recruiterPhone = job?.recruiter?.phone;
      if (!recruiterPhone) return;

      const jobLink = `${window.location.origin}/jobs/${job._id}`;
      const message = [
        "Hi, I'm interested in this job:",
        `${job.title} at ${job.companyName}`,
        `Location: ${job.location} | Type: ${job.jobType} | Experience: ${job.experienceRequired || 'N/A'}`,
        '---',
        `Candidate: ${user.name || 'N/A'}`,
        `Phone: ${user.phone || 'N/A'}`,
        user.resumeUrl ? `Resume: ${user.resumeUrl}` : null,
        `Profile: ${window.location.origin}/seeker/profile`,
        `Job Link: ${jobLink}`,
      ].filter(Boolean).join('\n');

      openWhatsApp(recruiterPhone, message);
      return;
    }

    navigate(`/${user.role}/dashboard`);
  };

  if (loading) return <SectionLoader />;

  if (error) {
    return (
      <div className="page-container py-16">
        <div className="rounded-3xl border border-coral-200 bg-coral-50 p-8 text-coral-700">{error}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-container py-16">
        <EmptyState
          icon={Sparkles}
          title="Job not found"
          message="The job you're looking for may have been removed or does not exist."
        />
      </div>
    );
  }

  return (
    <div className="page-container py-16">
      <PageHeader title={job.title} subtitle={job.companyName} />

      <div className="grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-6">
              <span className="inline-flex items-center gap-2"><MapPin size={16} />{job.location || 'N/A'}</span>
              <span className="inline-flex items-center gap-2"><Globe size={16} />{job.jobType || 'N/A'}</span>
              <span className="inline-flex items-center gap-2"><Clock size={16} />{job.experienceRequired !== undefined ? `${job.experienceRequired}+ yrs` : 'N/A'}</span>
              <span className="inline-flex items-center gap-2"><Briefcase size={16} />{job.requiredSkills?.length ? `${job.requiredSkills.length} skills` : 'N/A'}</span>
            </div>
            <div className="mb-6">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Job Summary</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-7">{job.description}</p>
            </div>
            <div className="space-y-4">
              {job.requiredSkills?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Required Skills</h3>
                  <SkillTags skills={job.requiredSkills} />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Salary</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {job.salaryRange?.min || job.salaryRange?.max
                    ? `${job.salaryRange?.min ? `₹${job.salaryRange.min}` : ''}${job.salaryRange?.min && job.salaryRange?.max ? ' - ' : ''}${job.salaryRange?.max ? `₹${job.salaryRange.max}` : ''}`
                    : 'Not disclosed'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">About the Company</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Contact details are available to seekers after logging in. Please sign in to apply.</p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500 mb-3">Apply for this role</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{job.title}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Type</p>
                <p>{job.jobType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Experience</p>
                <p>{job.experienceRequired !== undefined ? `${job.experienceRequired}+ yrs` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p>{job.location || 'N/A'}</p>
              </div>
            </div>
            <button
              onClick={handleApply}
              className="mt-6 btn-primary w-full py-3 text-sm cursor-pointer"
            >
              {user ? 'Apply now' : 'Login to apply'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
