import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Phone, MapPin, Briefcase, Building2 } from 'lucide-react';
import { InputField, Spinner } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultRole = params.get('role') || 'seeker';

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: defaultRole, phone: '', location: '', companyName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (form.role === 'recruiter' && !form.companyName.trim()) e.companyName = 'Company name is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created! Welcome aboard 🎉');
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">JM</span>
            </div>
            <span className="font-display font-bold text-ink-900 text-lg">JobMatch</span>
          </Link>
          <h2 className="font-display text-3xl font-bold text-ink-900">Create an account</h2>
          <p className="text-ink-500 text-sm mt-1">Join the platform that matches talent with opportunity.</p>
        </div>

        {/* Role toggle */}
        <div className="card p-1 flex mb-6">
          {['seeker', 'recruiter'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm(p => ({ ...p, role: r }))}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
                ${form.role === r ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-500 hover:text-ink-800'}`}
            >
              {r === 'seeker' ? <User size={15} /> : <Building2 size={15} />}
              {r === 'seeker' ? 'Job Seeker' : 'Recruiter'}
            </button>
          ))}
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Full name"
                icon={User}
                placeholder="Jane Smith"
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                className="col-span-2"
              />
              <InputField
                label="Email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                error={errors.email}
                className="col-span-2"
              />
              <InputField
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={set('password')}
                error={errors.password}
              />
              <InputField
                label="Confirm password"
                type="password"
                icon={Lock}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                error={errors.confirmPassword}
              />
              <InputField
                label="Phone (optional)"
                icon={Phone}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set('phone')}
              />
              <InputField
                label="Location (optional)"
                icon={MapPin}
                placeholder="Bangalore, India"
                value={form.location}
                onChange={set('location')}
              />
              {form.role === 'recruiter' && (
                <InputField
                  label="Company name"
                  icon={Briefcase}
                  placeholder="Acme Corp"
                  value={form.companyName}
                  onChange={set('companyName')}
                  error={errors.companyName}
                  className="col-span-2"
                />
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg mt-2">
              {loading ? <Spinner /> : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-600 font-medium hover:text-sage-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
