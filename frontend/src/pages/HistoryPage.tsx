import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Activity,
  Download
} from 'lucide-react';
import { getScans, deleteScan, clearAllScans } from '../services/api';
import { ScanRecord } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';

interface HistoryPageProps {
  onViewScan: (scanId: string) => void;
  onNavigate: (tab: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewScan, onNavigate }) => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    total_scans: 0,
    healthy_scans: 0,
    diseased_scans: 0,
    avg_health_score: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, [filter, search]);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const res = await getScans(filter, search);
      setScans(res.scans);
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to fetch scans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this scan record?')) {
      await deleteScan(scanId);
      fetchScans();
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all scan history? This action cannot be undone.')) {
      await clearAllScans();
      fetchScans();
    }
  };

  const filterTabs = [
    { id: 'all', label: 'All Scans' },
    { id: 'healthy', label: 'Healthy Plants' },
    { id: 'diseased', label: 'Diseased Foliage' },
    { id: 'high_risk', label: 'High / Critical Risk' },
    { id: 'low_confidence', label: 'Low Confidence' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Scan History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of all foliage classifications, environmental correlations, and health assessments
          </p>
        </div>

        {scans.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-400 font-semibold block">Total Scans</span>
          <span className="text-xl font-bold text-slate-900">{stats.total_scans}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-400 font-semibold block">Healthy Foliage</span>
          <span className="text-xl font-bold text-emerald-600">{stats.healthy_scans}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-400 font-semibold block">Diseased Cases</span>
          <span className="text-xl font-bold text-rose-600">{stats.diseased_scans}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs text-slate-400 font-semibold block">Average Health</span>
          <span className="text-xl font-bold text-teal-700">{stats.avg_health_score}/100</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === t.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search crop, disease, or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
        </div>
      </div>

      {/* Scans List / Cards */}
      {scans.length === 0 ? (
        <EmptyState
          title="No matching scans found"
          description={
            search || filter !== 'all'
              ? 'Try changing your search keywords or active filter tab.'
              : 'You have not analyzed any plants yet. Upload an image to start.'
          }
          actionText={search || filter !== 'all' ? 'Reset Filters' : 'Scan a Plant'}
          onAction={() => {
            if (search || filter !== 'all') {
              setSearch('');
              setFilter('all');
            } else {
              onNavigate('analyze');
            }
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => onViewScan(scan.id)}
                className="p-4 sm:px-6 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <img
                    src={scan.thumbnail_url || scan.image_url}
                    alt={scan.crop}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
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
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Confidence: {scan.confidence}% ({scan.confidence_level})</span>
                      <span>•</span>
                      <span>Health: {scan.health_score}/100</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(scan.created_at).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <StatusBadge type="risk" value={scan.risk_level} />
                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete Scan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
