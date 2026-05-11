import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, InputField, SkillInput, Spinner } from '../../components/common/UI';
import { seekerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Phone, Briefcase, FileText, Star, Upload, ExternalLink, Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const JOB_ROLES = [
  'Branding & Promotions',
  'Event Management',
  'IT & Software',
  'BPO',
  'Banking',
  'Insurance',
  'Finance',
  'NGO',
  'Sales',
  'Marketing',
  'Logistics',
  'Steel Plant Maintenance & Operations',
  'Hospital Industry',
  'Hospitality Industry',
  'Hotel Industry',
  'Security',
  'Labour',
  'Watchman',
  'Driver',
  'Accountant',
  'HR Manager',
  'Sales Executive',
];

export default function SeekerProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', location: '', bio: '',
    skills: [], experienceYears: 0, experienceDescription: '', preferredRoles: [],
  });
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

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

  const handleUploadResume = async () => {
    if (!resumeFile) return toast.error('Please choose a resume file first.');
    setUploadingResume(true);
    try {
      const dataBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || '');
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(resumeFile);
      });

      const res = await seekerApi.uploadResume({
        fileName: resumeFile.name,
        mimeType: resumeFile.type || (
          resumeFile.name?.toLowerCase?.().endsWith('.pdf') ? 'application/pdf'
            : resumeFile.name?.toLowerCase?.().endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : resumeFile.name?.toLowerCase?.().endsWith('.doc') ? 'application/msword'
                : ''
        ),
        dataBase64,
      });
      updateUser(res.data.data);
      setResumeFile(null);
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume upload failed');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSendWhatsApp = () => {
    const message = [
      'Hi, here is my full JobMatch profile data:',
      `Name: ${form.name || user?.name || 'N/A'}`,
      `Phone: ${form.phone || 'N/A'}`,
      `Location: ${form.location || 'N/A'}`,
      `Bio: ${form.bio || 'N/A'}`,
      `Skills: ${form.skills?.length ? form.skills.join(', ') : 'N/A'}`,
      `Experience Years: ${form.experienceYears ?? 'N/A'}`,
      `Experience Description: ${form.experienceDescription || 'N/A'}`,
      `Preferred Roles: ${form.preferredRoles?.length ? form.preferredRoles.join(', ') : 'N/A'}`,
      `Resume: ${user?.resumeUrl ? user.resumeUrl : 'Not uploaded'}`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/7655047671?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <PageHeader title="My Profile" subtitle="Keep your profile updated to get better matches." />

        {/* Completeness bar */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ink-700 dark:text-slate-200 flex items-center gap-1.5">
              <Star size={14} className="text-amber-500" /> Profile completeness
            </span>
            <span className={`font-mono text-sm font-bold ${completeness === 100 ? 'text-sage-600' : 'text-amber-600'}`}>
              {completeness}%
            </span>
          </div>
          <div className="h-2 bg-ink-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${completeness === 100 ? 'bg-sage-500' : 'bg-amber-500'}`}
              style={{ width: `${completeness}%` }}
            />
          </div>
          {completeness < 100 && (
            <p className="text-xs text-ink-400 dark:text-slate-400 mt-1.5">Add {fields.filter(f => {
              const v = form[f]; return !(Array.isArray(v) ? v.length > 0 : !!v || v === 0);
            }).join(', ')} to complete your profile.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <FileText size={18} /> Resume
            </h2>
            <p className="text-ink-500 dark:text-slate-300 text-xs mb-4">Upload a PDF/DOC/DOCX resume (max 5MB). It will be visible in the admin panel.</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-ink-600 dark:text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-ink-900 file:text-white hover:file:bg-ink-800"
              />
              <button
                type="button"
                onClick={handleUploadResume}
                disabled={uploadingResume || !resumeFile}
                className="btn-primary btn-sm inline-flex items-center justify-center gap-2"
              >
                {uploadingResume ? <Spinner /> : <><Upload size={14} /> Upload</>}
              </button>
              <button
                type="button"
                onClick={() => setResumeFile(null)}
                disabled={!resumeFile || uploadingResume}
                className="btn-secondary btn-sm inline-flex items-center justify-center gap-2"
                title="Clear selected file"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>

            {user?.resumeUrl && (
              <div className="mt-4 text-sm">
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sage-700 dark:text-sage-300 hover:text-sage-800 dark:hover:text-sage-200 font-medium"
                >
                  View current resume <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Basic info */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-5 flex items-center gap-2">
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
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-5 flex items-center gap-2">
              <Briefcase size={18} /> Skills
            </h2>
            <label className="label">Your skills</label>
            <SkillInput skills={form.skills} onChange={skills => setForm(p => ({ ...p, skills }))} />
          </div>

          {/* Experience */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-5 flex items-center gap-2">
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
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Star size={18} /> Preferred Job Roles
            </h2>
            <p className="text-ink-500 dark:text-slate-300 text-xs mb-4">Select roles you're interested in.</p>
            <div className="flex flex-wrap gap-2">
              {JOB_ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${form.preferredRoles.includes(role)
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                      : 'bg-white dark:bg-slate-900 text-ink-600 dark:text-slate-200 border-ink-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-400'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button type="submit" disabled={loading} className="btn-primary btn-lg flex-1 w-full sm:w-auto">
              {loading ? <Spinner /> : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-medium text-white transition-all duration-150 hover:bg-emerald-700 active:scale-95"
            >
              <Send size={16} /> Send to WhatsApp
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
