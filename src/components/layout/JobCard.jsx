import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveAssetUrl } from '../../services/api';

function sanitizePhone(phone) {
  if (!phone) return null;
  // remove non-digit characters
  const digits = String(phone).replace(/[^0-9]/g, '');
  return digits || null;
}

function openWhatsApp(phone, message) {
  if (!phone) return null;
  const cleaned = sanitizePhone(phone);
  if (!cleaned) return null;
  const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fallbackLogo = useMemo(() => {
    const letter = (job?.companyName || 'Job').trim().charAt(0).toUpperCase() || 'J';
    return `https://placehold.co/80x80/png?text=${encodeURIComponent(letter)}`;
  }, [job?.companyName]);
  const [logoSrc, setLogoSrc] = useState(resolveAssetUrl(job?.logo) || fallbackLogo);

  const handleApply = () => {
    if (!user) {
      return navigate('/login', {
        state: {
          from: `/jobs/${job._id}`,
          jobPreview: {
            id: job._id,
            title: job.title,
            companyName: job.companyName,
            location: job.location,
            jobType: job.jobType,
            experienceRequired: job.experienceRequired,
            salaryRange: job.salaryRange,
          },
        },
      });
    }

    if (user.role === 'seeker') {
      const recruiterPhone = job.recruiter?.phone;
      if (!recruiterPhone) return navigate(`/jobs/${job._id}`);

      const jobLink = `${window.location.origin}/jobs/${job._id}`;
      const parts = [];
      parts.push("Hi, I'm interested in the job listed below:");
      parts.push(`Job: ${job.title} at ${job.companyName}`);
      parts.push(`Location: ${job.location} | Type: ${job.jobType} | Experience: ${job.experienceRequired || 'N/A'}`);
      parts.push('---');
      parts.push(`Candidate: ${user.name || 'N/A'}`);
      parts.push(`Phone: ${user.phone || 'N/A'}`);
      if (user.resumeUrl) parts.push(`Resume: ${user.resumeUrl}`);
      parts.push(`Profile: ${window.location.origin}/seeker/profile`);
      parts.push(`Job Link: ${jobLink}`);

      const message = parts.join('\n');
      return openWhatsApp(recruiterPhone, message);
    }

    return navigate(`/${user.role}/dashboard`);
  };

  return (
    <article className="card-hover p-6 transition duration-200">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 shadow-sm">
            <img
              src={logoSrc}
              alt={job.companyName}
              loading="lazy"
              onError={() => setLogoSrc(fallbackLogo)}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{job.companyName}</p>
            <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
          </div>
        </div>
        <p className="text-right text-sm font-semibold text-primary-700">
          {job.salaryRange?.min || job.salaryRange?.max
            ? `${job.salaryRange?.min ? `₹${job.salaryRange.min}` : ''}${job.salaryRange?.min && job.salaryRange?.max ? ' - ' : ''}${job.salaryRange?.max ? `₹${job.salaryRange.max}` : ''}`
            : 'Salary not disclosed'}
        </p>
      </div>

      <ul className="space-y-3 text-sm text-slate-600 mb-6">
        <li className="flex items-center gap-2">
          <span className="min-w-[90px] font-medium text-slate-800">Location</span>
          {job.location || 'N/A'}
        </li>
        <li className="flex items-center gap-2">
          <span className="min-w-[90px] font-medium text-slate-800">Type</span>
          {job.jobType || 'N/A'}
        </li>
        <li className="flex items-center gap-2">
          <span className="min-w-[90px] font-medium text-slate-800">Experience</span>
          {job.experienceRequired !== undefined ? `${job.experienceRequired}+ yrs` : 'N/A'}
        </li>
      </ul>

      <div className="flex gap-3">
        <button onClick={handleApply} className="flex-1 btn-primary py-3 text-sm cursor-pointer">
          {user ? 'Apply now' : 'Login to apply'}
        </button>
        <button onClick={() => navigate(`/jobs/${job._id}`)} className="flex-1 btn-secondary py-3 text-sm cursor-pointer">
          View Details
        </button>
      </div>
    </article>
  );
}
