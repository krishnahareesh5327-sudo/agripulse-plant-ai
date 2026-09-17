import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { CropHealthScore } from '../types';

interface HealthGaugeProps {
  data: CropHealthScore;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const score = Math.max(0, Math.min(100, data.score));

  // Circular gauge parameters
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // emerald-500
  let textColor = 'text-emerald-700';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (score < 40) {
    strokeColor = '#f43f5e'; // rose-500
    textColor = 'text-rose-700';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (score < 70) {
    strokeColor = '#f59e0b'; // amber-500
    textColor = 'text-amber-700';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  const breakdown = data.breakdown || {
    foliar_condition: score,
    moisture_stability: 100,
    thermal_comfort: 100,
    humidity_balance: 100,
    nutrient_ph: 100
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Crop Health Score</h3>
            <p className="text-xs text-slate-500">AI-assisted multi-factor health index</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          {data.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around py-4">
        {/* SVG Radial Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-44 h-44 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Value stroke */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={strokeColor}
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold tracking-tight ${textColor}`}>
              {score}
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              out of 100
            </span>
          </div>
        </div>

        {/* Quick factors list */}
        <div className="mt-4 sm:mt-0 w-full sm:w-1/2 space-y-2.5 pl-0 sm:pl-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">Foliar Condition</span>
              <span className="text-slate-900 font-semibold">{breakdown.foliar_condition}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${breakdown.foliar_condition}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">Root Moisture Stability</span>
              <span className="text-slate-900 font-semibold">{breakdown.moisture_stability}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${breakdown.moisture_stability}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">Microclimate Balance</span>
              <span className="text-slate-900 font-semibold">{breakdown.thermal_comfort}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${breakdown.thermal_comfort}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-700 transition"
      >
        <span className="flex items-center space-x-1">
          <Activity className="w-3.5 h-3.5 text-slate-400" />
          <span>{expanded ? 'Hide Factor Breakdown' : 'View Full Parameter Weighting'}</span>
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
          <div className="flex justify-between text-slate-600">
            <span>Leaf Pathogen Impact:</span>
            <span className="font-semibold text-slate-900">{breakdown.foliar_condition}/100</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Soil Moisture Stress:</span>
            <span className="font-semibold text-slate-900">{breakdown.moisture_stability}/100</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Thermal Comfort Index:</span>
            <span className="font-semibold text-slate-900">{breakdown.thermal_comfort}/100</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Vapor Pressure / Humidity Comfort:</span>
            <span className="font-semibold text-slate-900">{breakdown.humidity_balance}/100</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Soil pH Nutrient Availability:</span>
            <span className="font-semibold text-slate-900">{breakdown.nutrient_ph}/100</span>
          </div>
          <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200">
            {data.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};
