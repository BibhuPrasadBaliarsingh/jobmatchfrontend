import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Phone, Lock, Eye, EyeOff, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { InputField, Spinner } from '../../components/common/UI';
import toast from 'react-hot-toast';

function JobPreviewCard({ job }) {
  if (!job) return null;
  return (
    <div className="rounded-[2rem] border border-white/20 bg-white/5 p-6 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.3em] text-sage-200">Job Preview</p>
        <h3 className="mt-3 text-2xl font-semibold text-white">{job.title}</h3>
        <p className="text-sm text-slate-200/80">{job.companyName}</p>
      </div>
      <div className="space-y-3 text-sm text-slate-200/80">
        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          <span>{job.jobType || 'Role type not set'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{job.location || 'Location not set'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{job.experienceRequired !== undefined ? `${job.experienceRequired}+ yrs experience` : 'Experience not specified'}</span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          View details
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const jobPreview = location.state?.jobPreview;
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidPhone = (phone) => {
    const normalized = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(normalized) && !/(.)\1\1/.test(normalized);
  };

  const validate = () => {
    const e = {};
    if (!form.phone || !form.phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (!isValidPhone(form.phone)) {
      e.phone = 'Enter a valid 10-digit number starting with 6-9 and no three repeated digits';
    }
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      console.debug('[Login] submitting', { phone: form.phone, password: form.password ? '***' : '' });
      const user = await login({ phone: form.phone, password: form.password });
      console.debug('[Login] login returned user', user);
      console.debug('[Login] localStorage token after login', localStorage.getItem('jm_token'));
      toast.success(`Welcome back, ${user.name}!`);
      const destination = location.state?.from
        || (user.role === 'seeker' && user.phone && user.location ? '/seeker/profile' : `/${user.role}/dashboard`);
      navigate(destination);
    } catch (err) {
      console.error('[Login] error', err.response?.data || err.message || err);
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-ink-900 dark:bg-slate-950 p-12 relative overflow-hidden">

  {/* Top Logo */}
  <div className="relative z-10">
    <Link to="/" className="flex items-center gap-2.5">
      <div className="w-15 h-15  rounded-xl flex items-center justify-center">
        <img src="/logodrak.PNG" alt="Super Deals" className="h-11 w-11 object-cover" />
      </div>
      <span className="text-white font-display font-bold text-xl">
        Super Deals Staffing
      </span>
    </Link>
  </div>

  {jobPreview && (
    <div className="relative z-10 mt-8">
      <JobPreviewCard job={jobPreview} />
    </div>
  )}

  {/* 🔥 CENTER IMAGE (ADD THIS) */}
  <div className="relative z-10 flex justify-center items-center my-10">
    <img
      src="/job-match.png"
      alt="Job Matching Illustration"
      className="w-100 h-auto object-contain drop-shadow-2xl hover:scale-105 transition duration-300 rounded-lg"
    />
  </div>

  {/* Bottom Quote */}
  <div className="relative z-10">
    <blockquote className="text-white/80 text-lg leading-relaxed font-light italic mb-4">
      "The right opportunity doesn't always find you — we make sure it does."
    </blockquote>
    <p className="text-white/40 text-sm">
      — Super Deals Staffing Platform
    </p>
  </div>

  {/* Decorative */}
  <div className="absolute top-0 right-0 w-80 h-80 bg-sage-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
  <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
</div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-900">
        <div className="w-full max-w-sm animate-slide-up rounded-[2rem] bg-white dark:bg-slate-950 p-8 shadow-soft">
          {/* Mobile / tablet logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3 rounded-3xl bg-slate-100/90 px-4 py-3 shadow-sm transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700">
              <img src="/logo.png" alt="Super Deals Staffing" className="h-12 w-12 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Super Deals Staffing</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Staffing & hiring platform</p>
              </div>
            </Link>
          </div>

          <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-slate-100 mb-1">Log in</h2>
          <p className="text-ink-500 dark:text-slate-400 text-sm mb-8">Welcome back .</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Phone number"
              icon={Phone}
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setForm((p) => ({ ...p, phone: digits }));
              }}
              error={errors.phone}
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
            />
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-coral-600 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg mt-2">
              {loading ? <Spinner /> : 'Log in'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sage-600 font-medium hover:text-sage-700">
              Create one
            </Link>
          </p>

          {/* Admin hint */}
          <div className="mt-6 p-3.5 bg-ink-100 rounded-xl border border-ink-200">
            <p className="text-xs text-ink-500 font-medium mb-1">Admin access</p>
            <p className="text-xs text-ink-400 font-mono">7655047671 / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
