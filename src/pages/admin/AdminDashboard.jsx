import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { StatCard, PageHeader, SectionLoader } from '../../components/common/UI';
import { adminApi } from '../../services/api';
import { Users, Briefcase, Zap, TrendingUp, UserCheck, Clock, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Platform overview and matching control center"
          action={
            <Link to="/admin/match-engine" className="btn-primary btn-sm">
              <Zap size={14} /> Match Engine
            </Link>
          }
        />

        {loading ? <SectionLoader /> : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users} label="Job Seekers" value={data?.stats?.totalSeekers || 0} color="sage" />
              <StatCard icon={Building2} label="Recruiters" value={data?.stats?.totalRecruiters || 0} color="amber" />
              <StatCard icon={Briefcase} label="Active Jobs" value={data?.stats?.totalJobs || 0} color="ink" />
              <StatCard icon={Zap} label="Total Matches" value={data?.stats?.totalMatches || 0} color="coral" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard icon={TrendingUp} label="Avg Match Score" value={`${data?.stats?.avgMatchScore || 0}%`} color="sage" />
              <StatCard icon={UserCheck} label="Hired" value={data?.stats?.hiredCount || 0} color="sage" />
              <StatCard icon={Clock} label="Pending Matches" value={data?.stats?.pendingMatches || 0} color="amber" />
            </div>

            {/* Quick actions */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { to: '/admin/match-engine', icon: Zap, label: 'Run Match Engine', desc: 'Match seekers to jobs', color: 'bg-ink-900 text-white hover:bg-ink-800' },
                { to: '/admin/seekers', icon: Users, label: 'Manage Seekers', desc: `${data?.stats?.totalSeekers} registered`, color: 'card hover:shadow-hover' },
                { to: '/admin/jobs', icon: Briefcase, label: 'Manage Jobs', desc: `${data?.stats?.totalJobs} active`, color: 'card hover:shadow-hover' },
              ].map(({ to, icon: Icon, label, desc, color }) => (
                <Link key={to} to={to} className={`${color} rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 border border-transparent`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color.includes('ink-900') ? 'bg-white/15' : 'bg-ink-100'}`}>
                    <Icon size={20} className={color.includes('ink-900') ? 'text-white' : 'text-ink-600'} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${color.includes('ink-900') ? 'text-white' : 'text-ink-900'}`}>{label}</p>
                    <p className={`text-xs ${color.includes('ink-900') ? 'text-white/60' : 'text-ink-500'}`}>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent users */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
                  <h2 className="font-display font-semibold text-ink-900 text-sm">Recent Users</h2>
                  <Link to="/admin/seekers" className="text-xs text-sage-600 hover:text-sage-700 font-medium">View all →</Link>
                </div>
                <div className="divide-y divide-ink-50">
                  {data?.recentUsers?.length === 0
                    ? <p className="px-5 py-8 text-ink-400 text-sm text-center">No users yet</p>
                    : data?.recentUsers?.map(u => (
                      <div key={u._id} className="px-5 py-3.5 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-ink-900 text-sm">{u.name}</p>
                          <p className="text-ink-400 text-xs">{u.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${u.role === 'seeker' ? 'badge-sage' : 'badge-amber'}`}>{u.role}</span>
                          <p className="text-ink-400 text-xs mt-1">{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recent jobs */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
                  <h2 className="font-display font-semibold text-ink-900 text-sm">Recent Jobs</h2>
                  <Link to="/admin/jobs" className="text-xs text-sage-600 hover:text-sage-700 font-medium">View all →</Link>
                </div>
                <div className="divide-y divide-ink-50">
                  {data?.recentJobs?.length === 0
                    ? <p className="px-5 py-8 text-ink-400 text-sm text-center">No jobs yet</p>
                    : data?.recentJobs?.map(j => (
                      <div key={j._id} className="px-5 py-3.5 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-ink-900 text-sm">{j.title}</p>
                          <p className="text-ink-400 text-xs">{j.recruiter?.name}</p>
                        </div>
                        <p className="text-ink-400 text-xs">{formatDistanceToNow(new Date(j.createdAt), { addSuffix: true })}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Sidebar>
  );
}
