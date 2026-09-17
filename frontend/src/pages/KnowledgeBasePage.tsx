import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ShieldCheck, AlertTriangle, Bug, Droplets, Info } from 'lucide-react';
import { getCropEncyclopedia } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

export const KnowledgeBasePage: React.FC = () => {
  const [crops, setCrops] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<Record<string, any>>({});
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEncyclopedia();
  }, []);

  const loadEncyclopedia = async () => {
    try {
      setLoading(true);
      const res = await getCropEncyclopedia();
      setCrops(res.supported_crops || []);
      setDiseases(res.diseases || {});
    } catch (err) {
      console.error('Failed to load encyclopedia:', err);
    } finally {
      setLoading(false);
    }
  };

  const diseaseList = Object.entries(diseases).filter(([key, d]) => {
    const matchesCrop = selectedCrop === 'All' || d.crop.toLowerCase() === selectedCrop.toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch =
      !search ||
      d.condition.toLowerCase().includes(query) ||
      d.crop.toLowerCase().includes(query) ||
      d.scientific_name.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query);
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Plant Pathology Encyclopedia
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Botanical taxonomy, pathogen biology, and symptom profiles for supported crops
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Pepper'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCrop === c
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search symptoms, pathogens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diseaseList.map(([key, d]) => (
          <div
            key={key}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {d.crop}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{d.condition}</h3>
                <p className="text-xs italic text-slate-500">
                  {d.scientific_name} ({d.pathogen_type})
                </p>
              </div>
              <StatusBadge
                type="health"
                value={d.is_healthy ? 'Healthy' : `Severity: ${d.default_severity}`}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>

            {/* Visual Symptoms */}
            <div>
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                Key Visual Symptoms:
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {d.symptoms.map((s: string, i: number) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Microclimate Virulence */}
            {d.favored_environment && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block">Virulence Window:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>Temp: {d.favored_environment.temp_range}</div>
                  <div>Humidity: {d.favored_environment.humidity}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
