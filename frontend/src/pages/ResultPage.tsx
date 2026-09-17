import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  Cpu,
  Droplets,
  Thermometer,
  Wind,
  Gauge,
  Sun,
  CloudRain,
  Activity,
  ArrowLeft,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { AnalysisResponse } from '../types';
import { HealthGauge } from '../components/HealthGauge';
import { ConfidenceMeter } from '../components/ConfidenceMeter';
import { SensorCard } from '../components/SensorCard';
import { StatusBadge } from '../components/StatusBadge';

interface ResultPageProps {
  result: AnalysisResponse;
  onScanAgain: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onScanAgain }) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const p = result.prediction;
  const health = result.health_score;
  const recs = result.recommendations;
  const sensors = result.evaluated_sensors || {};
  const compound = result.compound_risk;

  if (!p) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500">No result data available.</p>
        <button
          onClick={onScanAgain}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Scan a Plant
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-28">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onScanAgain}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Plant</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 1. TOP SECTION: PRIMARY DIAGNOSIS (Hierarchy #1) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <img
            src={result.image_url || result.thumbnail_url}
            alt={p.crop}
            className="w-full lg:w-48 h-48 rounded-2xl object-cover border border-slate-200 shrink-0"
          />

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Plant: {p.crop}
              </span>
              <StatusBadge
                type="health"
                value={p.is_healthy ? 'Likely Healthy' : 'Likely Diseased'}
              />
              <StatusBadge type="risk" value={`Severity: ${p.severity}`} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {p.condition}
              </h1>
              <p className="text-xs italic text-slate-500 mt-0.5">
                Pathogen: {p.scientific_name} ({p.pathogen_type})
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {p.description}
            </p>
          </div>
        </div>
      </div>

      {/* 2 & 3. CONFIDENCE & CROP HEALTH SCORE (Hierarchy #2 & #3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceMeter
          confidence={p.confidence}
          level={p.confidence_level}
          description={p.confidence_description}
        />

        {health && <HealthGauge data={health} />}
      </div>

      {/* 4. WHAT SHOULD I DO NOW? RECOMMENDATIONS (Hierarchy #4) */}
      {recs && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Recommended Action Plan
            </h2>
            <p className="text-xs text-slate-500">
              Field-tested agronomic intervention strategy customized to this condition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Immediate Action */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
              <div className="flex items-center space-x-2 text-rose-800">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {recs.immediate_action.title}
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-rose-950">
                {recs.immediate_action.steps.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-bold shrink-0">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Field / Crop Management */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {recs.crop_management.title}
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950">
                {recs.crop_management.steps.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-bold shrink-0">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Environmental Adjustments */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
              <div className="flex items-center space-x-2 text-blue-800">
                <Droplets className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {recs.environmental_adjustment.title}
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-blue-950">
                {recs.environmental_adjustment.steps.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-bold shrink-0">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 7-Day Monitoring Routine */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
              <div className="flex items-center space-x-2 text-purple-800">
                <Calendar className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {recs.monitoring_protocol.title}
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-purple-950">
                {recs.monitoring_protocol.steps.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="font-bold shrink-0">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Treatment & Responsible Chemical Advisory */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Organic & Approved Chemical Treatment Protocols
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-semibold text-emerald-800 block mb-1">
                  Biological & Organic Interventions:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {recs.treatments.organic.map((org, i) => (
                    <li key={i}>{org}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block mb-1">
                  Synthetic Fungicides / Bactericides:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {recs.treatments.chemical.map((chem, i) => (
                    <li key={i}>{chem}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-start space-x-2 text-[11px] text-slate-500 italic">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{recs.treatments.safety_disclaimer}</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. ENVIRONMENTAL TELEMETRY & COMPOUND RISK (Hierarchy #5) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Environmental Telemetry & Compounding Risk
          </h2>
          <p className="text-xs text-slate-500">
            Correlating ambient microclimate with foliar disease virulence
          </p>
        </div>

        {/* Compound Risk Banner */}
        {compound && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Microclimate Virulence Correlation
              </span>
              <StatusBadge type="risk" value={compound.risk_level} />
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {compound.summary}
            </p>

            {compound.drivers && compound.drivers.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="font-semibold text-slate-800 block mb-1">
                  Environmental Accelerators Detected:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {compound.drivers.map((drv, i) => (
                    <li key={i}>{drv}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Evaluated Sensor Grid */}
        {Object.keys(sensors).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(sensors).map(([k, s]) => (
              <SensorCard key={k} paramKey={k} data={s} />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No sensor telemetry was provided for this scan. You can add sensors in the Analyze page.
          </div>
        )}
      </div>

      {/* 6. DISEASE VISUAL SYMPTOMS & PATHOLOGY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Visual Symptoms & Biological Progression
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          {p.symptoms.map((sym, i) => (
            <li key={i} className="flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>{sym}</span>
            </li>
          ))}
        </ul>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1 mt-2">
          <span className="font-bold text-slate-800 block">Pathogen Transmission Dynamics:</span>
          <p>{p.causes}</p>
        </div>
      </div>

      {/* 7. EXPANDABLE TECHNICAL ANALYSIS PANEL (Section 39) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Technical Analysis & Model Diagnostics
            </span>
          </div>
          {showTechnical ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showTechnical && p.technical && (
          <div className="p-5 pt-0 border-t border-slate-100 space-y-4 text-xs text-slate-600">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Engine</span>
                <span className="font-bold text-slate-900 block truncate">{p.technical.inference_engine}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Latency</span>
                <span className="font-bold text-slate-900 block">{p.technical.latency_ms} ms</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Resolution</span>
                <span className="font-bold text-slate-900 block">{p.technical.input_resolution}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Chlorosis Halo</span>
                <span className="font-bold text-slate-900 block">{p.technical.extracted_features.chlorosis_halo}</span>
              </div>
            </div>

            {p.alternatives && p.alternatives.length > 0 && (
              <div>
                <span className="font-bold text-slate-800 block mb-2">Alternative Model Candidates:</span>
                <div className="space-y-1.5">
                  {p.alternatives.map((alt, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-xs">
                      <span>{alt.crop} - {alt.condition}</span>
                      <span className="font-bold text-slate-700">{alt.probability}% probability</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
