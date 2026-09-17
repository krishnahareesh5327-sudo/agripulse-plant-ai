import React, { useState, useEffect } from 'react';
import {
  Scan,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Droplets,
  Thermometer,
  Wind,
  Gauge,
  Sun,
  Sparkles,
  ChevronRight,
  Search,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { getScans, getEnvironmentalOverview, getSampleLeaves } from '../services/api';
import { ScanRecord, SampleLeaf } from '../types';
import { SensorCard } from '../components/SensorCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onViewScan: (scanId: string) => void;
  onSelectSample: (sample: SampleLeaf) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onViewScan,
  onSelectSample,
}) => {
  const [stats, setStats] = useState({
    total_scans: 0,
    healthy_scans: 0,
    diseased_scans: 0,
    avg_health_score: 0,
  });
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [envOverview, setEnvOverview] = useState<any>(null);
  const [samples, setSamples] = useState<SampleLeaf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [scansRes, envRes, samplesRes] = await Promise.all([
        getScans('all', '', 5, 0),
        getEnvironmentalOverview('Tomato'),
        getSampleLeaves(),
      ]);

      setStats(scansRes.stats);
      setRecentScans(scansRes.scans);
      setEnvOverview(envRes);
      setSamples(samplesRes);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Monitoring Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time crop diagnostic telemetry, environmental readings, and historical records
          </p>
        </div>
        <button
          onClick={() => onNavigate('analyze')}
          className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm hover:scale-[1.02]"
        >
          <Scan className="w-4 h-4" />
          <span>Analyze New Plant</span>
        </button>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Scans</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Scan className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.total_scans}</div>
          <p className="text-[11px] text-slate-400 mt-1">Recorded in session database</p>
        </div>

        {/* Healthy Crops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Healthy Plants</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats.healthy_scans}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {stats.total_scans > 0
              ? `${Math.round((stats.healthy_scans / stats.total_scans) * 100)}% of scanned foliage`
              : 'Zero disease detections'}
          </p>
        </div>

        {/* Diseases Detected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Diseases Flagged</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600">{stats.diseased_scans}</div>
          <p className="text-[11px] text-slate-400 mt-1">Active pathogen warnings</p>
        </div>

        {/* Average Health Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Average Health</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-teal-700">
            {stats.avg_health_score}
            <span className="text-base font-normal text-slate-400">/100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Combined multi-factor average</p>
        </div>
      </div>

      {/* 1-Click Quick Test Presets (Great for Evaluators & Demos) */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-6 text-white border border-emerald-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Evaluation Presets</span>
            </div>
            <h3 className="text-base font-bold text-white">Instant 1-Click Diagnostic Tests</h3>
            <p className="text-xs text-slate-300">
              Select any pre-configured leaf pathology below to instantly test inference, telemetry compounding, and recommendations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {samples.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSample(s)}
              className="bg-slate-800/80 hover:bg-slate-700/90 p-3 rounded-xl border border-slate-700 hover:border-emerald-400 text-left transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                  {s.crop}
                </span>
                <span className="text-xs font-bold text-white block line-clamp-1 group-hover:text-emerald-300">
                  {s.expected_condition}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 flex items-center">
                <span>Run Preset</span>
                <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Environmental Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Environmental Telemetry</h3>
            <p className="text-xs text-slate-500">
              Sensor readings interpreted against biological target ranges for Tomato
            </p>
          </div>
          <button
            onClick={() => onNavigate('environment')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>Telemetry Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {envOverview?.current && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(envOverview.current).map(([key, data]: [string, any]) => (
              <SensorCard key={key} paramKey={key} data={data} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Plant Scans</h3>
            <p className="text-xs text-slate-500">Latest analyzed crops in your system</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentScans.length === 0 ? (
          <EmptyState
            title="No plant scans yet"
            description="Upload your first leaf image to begin diagnosing plant diseases and tracking crop health."
            actionText="Analyze Plant Now"
            onAction={() => onNavigate('analyze')}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => onViewScan(scan.id)}
                  className="p-4 sm:px-6 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <img
                      src={scan.thumbnail_url || scan.image_url}
                      alt={scan.crop}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900 truncate">
                          {scan.crop} - {scan.condition}
                        </span>
                        <StatusBadge
                          type="health"
                          value={scan.is_healthy ? 'Healthy' : 'Diseased'}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-3">
                        <span>Confidence: {scan.confidence}%</span>
                        <span>•</span>
                        <span>Health: {scan.health_score}/100</span>
                        <span>•</span>
                        <span>{new Date(scan.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <StatusBadge type="risk" value={scan.risk_level} />
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
