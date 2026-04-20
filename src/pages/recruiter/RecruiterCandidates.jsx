import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, StatusBadge, SkillTags, MatchScore, EmptyState, SectionLoader } from '../../components/common/UI';
import { recruiterApi } from '../../services/api';
import { Users, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const FILTERS = ['all', 'pending', 'accepted', 'rejected'];

export default function RecruiterCandidates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [responding, setResponding] = useState(null);

  const load = async () => {
    try {
      const res = await recruiterApi.getDashboard();
      setData(res.data.data);
    } catch { toast.error('Failed to load candidates'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const respond = async (matchId, status) => {
    setResponding(matchId + status);
    try {
      await recruiterApi.respondToMatch(matchId, status);
      toast.success(status === 'accepted' ? 'Candidate shortlisted!' : 'Candidate declined.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to respond');
    } finally { setResponding(null); }
  };

  const matches = data?.matches || [];
  const filtered = filter === 'all' ? matches : matches.filter(m => m.recruiterStatus === filter);

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <PageHeader title="Matched Candidates" subtitle={`${matches.length} candidate${matches.length !== 1 ? 's' : ''} matched by admin`} />

        <div className="flex items-center gap-1 p-1 bg-ink-100 rounded-xl w-fit mb-6">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all
                ${filter === f ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'}`}>
              {f}
              {f !== 'all' && <span className="ml-1.5 text-xs opacity-60">({matches.filter(m => m.recruiterStatus === f).length})</span>}
            </button>
          ))}
        </div>

        {loading ? <SectionLoader /> : filtered.length === 0 ? (
          <EmptyState icon={Users} title={filter === 'all' ? 'No candidates yet' : `No ${filter} candidates`}
            message="Admin will send matched candidates based on your job requirements." />
        ) : (
          <div className="space-y-4">
            {filtered.map(match => (
              <div key={match._id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <MatchScore score={match.matchScore} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-ink-900">{match.seeker?.name}</h3>
                        <StatusBadge status={match.recruiterStatus} />
                        {match.status === 'hired' && <span className="badge badge-green">🎉 Hired</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-ink-500 mb-3">
                        <span className="flex items-center gap-1"><Mail size={11} />{match.seeker?.email}</span>
                        {match.seeker?.phone && <span className="flex items-center gap-1"><Phone size={11} />{match.seeker.phone}</span>}
                        <span className="font-medium text-ink-600">{match.seeker?.experienceYears} yrs exp</span>
                      </div>
                      <p className="text-ink-400 text-xs mb-2">
                        For: <span className="font-medium text-ink-600">{match.job?.title}</span>
                      </p>
                      {match.seeker?.skills?.length > 0 && <SkillTags skills={match.seeker.skills} max={6} />}
                      <p className="text-ink-400 text-xs mt-2">
                        Received {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                        {' · '} Candidate: <StatusBadge status={match.seekerStatus} />
                      </p>
                    </div>
                  </div>
                  {match.recruiterStatus === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => respond(match._id, 'rejected')} disabled={!!responding}
                        className="btn-secondary btn-sm text-coral-600 border-coral-200 hover:bg-coral-50">
                        <XCircle size={13} /> Decline
                      </button>
                      <button onClick={() => respond(match._id, 'accepted')} disabled={!!responding}
                        className="btn-sage btn-sm">
                        <CheckCircle size={13} /> Shortlist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
