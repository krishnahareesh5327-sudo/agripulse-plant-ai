import React from 'react';
import { Target, Info } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number;
  level: 'High' | 'Moderate' | 'Low';
  description: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  level,
  description
}) => {
  let barColor = 'bg-emerald-500';
  let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (level === 'Moderate') {
    barColor = 'bg-amber-500';
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (level === 'Low') {
    barColor = 'bg-rose-500';
    badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Model Confidence</h4>
            <p className="text-xs text-slate-500">Certainty bounds (not medical guarantee)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-slate-900">{confidence}%</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Progress Bar with Tier Threshold markers */}
      <div className="relative w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-800 ${barColor}`}
          style={{ width: `${confidence}%` }}
        ></div>
        {/* Tier Tick at 60% */}
        <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-white/70"></div>
        {/* Tier Tick at 85% */}
        <div className="absolute top-0 bottom-0 left-[85%] w-0.5 bg-white/70"></div>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5 mb-2.5">
        <span>0%</span>
        <span className="pl-4">60% Moderate</span>
        <span>85% High</span>
        <span>100%</span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        {description}
      </p>

      {level === 'Low' && (
        <div className="mt-2.5 flex items-start space-x-2 p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-rose-800 text-xs">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>
            <strong>Result Uncertain:</strong> Confidence falls below 60%. We recommend capturing another image with improved lighting and focus before undertaking costly crop treatments.
          </span>
        </div>
      )}
    </div>
  );
};
