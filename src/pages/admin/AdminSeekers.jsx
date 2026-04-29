import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, SkillTags, Pagination, SectionLoader, EmptyState } from '../../components/common/UI';
import { adminApi } from '../../services/api';
import { Users, Search, Mail, MapPin, ToggleLeft, ToggleRight, FileText, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminSeekers() {
  const [data, setData] = useState({ seekers: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSeekers({ search, page, limit: 15 });
      setData({ seekers: res.data.data, pagination: res.data.pagination });
    } catch { toast.error('Failed to load seekers'); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = e => { setSearch(e.target.value); setPage(1); };

  const toggleUser = async (id) => {
    setToggling(id);
    try {
      await adminApi.toggleUser(id);
      toast.success('User status updated.');
      load();
    } catch { toast.error('Failed to update status'); }
    finally { setToggling(null); }
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <PageHeader title="Job Seekers" subtitle={`${data.pagination?.total || 0} registered seekers`} />

        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-10" placeholder="Search by name, email, or location..." value={search} onChange={handleSearch} />
        </div>

        {loading ? <SectionLoader /> : data.seekers.length === 0 ? (
          <EmptyState icon={Users} title="No seekers found" message="No registered job seekers yet." />
        ) : (
          <>
            <div className="card overflow-hidden mb-4">
              <div className="divide-y divide-ink-50">
                {data.seekers.map(seeker => (
                  <div key={seeker._id} className="px-6 py-4 hover:bg-ink-50/40 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-medium text-ink-900">{seeker.name}</h3>
                          {seeker.isProfileComplete
                            ? <span className="badge badge-sage">Complete</span>
                            : <span className="badge badge-amber">Incomplete</span>}
                          {!seeker.isActive && <span className="badge badge-coral">Deactivated</span>}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-ink-500 mb-2">
                          <span className="flex items-center gap-1"><Mail size={11} />{seeker.email}</span>
                          {seeker.location && <span className="flex items-center gap-1"><MapPin size={11} />{seeker.location}</span>}
                          <span className="font-mono">{seeker.experienceYears} yrs exp</span>
                          <span>Joined {formatDistanceToNow(new Date(seeker.createdAt), { addSuffix: true })}</span>
                          {seeker.resumeUrl && (
                            <a
                              href={seeker.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sage-700 hover:text-sage-800 font-medium"
                              title="Open resume"
                            >
                              <FileText size={12} /> Resume <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        {seeker.skills?.length > 0 && <SkillTags skills={seeker.skills} max={6} />}
                      </div>
                      <button
                        onClick={() => toggleUser(seeker._id)}
                        disabled={toggling === seeker._id}
                        className={`btn-ghost p-1.5 flex-shrink-0 ${seeker.isActive ? 'text-sage-600' : 'text-ink-400'}`}
                        title={seeker.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {seeker.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Pagination pagination={data.pagination} onPage={setPage} />
          </>
        )}
      </div>
    </Sidebar>
  );
}
