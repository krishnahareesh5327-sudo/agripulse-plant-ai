import React from 'react';
import { Droplets, Thermometer, Wind, Gauge, Sun, CloudRain } from 'lucide-react';
import { EvaluatedSensor } from '../types';
import { StatusBadge } from './StatusBadge';

interface SensorCardProps {
  paramKey: string;
  data: EvaluatedSensor;
}

export const SensorCard: React.FC<SensorCardProps> = ({ paramKey, data }) => {
  const getIcon = () => {
    switch (paramKey) {
      case 'soil_moisture':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-amber-500" />;
      case 'humidity':
        return <Wind className="w-5 h-5 text-teal-500" />;
      case 'ph':
        return <Gauge className="w-5 h-5 text-indigo-500" />;
      case 'light':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'rainfall':
        return <CloudRain className="w-5 h-5 text-sky-500" />;
      default:
        return <Droplets className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{data.name}</h4>
            <span className="text-[11px] text-slate-400">Target: {data.reference_range}</span>
          </div>
        </div>
        <StatusBadge type="sensor" value={data.status} />
      </div>

      <div className="flex items-baseline space-x-2 my-2.5">
        <span className="text-2xl font-extrabold text-slate-900">
          {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
        </span>
        <span className="text-xs font-semibold text-slate-500">{data.unit}</span>
        <span className="text-xs text-slate-400 font-medium ml-auto">
          {data.trend}
        </span>
      </div>

      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
        {data.interpretation}
      </p>
    </div>
  );
};
