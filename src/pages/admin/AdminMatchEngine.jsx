import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, SkillTags, MatchScore, SectionLoader, EmptyState } from '../../components/common/UI';
import { adminApi, jobsApi } from '../../services/api';
import { Zap, Search, ChevronDown, Send, CheckCircle, MapPin, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMatchEngine() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [sending, setSending] = useState(null);
  const [sent, setSent] = useState(new Set());
  const [adminNote, setAdminNote] = useState('');
  const [search, setSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  useEffect(() => {
    jobsApi.getAll({ limit: 100 })
      .then(res => setJobs(res.data.data))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoadingJobs(false));
  }, []);

  const loadCandidates = async (job) => {
    setSelectedJob(job);
    setCandidates([]);
    setLoadingCandidates(true);
    try {
      const res = await adminApi.matchCandidates(job._id);
      setCandidates(res.data.data.candidates);
    } catch {
      toast.error('Failed to fetch candidates');
    } finally {
      setLoadingCandidates(false);
    }
  };

  const sendMatch = async (seekerId) => {
    setSending(seekerId);
    try {
      await adminApi.sendMatch({ seekerId, jobId: selectedJob._id, adminNote });
      setSent(prev => new Set([...prev, seekerId]));
      toast.success('Match sent to both seeker and recruiter! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send match');
    } finally {
      setSending(null);
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredCandidates = candidates.filter(({ seeker }) =>
    seeker.name?.toLowerCase().includes(search.toLowerCase()) ||
    seeker.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <PageHeader
          title="Match Engine"
          subtitle="Select a job, review matched candidates by score, and send matches."
          action={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
              <Zap size={13} /> Skill-based scoring active
            </div>
          }
        />

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Jobs column */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="px-4 py-3.5 border-b border-ink-100">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input pl-8 text-xs py-2"
                    placeholder="Search jobs..."
                    value={jobSearch}
                    onChange={e => setJobSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="divide-y divide-ink-50 max-h-[60vh] overflow-y-auto no-scrollbar">
                {loadingJobs ? (
                  <div className="p-8 flex justify-center"><div className="w-5 h-5 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" /></div>
                ) : filteredJobs.length === 0 ? (
                  <p className="px-4 py-8 text-ink-400 text-sm text-center">No active jobs found</p>
                ) : filteredJobs.map(job => (
                  <button
                    key={job._id}
                    onClick={() => loadCandidates(job)}
                    className={`w-full text-left px-4 py-4 hover:bg-ink-50 transition-colors
                      ${selectedJob?._id === job._id ? 'bg-ink-50 border-l-2 border-l-ink-900' : ''}`}
                  >
                    <p className="font-medium text-ink-900 text-sm truncate">{job.title}</p>
                    <p className="text-ink-500 text-xs mt-0.5">{job.companyName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-0.5 text-ink-400 text-xs"><MapPin size={10} />{job.location}</span>
                      <span className="text-ink-300">·</span>
                      <span className="text-ink-400 text-xs">{job.experienceRequired}+ yrs</span>
                    </div>
                    <div className="mt-1.5"><SkillTags skills={job.requiredSkills} max={3} /></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Candidates column */}
          <div className="lg:col-span-3">
            {!selectedJob ? (
              <div className="card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mb-4">
                  <Zap size={28} className="text-ink-400" />
                </div>
                <h3 className="font-display font-semibold text-ink-900 mb-1">Select a Job</h3>
                <p className="text-ink-500 text-sm">Choose a job from the left panel to see matched candidates ranked by score.</p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-ink-100 bg-ink-50/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-semibold text-ink-900">{selectedJob.title}</h3>
                      <p className="text-ink-500 text-xs mt-0.5">{selectedJob.companyName} · {selectedJob.location}</p>
                    </div>
                    <span className="badge badge-sage">{candidates.length} candidates</span>
                  </div>

                  {/* Admin note */}
                  <div className="mt-3">
                    <input
                      className="input text-xs py-2"
                      placeholder="Admin note (optional, sent with match notifications)..."
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                    />
                  </div>

                  {/* Candidate search */}
                  <div className="relative mt-2">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      className="input pl-8 text-xs py-2"
                      placeholder="Filter candidates by name or skill..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="divide-y divide-ink-50 max-h-[55vh] overflow-y-auto no-scrollbar">
                  {loadingCandidates ? (
                    <div className="p-10 flex justify-center"><div className="w-6 h-6 border-2 border-ink-200 border-t-ink-700 rounded-full animate-spin" /></div>
                  ) : filteredCandidates.length === 0 ? (
                    <EmptyState
                      icon={Briefcase}
                      title="No candidates found"
                      message={candidates.length === 0
                        ? "No matching seekers found. All may already be matched, or no seekers match this job's requirements."
                        : "No candidates match your search."}
                    />
                  ) : filteredCandidates.map(({ seeker, score, matchedSkills }) => (
                    <div key={seeker._id} className="px-5 py-4 hover:bg-ink-50/40 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <MatchScore score={score} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-ink-900 text-sm">{seeker.name}</p>
                              <span className="text-ink-400 text-xs font-mono">{seeker.experienceYears} yrs exp</span>
                            </div>
                            <p className="text-ink-500 text-xs">{seeker.email}</p>
                            {seeker.location && <p className="text-ink-400 text-xs flex items-center gap-0.5 mt-0.5"><MapPin size={10} />{seeker.location}</p>}

                            {matchedSkills.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-sage-700 font-medium mb-1">✓ Matched skills</p>
                                <SkillTags skills={matchedSkills} max={5} />
                              </div>
                            )}
                            {seeker.skills?.length > 0 && (
                              <div className="mt-1.5">
                                <p className="text-xs text-ink-400 mb-1">All skills</p>
                                <SkillTags skills={seeker.skills} max={4} />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {sent.has(seeker._id) ? (
                            <span className="flex items-center gap-1.5 text-sage-700 text-xs font-medium">
                              <CheckCircle size={14} /> Sent
                            </span>
                          ) : (
                            <button
                              onClick={() => sendMatch(seeker._id)}
                              disabled={sending === seeker._id}
                              className="btn-primary btn-sm"
                            >
                              {sending === seeker._id
                                ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                : <Send size={13} />}
                              Send Match
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
