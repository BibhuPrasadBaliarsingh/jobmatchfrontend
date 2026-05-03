import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { StatCard, PageHeader, StatusBadge, SkillTags, MatchScore, EmptyState, SectionLoader } from '../../components/common/UI';
import { recruiterApi } from '../../services/api';
import { Briefcase, Users, CheckCircle, Clock, XCircle, Bell, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [activeTab, setActiveTab] = useState('candidates');

  const load = async () => {
    try {
      const res = await recruiterApi.getDashboard();
      setData(res.data.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (matchId, status) => {
    setResponding(matchId + status);
    try {
      await recruiterApi.respondToMatch(matchId, status);
      toast.success(status === 'accepted' ? 'Candidate shortlisted! ✅' : 'Candidate declined.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    } finally {
      setResponding(null);
    }
  };

  const JOB_STATUS_COLORS = { active: 'badge-sage', closed: 'badge-ink', draft: 'badge-amber' };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <PageHeader
          title="Recruiter Dashboard"
          subtitle="Manage your job postings and review matched candidates"
          action={
            <Link to="/recruiter/post-job" className="btn-primary btn-sm">
              <Plus size={15} /> Post a Job
            </Link>
          }
        />

        {loading ? <SectionLoader /> : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard icon={Briefcase} label="Active Jobs" value={data?.stats?.activeJobs || 0} color="sage" />
              <StatCard icon={Users} label="Matched Candidates" value={data?.stats?.totalCandidates || 0} color="amber" />
              <StatCard icon={Clock} label="Pending Review" value={data?.stats?.pendingReview || 0} color="coral" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-ink-100 dark:bg-slate-800 rounded-xl w-fit mb-6">
              {[{ id: 'candidates', label: 'Candidates', count: data?.matches?.length },
                { id: 'jobs', label: 'My Jobs', count: data?.jobs?.length }].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                    ${activeTab === tab.id ? 'bg-white text-ink-900 shadow-sm dark:bg-slate-100 dark:text-slate-950' : 'text-ink-500 dark:text-slate-300 hover:text-ink-700 dark:hover:text-white'}`}
                >
                  {tab.label}
                  <span className="text-xs opacity-60">({tab.count || 0})</span>
                </button>
              ))}
            </div>

            {/* Candidates tab */}
            {activeTab === 'candidates' && (
              data?.matches?.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No candidates yet"
                  message="Admin will send matched candidates once they review your job requirements."
                />
              ) : (
                <div className="space-y-4">
                  {data.matches.map(match => (
                    <div key={match._id} className="card p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <MatchScore score={match.matchScore} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-ink-900 dark:text-slate-100">{match.seeker?.name}</h3>
                              <StatusBadge status={match.recruiterStatus} />
                            </div>
                            <p className="text-ink-500 dark:text-slate-300 text-sm">{match.seeker?.email}</p>
                            <p className="text-ink-400 dark:text-slate-400 text-xs mt-0.5">
                              For: <span className="font-medium text-ink-600 dark:text-slate-200">{match.job?.title}</span>
                              {' · '}{match.seeker?.experienceYears} yrs exp
                            </p>

                            {match.seeker?.skills?.length > 0 && (
                              <div className="mt-2">
                                <SkillTags skills={match.seeker.skills} max={5} />
                              </div>
                            )}

                            <p className="text-ink-400 dark:text-slate-400 text-xs mt-2">
                              Received {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-xs text-ink-400 dark:text-slate-400">
                            Candidate: <StatusBadge status={match.seekerStatus} />
                          </div>
                          {match.recruiterStatus === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => respond(match._id, 'rejected')}
                                disabled={!!responding}
                                className="btn-secondary btn-sm text-coral-600 border-coral-200 hover:bg-coral-50"
                              >
                                <XCircle size={13} /> Decline
                              </button>
                              <button
                                onClick={() => respond(match._id, 'accepted')}
                                disabled={!!responding}
                                className="btn-sage btn-sm"
                              >
                                <CheckCircle size={13} /> Shortlist
                              </button>
                            </div>
                          ) : match.status === 'hired' ? (
                            <span className="badge badge-green">🎉 Hired</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Jobs tab */}
            {activeTab === 'jobs' && (
              data?.jobs?.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs posted yet"
                  message="Post your first job requirement to start receiving matched candidates."
                  action={<Link to="/recruiter/post-job" className="btn-primary btn-sm"><Plus size={14} /> Post Job</Link>}
                />
              ) : (
                <div className="card overflow-hidden">
                  <div className="divide-y divide-ink-50">
                    {data.jobs.map(job => (
                      <div key={job._id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-ink-50/40 dark:hover:bg-slate-800/40 transition-colors">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-ink-900 dark:text-slate-100 text-sm">{job.title}</h3>
                            <span className={`badge ${JOB_STATUS_COLORS[job.status] || 'badge-ink'}`}>{job.status}</span>
                            <span className="badge badge-ink">{job.jobType}</span>
                          </div>
                          <p className="text-ink-500 dark:text-slate-300 text-xs mt-0.5 flex items-center gap-1">
                            <MapPin size={11} />{job.location} · {job.experienceRequired}+ yrs
                          </p>
                          <div className="mt-1.5">
                            <SkillTags skills={job.requiredSkills} max={4} />
                          </div>
                        </div>
                        <p className="text-xs text-ink-400 dark:text-slate-400 flex-shrink-0">
                          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </Sidebar>
  );
}
