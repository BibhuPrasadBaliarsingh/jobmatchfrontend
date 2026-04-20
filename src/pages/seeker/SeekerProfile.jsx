import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, InputField, SkillInput, Spinner } from '../../components/common/UI';
import { seekerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Phone, Briefcase, FileText, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const JOB_ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer', 'Mobile Developer', 'Data Analyst', 'QA Engineer', 'Security Engineer', 'ML Engineer', 'Watchman', 'Driver', 'Accountant', 'HR Manager', 'Sales Executive'];

export default function SeekerProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', location: '', bio: '',
    skills: [], experienceYears: 0, experienceDescription: '', preferredRoles: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experienceYears: user.experienceYears || 0,
        experienceDescription: user.experienceDescription || '',
        preferredRoles: user.preferredRoles || [],
      });
    }
  }, [user]);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const toggleRole = (role) => {
    setForm(p => ({
      ...p,
      preferredRoles: p.preferredRoles.includes(role)
        ? p.preferredRoles.filter(r => r !== role)
        : [...p.preferredRoles, role],
    }));
  };

  // Profile completeness
  const fields = ['name', 'phone', 'location', 'skills', 'experienceYears'];
  const filledFields = fields.filter(f => {
    const v = form[f];
    return Array.isArray(v) ? v.length > 0 : !!v || v === 0;
  });
  const completeness = Math.round((filledFields.length / fields.length) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await seekerApi.updateProfile(form);
      updateUser(res.data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PageHeader title="My Profile" subtitle="Keep your profile updated to get better matches." />

        {/* Completeness bar */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ink-700 flex items-center gap-1.5">
              <Star size={14} className="text-amber-500" /> Profile completeness
            </span>
            <span className={`font-mono text-sm font-bold ${completeness === 100 ? 'text-sage-600' : 'text-amber-600'}`}>
              {completeness}%
            </span>
          </div>
          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${completeness === 100 ? 'bg-sage-500' : 'bg-amber-500'}`}
              style={{ width: `${completeness}%` }}
            />
          </div>
          {completeness < 100 && (
            <p className="text-xs text-ink-400 mt-1.5">Add {fields.filter(f => {
              const v = form[f]; return !(Array.isArray(v) ? v.length > 0 : !!v || v === 0);
            }).join(', ')} to complete your profile.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 mb-5 flex items-center gap-2">
              <User size={18} /> Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" icon={User} value={form.name} onChange={set('name')} placeholder="Jane Smith" className="sm:col-span-2" />
              <InputField label="Phone" icon={Phone} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
              <InputField label="Location" icon={MapPin} value={form.location} onChange={set('location')} placeholder="Bangalore, India" />
              <div className="sm:col-span-2">
                <label className="label">Bio (optional)</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="A short bio about yourself..."
                  value={form.bio}
                  onChange={set('bio')}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 mb-5 flex items-center gap-2">
              <Briefcase size={18} /> Skills
            </h2>
            <label className="label">Your skills</label>
            <SkillInput skills={form.skills} onChange={skills => setForm(p => ({ ...p, skills }))} />
          </div>

          {/* Experience */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 mb-5 flex items-center gap-2">
              <FileText size={18} /> Experience
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  className="input"
                  value={form.experienceYears}
                  onChange={set('experienceYears')}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Describe your work experience, projects, achievements..."
                  value={form.experienceDescription}
                  onChange={set('experienceDescription')}
                />
              </div>
            </div>
          </div>

          {/* Preferred roles */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 mb-1 flex items-center gap-2">
              <Star size={18} /> Preferred Job Roles
            </h2>
            <p className="text-ink-500 text-xs mb-4">Select roles you're interested in.</p>
            <div className="flex flex-wrap gap-2">
              {JOB_ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${form.preferredRoles.includes(role)
                      ? 'bg-ink-900 text-white border-ink-900'
                      : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
            {loading ? <Spinner /> : 'Save Profile'}
          </button>
        </form>
      </div>
    </Sidebar>
  );
}
