import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  Info,
  Radio
} from 'lucide-react';

import { getEnvironmentalOverview } from '../services/api';
import { SensorCard } from '../components/SensorCard';

export const EnvironmentPage: React.FC = () => {
  const [crop, setCrop] = useState('Tomato');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'error'
  >('error');

  const loadEnvData = async () => {
    try {
      setLoading(true);

      const res = await getEnvironmentalOverview(crop);

      setData(res);
      setConnectionStatus('connected');
      setLastUpdated(new Date());

      console.log('Live Arduino telemetry:', res);
    } catch (err) {
      console.error(
        'Failed to load environmental overview:',
        err
      );

      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  /*
   * Load immediately when the page opens
   * and whenever the selected crop changes.
   */
  useEffect(() => {
    loadEnvData();
  }, [crop]);

  /*
   * IMPORTANT:
   * Continuously refresh the dashboard every 3 seconds.
   *
   * Arduino → bridge → backend database
   *                  ↓
   *          frontend reads here
   */
  useEffect(() => {
    const interval = setInterval(() => {
      loadEnvData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [crop]);

  return (
    <div className="space-y-8 pb-24">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Environmental Telemetry Hub
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Microclimate monitoring, biological threshold tracking, and IoT sensor ingestion
          </p>
        </div>

        <div className="flex items-center space-x-3">

          {/* Live Arduino status */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${connectionStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
              }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${connectionStatus === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-red-500'
                }`}
            />

            {connectionStatus === 'connected'
              ? 'Arduino Live'
              : 'Backend Offline'}
          </div>

          {/* Crop selector */}
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Tomato">Crop: Tomato</option>
            <option value="Potato">Crop: Potato</option>
            <option value="Corn">Crop: Corn</option>
            <option value="Apple">Crop: Apple</option>
            <option value="Grape">Crop: Grape</option>
            <option value="Pepper">Crop: Pepper</option>
          </select>

          {/* Manual refresh */}
          <button
            onClick={loadEnvData}
            disabled={loading}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 shadow-sm"
            title="Refresh Readings"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''
                }`}
            />
          </button>

        </div>
      </div>


      {/* LIVE ARDUINO TELEMETRY BAR */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">

        <div>

          <div className="flex items-center space-x-2">

            <Radio className="w-4 h-4 text-emerald-400" />

            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Arduino UNO Live Telemetry
            </h3>

          </div>

          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live sensor readings received from Arduino UNO through
            COM3 → Python Bridge → AgriPulse API.
          </p>

          {lastUpdated && (
            <p className="text-[11px] text-slate-400 mt-2">
              Last dashboard update:{' '}
              {lastUpdated.toLocaleTimeString()}
            </p>
          )}

        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          LIVE
        </div>

      </div>


      {/* SUCCESS MESSAGE */}
      {connectionStatus === 'connected' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">

          <CheckCircle2 className="w-4 h-4 text-emerald-600" />

          <span>
            Arduino telemetry is connected to AgriPulse.
            Dashboard refreshes automatically every 3 seconds.
          </span>

        </div>
      )}


      {/* LIVE SENSOR GRID */}
      {data?.current && (

        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="text-base font-bold text-slate-900">
              Real-Time Parameter Interpretations ({crop})
            </h2>

            <span className="text-[11px] text-slate-500">
              Auto-refresh: 3 seconds
            </span>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {Object.entries(data.current).map(
              ([k, s]: [string, any]) => (
                <SensorCard
                  key={k}
                  paramKey={k}
                  data={s}
                />
              )
            )}

          </div>

        </div>

      )}


      {/* LOADING */}
      {loading && !data && (
        <div className="p-8 text-center text-sm text-slate-500">
          Connecting to AgriPulse sensor telemetry...
        </div>
      )}


      {/* ARCHITECTURE NOTE */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">

        <div className="flex items-center space-x-2 text-slate-900 font-bold">

          <Info className="w-4 h-4 text-emerald-600" />

          <span>
            Live IoT Architecture
          </span>

        </div>

        <p>
          Arduino UNO sensors send telemetry through the
          serial connection on COM3 at 9600 baud. The Python
          bridge forwards the readings to the AgriPulse
          <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px] mx-1">
            POST /api/sensor-data
          </code>
          endpoint. The dashboard retrieves the latest stored
          readings automatically.
        </p>

      </div>

    </div>
  );
};