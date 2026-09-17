import React from 'react';

interface StatusBadgeProps {
  type: 'health' | 'risk' | 'confidence' | 'sensor';
  value: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, className = '' }) => {
  const v = (value || '').toLowerCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';

  if (type === 'health') {
    if (v.includes('healthy') || v.includes('robust')) {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (v.includes('managed') || v.includes('mild')) {
      bg = 'bg-lime-50 text-lime-700 border-lime-200';
    } else if (v.includes('compromised') || v.includes('moderate')) {
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
    }
  } else if (type === 'risk') {
    if (v.includes('low')) {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (v.includes('moderate')) {
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (v.includes('high') || v.includes('severe')) {
      bg = 'bg-orange-50 text-orange-700 border-orange-200';
    } else if (v.includes('critical')) {
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
    }
  } else if (type === 'confidence') {
    if (v === 'high') {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (v === 'moderate') {
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
    }
  } else if (type === 'sensor') {
    if (v === 'optimal') {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (v === 'suitable') {
      bg = 'bg-teal-50 text-teal-700 border-teal-200';
    } else if (v === 'warning') {
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (v === 'critical') {
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {value}
    </span>
  );
};
