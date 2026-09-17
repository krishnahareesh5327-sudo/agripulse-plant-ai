import React, { useState } from 'react';
import { Settings, Shield, Cpu, Info, Check, Trash2 } from 'lucide-react';
import { clearAllScans } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [units, setUnits] = useState('metric');
  const [highThreshold, setHighThreshold] = useState(85);
  const [moderateThreshold, setModerateThreshold] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Clear all local scan history?')) {
      await clearAllScans();
      alert('Scan history cleared.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          System Settings & AI Architecture
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure diagnostic thresholds, telemetry units, and review model documentation
        </p>
      </div>

      {/* Model & AI Information Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900">
          <Cpu className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold">About the AI Model & Benchmark Dataset</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">
              Benchmark Dataset
            </span>
            <span className="font-bold text-slate-900 block mt-0.5">PlantVillage 38-Class Standard</span>
            <p className="text-[11px] text-slate-500 mt-1">
              Standard agricultural deep learning benchmark covering 14 crop species and 26 foliar diseases.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">
              Active Inference Engine
            </span>
            <span className="font-bold text-slate-900 block mt-0.5">
              Agronomic Feature & Telemetry Sandbox
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Extracts leaf chlorosis, lesion necrosis, and edge textures with real-time sensor compounding.
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
          <strong>Modular Architecture:</strong> The backend ML service implements a clean abstract interface.
          Trained PyTorch (ResNet/EfficientNet) or ONNX model weights can be plugged into{' '}
          <code className="font-mono text-emerald-800 bg-emerald-100 px-1 rounded">/backend/app/ml/inference.py</code>{' '}
          without modifying frontend components or database schemas.
        </div>
      </div>

      {/* Configurable Thresholds */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Configurable Confidence Thresholds</h2>
        <p className="text-xs text-slate-500">
          Set cutoff boundaries for High, Moderate, and Low certainty classifications.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              High Confidence Cutoff (%)
            </label>
            <input
              type="number"
              min="70"
              max="95"
              value={highThreshold}
              onChange={(e) => setHighThreshold(parseInt(e.target.value) || 85)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Predictions ≥ {highThreshold}% classified as High</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Moderate Confidence Floor (%)
            </label>
            <input
              type="number"
              min="40"
              max="75"
              value={moderateThreshold}
              onChange={(e) => setModerateThreshold(parseInt(e.target.value) || 60)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Predictions &lt; {moderateThreshold}% flagged as Low</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          <span>{saved ? 'Settings Saved' : 'Save Thresholds'}</span>
        </button>
      </div>

      {/* Units & Localization */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Telemetry Units</h2>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="units"
              value="metric"
              checked={units === 'metric'}
              onChange={() => setUnits('metric')}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span>Metric (°C, mm, lux)</span>
          </label>
          <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="units"
              value="imperial"
              checked={units === 'imperial'}
              onChange={() => setUnits('imperial')}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span>Imperial (°F, in, fc)</span>
          </label>
        </div>
      </div>

      {/* Data Management & Privacy */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-900">
          <Shield className="w-5 h-5 text-slate-600" />
          <h2 className="text-base font-bold">Privacy & Data Governance</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Images uploaded to AgriPulse AI are processed strictly for plant pathology classification
          and microclimate correlation. No personally identifiable biometric data or location cookies
          are collected.
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Local Database Scans</span>
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Scan Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
