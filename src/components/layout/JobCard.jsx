import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fallbackLogo = useMemo(() => {
    const letter = (job?.company || 'Job').trim().charAt(0).toUpperCase() || 'J';
    return `https://placehold.co/80x80/png?text=${encodeURIComponent(letter)}`;
  }, [job?.company]);
  const [logoSrc, setLogoSrc] = useState(job?.logo || fallbackLogo);

  const handleApply = () => {
    if (!user) return navigate('/login');
    if (user.role === 'seeker') return navigate('/seeker/opportunities');
    return navigate(`/${user.role}/dashboard`);
  };

  return (
    <article className="card-hover p-6 transition duration-200">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 shadow-sm">
            <img
              src={logoSrc}
              alt={job.company}
              loading="lazy"
              onError={() => setLogoSrc(fallbackLogo)}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{job.company}</p>
            <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
          </div>
        </div>
        <p className="text-right text-sm font-semibold text-primary-700">{job.salary}</p>
      </div>

      <ul className="space-y-3 text-sm text-slate-600 mb-6">
        <li className="flex items-center gap-2">
          <span className="min-w-[90px] font-medium text-slate-800">Location</span>
          {job.location}
        </li>
        <li className="flex items-center gap-2">
          <span className="min-w-[90px] font-medium text-slate-800">Qualification</span>
          {job.qualification}
        </li>
        <li className="flex items-center gap-2">
          <span className="min-w-[90px] font-medium text-slate-800">Experience</span>
          {job.experience}
        </li>
      </ul>

      <button onClick={handleApply} className="btn-primary w-full py-3 text-sm">Apply now</button>
    </article>
  );
}
