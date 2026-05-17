import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Phone, MapPin, Briefcase } from 'lucide-react';
import { InputField, Spinner } from '../../components/common/UI';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', password: '', confirmPassword: '',
    role: 'seeker', phone: '', location: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.PNG');

  useEffect(() => {
    const getLogo = () => (document.documentElement.classList.contains('dark') ? '/logodrak.PNG' : '/logo.png');
    setLogoSrc(getLogo());

    const handleThemeChange = (event) => {
      setLogoSrc(event.detail === 'dark' ? '/logodrak.PNG' : '/logo.png');
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const isValidPhone = (phone) => {
    const normalized = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(normalized) && !/(.)\1\1/.test(normalized);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone || !form.phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (!isValidPhone(form.phone)) {
      e.phone = 'Enter a valid 10-digit number starting with 6-9 and no three repeated digits';
    }
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
    <div className="min-h-screen bg-ink-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-slide-up bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-soft">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-15 h-15 rounded-lg flex items-center justify-center ">
              <img src={logoSrc} alt="Super Deals" className="h-11 w-11 object-cover" />
            </div>
            <span className="font-display font-bold text-slate-950 dark:text-slate-100 text-lg">Super Deals Staffing</span>
          </Link>
          <h2 className="font-display text-3xl font-bold text-slate-950 dark:text-slate-100">Create an account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join the platform that matches talent with opportunity.</p>
        </div>

        {/* Role toggle */}
        <div className="card p-1 flex mb-6">
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all bg-ink-900 text-white shadow-sm">
              <User size={15} /> Job Seeker
            </div>
          </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <InputField
                label="Full name"
                icon={User}
                placeholder="Jane Smith"
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                className="col-span-1"
              />

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
                inputMode="numeric"
                maxLength={10}
              />

              <InputField
                label="Enter password"
                type="password"
                icon={Lock}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={set('password')}
                error={errors.password}
              />

              <InputField
                label="Re-enter password"
                type="password"
                icon={Lock}
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                error={errors.confirmPassword}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg mt-2">
              {loading ? <Spinner /> : 'Create profile'}
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
