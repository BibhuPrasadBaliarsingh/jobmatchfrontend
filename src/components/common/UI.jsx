import React from 'react';
import { Loader2, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

// ─── Spinner ─────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 18, className = '' }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} />
);

// ─── Page Header ─────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-8">
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-slate-100">{title}</h1>
      {subtitle && <p className="text-ink-500 dark:text-slate-300 text-sm mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ icon: Icon, label, value, color = 'sage', trend }) => {
  const colors = {
    sage: 'bg-sage-50 text-sage-600',
    amber: 'bg-amber-50 text-amber-600',
    coral: 'bg-coral-50 text-coral-600',
    ink: 'bg-ink-100 text-ink-600',
  };
  return (
    <div className="stat-card">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-ink-500 dark:text-slate-300 text-xs font-medium mb-0.5">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-900 dark:text-slate-100">{value}</p>
        {trend && <p className="text-xs text-ink-400 dark:text-slate-400 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
};

// ─── Match Score Ring ─────────────────────────────────────────────────────────
export const MatchScore = ({ score }) => {
  const color =
    score >= 70 ? 'border-sage-500 text-sage-700 bg-sage-50'
    : score >= 40 ? 'border-amber-500 text-amber-700 bg-amber-50'
    : 'border-coral-400 text-coral-700 bg-coral-50';
  return (
    <div className={`score-ring ${color}`}>
      {score}%
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    pending: { cls: 'badge-amber', icon: Clock, label: 'Pending' },
    accepted: { cls: 'badge-green', icon: CheckCircle, label: 'Accepted' },
    rejected: { cls: 'badge-coral', icon: XCircle, label: 'Declined' },
    hired: { cls: 'badge-sage', icon: CheckCircle, label: 'Hired' },
    active: { cls: 'badge-sage', icon: CheckCircle, label: 'Active' },
    closed: { cls: 'badge-ink', icon: XCircle, label: 'Closed' },
  };
  const { cls, icon: Icon, label } = map[status] || { cls: 'badge-ink', icon: AlertCircle, label: status };
  return (
    <span className={cls + ' badge'}>
      <Icon size={11} />
      {label}
    </span>
  );
};

// ─── Skill Tags ───────────────────────────────────────────────────────────────
export const SkillTags = ({ skills = [], max = 6 }) => {
  const shown = skills.slice(0, max);
  const rest = skills.length - max;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((s) => (
        <span key={s} className="skill-tag">{s}</span>
      ))}
      {rest > 0 && <span className="skill-tag text-ink-500 bg-ink-50 border-ink-200">+{rest}</span>}
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="empty-state dark:text-slate-200">
    <div className="w-14 h-14 bg-ink-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
      <Icon size={24} className="text-ink-400 dark:text-slate-400" />
    </div>
    <h3 className="font-display font-semibold text-ink-900 dark:text-slate-100 text-lg mb-1">{title}</h3>
    <p className="text-ink-500 dark:text-slate-300 text-sm max-w-xs">{message}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
export const InputField = ({ label, error, icon: Icon, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <input
        className={`input ${Icon ? 'pl-9' : ''} ${error ? 'input-error' : ''}`}
        {...props}
      />
    </div>
    {error && <p className="text-coral-600 text-xs mt-1">{error}</p>}
  </div>
);

// ─── Skill Input ──────────────────────────────────────────────────────────────
export const SkillInput = ({ skills = [], onChange, placeholder = 'Type a skill and press Enter' }) => {
  const [input, setInput] = React.useState('');

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const skill = input.trim().replace(/,$/, '');
      if (skill && !skills.includes(skill)) {
        onChange([...skills, skill]);
      }
      setInput('');
    }
  };

  const removeSkill = (s) => onChange(skills.filter((sk) => sk !== s));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {skills.map((s) => (
          <span key={s} className="skill-tag cursor-pointer group" onClick={() => removeSkill(s)}>
            {s}
            <span className="group-hover:text-coral-600 ml-0.5">×</span>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addSkill}
        placeholder={placeholder}
      />
      <p className="text-ink-400 text-xs mt-1">Press Enter or comma to add</p>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const Pagination = ({ pagination, onPage }) => {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="btn-secondary btn-sm disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-sm text-ink-500 font-mono">
        {page} / {pages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        className="btn-secondary btn-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

// ─── Card wrapper ─────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = false }) => (
  <div className={`${hover ? 'card-hover' : 'card'} ${className}`}>
    {children}
  </div>
);

// ─── Section loading ──────────────────────────────────────────────────────────
export const SectionLoader = () => (
  <div className="flex items-center justify-center py-16">
    <Spinner size={24} className="text-ink-400" />
  </div>
);
