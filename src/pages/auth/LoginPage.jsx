import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { InputField, Spinner } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 bg-ink-900 p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">SDS</span>
            </div>
            <span className="text-white font-display font-bold text-xl">Super Deals Staffing</span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white/80 text-lg leading-relaxed font-light italic mb-4">
            "The right opportunity doesn't always find you — we make sure it does."
          </blockquote>
          <p className="text-white/40 text-sm">— Super Deals Staffing Platform</p>
        </div>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sage-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">JM</span>
              </div>
              <span className="font-display font-bold text-ink-900 text-lg">Super Deals Staffing</span>
            </Link>
          </div>

          <h2 className="font-display text-3xl font-bold text-ink-900 mb-1">Sign in</h2>
          <p className="text-ink-500 text-sm mb-8">Welcome back — let's pick up where you left off.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              error={errors.email}
              autoComplete="email"
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
              {loading ? <Spinner /> : 'Sign in'}
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
            <p className="text-xs text-ink-400 font-mono">admin@jobmatch.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
