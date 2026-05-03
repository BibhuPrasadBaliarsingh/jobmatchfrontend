import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { StatCard, PageHeader, StatusBadge, SkillTags, MatchScore, EmptyState, SectionLoader } from '../../components/common/UI';
import { seekerApi } from '../../services/api';
import { Briefcase, CheckCircle, Clock, XCircle, Bell, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);

  const load = async () => {
    try {
      const res = await seekerApi.getDashboard();
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
      await seekerApi.respondToMatch(matchId, status);
      toast.success(status === 'accepted' ? 'Opportunity accepted! 🎉' : 'Opportunity declined.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    } finally {
      setResponding(null);
    }
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <PageHeader
          title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
          subtitle="Here's what's happening with your job search"
          action={
            <Link to="/seeker/opportunities" className="btn-primary btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          }
        />

        {/* Profile incomplete banner */}
        {!user?.isProfileComplete && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={18} className="text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-900">Complete your profile</p>
                <p className="text-xs text-amber-700">Add skills and experience to get matched with better opportunities.</p>
              </div>
            </div>
            <Link to="/seeker/profile" className="btn-secondary btn-sm border-amber-200 hover:bg-amber-100 text-amber-800">
              Complete →
            </Link>
          </div>
        )}

        {loading ? <SectionLoader /> : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Briefcase} label="Total Matches" value={data?.stats?.totalOpportunities || 0} color="sage" />
              <StatCard icon={Clock} label="Pending" value={data?.stats?.pending || 0} color="amber" />
              <StatCard icon={CheckCircle} label="Accepted" value={data?.stats?.accepted || 0} color="ink" />
              <StatCard icon={Bell} label="Unread" value={data?.stats?.unreadNotifications || 0} color="coral" />
            </div>

            {/* Recent matches */}
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-ink-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100">Recent Opportunities</h2>
                <Link to="/seeker/opportunities" className="text-sm text-sage-600 hover:text-sage-700 font-medium">
                  See all →
                </Link>
              </div>

              {data?.matches?.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="No opportunities yet"
                  message="Once the admin matches you with a job, it will appear here."
                  action={
                    <Link to="/seeker/profile" className="btn-sage btn-sm">Complete Profile</Link>
                  }
                />
              ) : (
                <div className="divide-y divide-ink-50 dark:divide-slate-700">
                  {data?.matches?.slice(0, 5).map((match) => (
                    <div key={match._id} className="px-6 py-5 hover:bg-ink-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <MatchScore score={match.matchScore} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-ink-900 dark:text-slate-100 text-sm">{match.job?.title}</h3>
                              <span className="badge badge-ink text-xs">{match.job?.jobType}</span>
                            </div>
                            <p className="text-ink-500 dark:text-slate-300 text-xs mt-0.5">
                              {match.job?.companyName} · {match.job?.location}
                            </p>
                            {match.job?.requiredSkills && (
                              <div className="mt-2">
                                <SkillTags skills={match.job.requiredSkills} max={4} />
                              </div>
                            )}
                            <p className="text-ink-400 dark:text-slate-400 text-xs mt-2">
                              Sent {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {match.seekerStatus === 'pending' ? (
                            <>
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
                            </>
                          ) : (
                            <StatusBadge status={match.seekerStatus} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Sidebar>
  );
}
