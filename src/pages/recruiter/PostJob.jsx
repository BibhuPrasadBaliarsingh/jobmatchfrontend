import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, InputField, SkillInput, Spinner } from '../../components/common/UI';
import { jobsApi } from '../../services/api';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: [], experienceRequired: 0,
    location: '', jobType: 'full-time', companyName: '',
    salaryRange: { min: '', max: '', currency: 'INR' },
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const setSalary = k => e => setForm(p => ({ ...p, salaryRange: { ...p.salaryRange, [k]: e.target.value } }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.requiredSkills.length === 0) e.requiredSkills = 'Add at least one skill';
    if (!form.location.trim()) e.location = 'Location is required';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await jobsApi.create(form);
      toast.success('Job posted successfully! 🎉');
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <PageHeader title="Post a Job" subtitle="Fill in the details to attract the right candidates." />
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic info */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-5 flex items-center gap-2"><Briefcase size={18} /> Job Details</h2>
            <div className="space-y-4">
              <InputField label="Job Title" value={form.title} onChange={set('title')} placeholder="e.g. Senior React Developer" error={errors.title} />
              <InputField label="Company Name (optional)" value={form.companyName} onChange={set('companyName')} placeholder="Leave blank to use your profile name" />
              <div>
                <label className="label">Description *</label>
                <textarea
                  className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                  rows={5}
                  placeholder="Describe the role, responsibilities, what you're looking for..."
                  value={form.description}
                  onChange={set('description')}
                />
                {errors.description && <p className="text-coral-600 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Skills & Requirements */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-5 flex items-center gap-2"><Clock size={18} /> Requirements</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Required Skills *</label>
                <SkillInput
                  skills={form.requiredSkills}
                  onChange={s => setForm(p => ({ ...p, requiredSkills: s }))}
                  placeholder="e.g. React, Node.js — press Enter"
                />
                {errors.requiredSkills && <p className="text-coral-600 text-xs mt-1">{errors.requiredSkills}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Experience Required (years)</label>
                  <input type="number" min="0" max="30" className="input" value={form.experienceRequired} onChange={set('experienceRequired')} />
                </div>
                <div>
                  <label className="label">Job Type</label>
                  <select className="input" value={form.jobType} onChange={set('jobType')}>
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <InputField label="Location *" icon={MapPin} value={form.location} onChange={set('location')} placeholder="e.g. Bangalore, India or Remote" error={errors.location} />
            </div>
          </div>

          {/* Salary */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-5 flex items-center gap-2"><DollarSign size={18} /> Salary Range (optional)</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Currency</label>
                <select className="input" value={form.salaryRange.currency} onChange={setSalary('currency')}>
                  {['INR', 'USD', 'EUR', 'GBP'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <InputField label="Min (₹/yr)" type="number" value={form.salaryRange.min} onChange={setSalary('min')} placeholder="400000" />
              <InputField label="Max (₹/yr)" type="number" value={form.salaryRange.max} onChange={setSalary('max')} placeholder="800000" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/recruiter/dashboard')}
              className="btn-secondary btn-lg flex-1"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary btn-lg flex-1">
              {loading ? <Spinner /> : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
