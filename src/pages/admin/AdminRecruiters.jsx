import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, Pagination, SectionLoader, EmptyState } from '../../components/common/UI';
import { adminApi } from '../../services/api';
import { Building2, Search, Mail, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminRecruiters() {
  const [data, setData] = useState({ recruiters: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getRecruiters({ search, page, limit: 15 });
      setData({ recruiters: res.data.data, pagination: res.data.pagination });
    } catch { toast.error('Failed to load recruiters'); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const toggleUser = async (id) => {
    setToggling(id);
    try {
      await adminApi.toggleUser(id);
      toast.success('Status updated.');
      load();
    } catch { toast.error('Failed'); }
    finally { setToggling(null); }
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <PageHeader title="Recruiters" subtitle={`${data.pagination?.total || 0} registered recruiters`} />
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-10" placeholder="Search by name, email, or company..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>

        {loading ? <SectionLoader /> : data.recruiters.length === 0 ? (
          <EmptyState icon={Building2} title="No recruiters yet" message="No companies have registered yet." />
        ) : (
          <>
            <div className="card overflow-hidden mb-4">
              <div className="divide-y divide-ink-50">
                {data.recruiters.map(r => (
                  <div key={r._id} className="px-6 py-4 hover:bg-ink-50/40 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-medium text-ink-900">{r.companyName || r.name}</h3>
                          {!r.isActive && <span className="badge badge-coral">Deactivated</span>}
                        </div>
                        <p className="text-ink-600 text-sm">{r.name}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-ink-500 mt-1">
                          <span className="flex items-center gap-1"><Mail size={11} />{r.email}</span>
                          {r.location && <span className="flex items-center gap-1"><MapPin size={11} />{r.location}</span>}
                          <span>Joined {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</span>
                        </div>
                        {r.companyDescription && (
                          <p className="text-ink-400 text-xs mt-1.5 line-clamp-1">{r.companyDescription}</p>
                        )}
                      </div>
                      <button onClick={() => toggleUser(r._id)} disabled={toggling === r._id}
                        className={`btn-ghost p-1.5 flex-shrink-0 ${r.isActive ? 'text-sage-600' : 'text-ink-400'}`}>
                        {r.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
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
