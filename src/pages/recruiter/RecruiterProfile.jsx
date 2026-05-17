import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { PageHeader, InputField, Spinner } from '../../components/common/UI';
import { recruiterApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Building2, MapPin, Phone, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', location: '', companyName: '', companyDescription: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({
      name: user.name || '',
      phone: user.phone || '',
      location: user.location || '',
      companyName: user.companyName || '',
      companyDescription: user.companyDescription || '',
    });
  }, [user]);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSaveAndSendWhatsApp = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await recruiterApi.updateProfile(form);
      updateUser(res.data.data);
      toast.success('Company profile updated!');
      handleSendWhatsApp(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (profileDataprofileData) => {
    const profile = profileData || form;
    const message = [
      'Hi, here is our full JobMatch company profile data:',
      `Contact Name: ${profile.name || user?.name || 'N/A'}`,
      `Company Name: ${profile.companyName || 'N/A'}`,
      `Phone: ${profile.phone || 'N/A'}`,
      `Location: ${profile.location || 'N/A'}`,
      `Company Description: ${profile.companyDescription || 'N/A'}`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/7655047671?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        <PageHeader title="Company Profile" subtitle="Keep your company information updated for better candidate matching." />
        <form onSubmit={handleSaveAndSendWhatsApp} className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-900 dark:text-slate-100 mb-5 flex items-center gap-2"><Building2 size={18} /> Company Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Contact Name" value={form.name} onChange={set('name')} placeholder="Your name" className="sm:col-span-2" />
              <InputField label="Company Name" icon={Building2} value={form.companyName} onChange={set('companyName')} placeholder="Acme Corp" className="sm:col-span-2" />
              <InputField label="Phone" icon={Phone} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
              <InputField label="Location" icon={MapPin} value={form.location} onChange={set('location')} placeholder="Mumbai, India" />
              <div className="sm:col-span-2">
                <label className="label flex items-center gap-1.5"><FileText size={13} /> Company Description</label>
                <textarea className="input resize-none" rows={4} placeholder="Tell candidates about your company, culture, and what makes you a great place to work..." value={form.companyDescription} onChange={set('companyDescription')} />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-3.5 text-base font-medium text-white transition-all duration-150 hover:bg-amber-600 active:scale-95 w-full sm:w-auto">
              {loading ? <Spinner /> : <><Send size={16} /> Save & Send to WhatsApp</>}
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
