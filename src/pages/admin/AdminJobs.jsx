import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, SkillTags, StatusBadge, Pagination, SectionLoader, EmptyState } from '../../components/common/UI';
import { adminApi, jobsApi } from '../../services/api';
import { Briefcase, Search, MapPin, Trash2, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminJobs() {
  const navigate = useNavigate();
  const [data, setData] = useState({ jobs: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getJobs({ search, status: statusFilter, page, limit: 15 });
      setData({ jobs: res.data.data, pagination: res.data.pagination });
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await jobsApi.delete(id);
      toast.success('Job deleted.');
      load();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const JOB_TYPE_COLORS = { 'full-time': 'badge-sage', 'part-time': 'badge-amber', contract: 'badge-ink', internship: 'badge-coral', remote: 'badge-green' };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <PageHeader title="All Jobs" subtitle={`${data.pagination?.total || 0} total job postings`} />

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-10" placeholder="Search jobs..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="input w-36" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {loading ? <SectionLoader /> : data.jobs.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs found" message="No job postings match your filters." />
        ) : (
          <>
            <div className="card overflow-hidden mb-4">
              <div className="divide-y divide-ink-50">
                {data.jobs.map(job => (
                  <div key={job._id} className="px-6 py-4 hover:bg-ink-50/40 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-medium text-ink-900">{job.title}</h3>
                          <StatusBadge status={job.status} />
                          <span className={`badge ${JOB_TYPE_COLORS[job.jobType] || 'badge-ink'}`}>{job.jobType}</span>
                        </div>
                        <p className="text-ink-600 text-sm">{job.companyName}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-ink-500 mt-1 mb-2">
                          <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                          <span>{job.experienceRequired}+ yrs</span>
                          <span>By: {job.recruiter?.name}</span>
                          <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>
                        <SkillTags skills={job.requiredSkills} max={5} />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => navigate(`/admin/match-engine`)}
                          className="btn-ghost p-1.5 text-sage-600"
                          title="Match candidates for this job"
                        >
                          <LinkIcon size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          disabled={deleting === job._id}
                          className="btn-ghost p-1.5 text-coral-500 hover:bg-coral-50"
                          title="Delete job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
