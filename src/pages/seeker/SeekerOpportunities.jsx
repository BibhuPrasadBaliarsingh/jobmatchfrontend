import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, StatusBadge, SkillTags, MatchScore, EmptyState, SectionLoader } from '../../components/common/UI';
import { seekerApi } from '../../services/api';
import { Briefcase, CheckCircle, XCircle, MapPin, Clock, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const FILTERS = ['all', 'pending', 'accepted', 'rejected'];

export default function SeekerOpportunities() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [responding, setResponding] = useState(null);

  const load = async () => {
    try {
      const res = await seekerApi.getDashboard();
      setData(res.data.data);
    } catch {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (matchId, status) => {
    setResponding(matchId + status);
    try {
      await seekerApi.respondToMatch(matchId, status);
      toast.success(status === 'accepted' ? 'Opportunity accepted! 🎉' : 'Opportunity declined.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    } finally {
      setResponding(null);
    }
  };

  const matches = data?.matches || [];
  const filtered = filter === 'all' ? matches : matches.filter(m => m.seekerStatus === filter);

  const JOB_TYPE_COLORS = {
    'full-time': 'badge-sage',
    'part-time': 'badge-amber',
    'contract': 'badge-ink',
    'internship': 'badge-coral',
    'remote': 'badge-green',
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <PageHeader
          title="My Opportunities"
          subtitle={`${matches.length} total match${matches.length !== 1 ? 'es' : ''} found for your profile`}
        />

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-ink-100 dark:bg-slate-800 rounded-xl w-fit mb-6">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
                ${filter === f ? 'bg-white text-ink-900 shadow-sm dark:bg-slate-100 dark:text-slate-950' : 'text-ink-500 dark:text-slate-300 hover:text-ink-700 dark:hover:text-white'}`}
            >
              {f}
              {f !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({matches.filter(m => m.seekerStatus === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? <SectionLoader /> : filtered.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={filter === 'all' ? 'No opportunities yet' : `No ${filter} opportunities`}
            message={filter === 'all'
              ? 'Admin will match you with relevant jobs based on your profile. Keep your skills updated!'
              : `You have no ${filter} opportunities.`}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((match) => (
              <div key={match._id} className="card p-6 hover:shadow-hover transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <MatchScore score={match.matchScore} />
                    <div>
                      <h3 className="font-display font-semibold text-ink-900 dark:text-slate-100 text-base">{match.job?.title}</h3>
                      <p className="text-ink-500 dark:text-slate-300 text-sm">{match.job?.companyName}</p>
                    </div>
                  </div>
                  <StatusBadge status={match.seekerStatus} />
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 dark:text-slate-300 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {match.job?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                  </span>
                  {match.job?.jobType && (
                    <span className={`badge ${JOB_TYPE_COLORS[match.job.jobType] || 'badge-ink'}`}>
                      {match.job.jobType}
                    </span>
                  )}
                  <span className="text-ink-400 dark:text-slate-400">
                    {match.job?.experienceRequired}+ yrs exp required
                  </span>
                </div>

                {/* Matched skills */}
                {match.matchedSkills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-ink-500 dark:text-slate-300 font-medium mb-1.5 flex items-center gap-1">
                      <Filter size={11} /> Matched skills
                    </p>
                    <SkillTags skills={match.matchedSkills} max={8} />
                  </div>
                )}

                {/* Required skills */}
                {match.job?.requiredSkills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-ink-500 dark:text-slate-300 font-medium mb-1.5">All required skills</p>
                    <SkillTags skills={match.job.requiredSkills} max={6} />
                  </div>
                )}

                {/* Recruiter status */}
                <div className="flex items-center justify-between pt-4 border-t border-ink-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-slate-300">
                    <span>Recruiter status:</span>
                    <StatusBadge status={match.recruiterStatus} />
                  </div>

                  {match.seekerStatus === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => respond(match._id, 'rejected')}
                        disabled={!!responding}
                        className="btn-secondary btn-sm text-coral-600 border-coral-200 hover:bg-coral-50"
                      >
                        <XCircle size={14} /> Decline
                      </button>
                      <button
                        onClick={() => respond(match._id, 'accepted')}
                        disabled={!!responding}
                        className="btn-sage btn-sm"
                      >
                        <CheckCircle size={14} /> Accept
                      </button>
                    </div>
                  ) : match.status === 'hired' ? (
                    <span className="badge badge-green text-sm font-semibold">🎉 Hired!</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
