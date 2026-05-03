import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, MatchScore, StatusBadge, SkillTags, Pagination, SectionLoader, EmptyState } from '../../components/common/UI';
import { adminApi } from '../../services/api';
import { Zap, Search, User, Building2, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const FILTERS = ['', 'active', 'hired', 'closed'];

export default function AdminMatches() {
  const [data, setData] = useState({ matches: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMatches({ status: statusFilter, page, limit: 15 });
      setData({ matches: res.data.data, pagination: res.data.pagination });
    } catch { toast.error('Failed to load matches'); }
    finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <PageHeader title="All Matches" subtitle={`${data.pagination?.total || 0} total matches created`} />

        <div className="flex items-center gap-1 p-1 bg-ink-100 dark:bg-slate-800 rounded-xl w-fit mb-6">
          {[{ v: '', l: 'All' }, { v: 'active', l: 'Active' }, { v: 'hired', l: 'Hired' }, { v: 'closed', l: 'Closed' }].map(({ v, l }) => (
            <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${statusFilter === v ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-100' : 'text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>

        {loading ? <SectionLoader /> : data.matches.length === 0 ? (
          <EmptyState icon={Zap} title="No matches yet" message="Use the Match Engine to create matches between seekers and jobs." />
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {data.matches.map(match => (
                <div key={match._id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <MatchScore score={match.matchScore} />
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={match.status} />
                          {match.status === 'hired' && <span className="badge badge-green">🎉</span>}
                        </div>
                        <span className="text-xs text-ink-400">
                          {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        {/* Seeker */}
                        <div className="bg-sage-50 rounded-xl p-3 border border-sage-100">
                          <p className="text-sage-700 text-xs font-medium mb-1 flex items-center gap-1"><User size={11} /> Seeker</p>
                          <p className="font-medium text-ink-900 text-sm">{match.seeker?.name}</p>
                          <p className="text-ink-500 text-xs">{match.seeker?.email}</p>
                          <p className="text-ink-400 text-xs mt-0.5">{match.seeker?.experienceYears} yrs exp</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="text-xs text-ink-500">Status:</span>
                            <StatusBadge status={match.seekerStatus} />
                          </div>
                        </div>

                        {/* Job */}
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                          <p className="text-amber-700 text-xs font-medium mb-1 flex items-center gap-1"><Briefcase size={11} /> Job</p>
                          <p className="font-medium text-ink-900 text-sm">{match.job?.title}</p>
                          <p className="text-ink-500 text-xs">{match.job?.companyName}</p>
                          <p className="text-ink-400 text-xs mt-0.5">{match.job?.location}</p>
                        </div>

                        {/* Recruiter */}
                        <div className="bg-ink-50 rounded-xl p-3 border border-ink-100">
                          <p className="text-ink-600 text-xs font-medium mb-1 flex items-center gap-1"><Building2 size={11} /> Recruiter</p>
                          <p className="font-medium text-ink-900 text-sm">{match.recruiter?.name}</p>
                          <p className="text-ink-500 text-xs">{match.recruiter?.email}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="text-xs text-ink-500">Status:</span>
                            <StatusBadge status={match.recruiterStatus} />
                          </div>
                        </div>
                      </div>

                      {match.matchedSkills?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-ink-500 mb-1">Matched skills</p>
                          <SkillTags skills={match.matchedSkills} max={6} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination pagination={data.pagination} onPage={setPage} />
          </>
        )}
      </div>
    </Sidebar>
  );
}
