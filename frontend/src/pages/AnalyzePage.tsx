import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Droplets,
  Thermometer,
  Wind,
  Gauge,
  Sun,
  CloudRain,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  ArrowRight
} from 'lucide-react';
import { analyzePlant, checkImageQuality } from '../services/api';
import { AnalysisResponse, SampleLeaf } from '../types';

interface AnalyzePageProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
  initialSample?: SampleLeaf | null;
  onClearSample?: () => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  onAnalysisComplete,
  initialSample,
  onClearSample,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialSample?.image_url || null);
  const [crop, setCrop] = useState<string>(initialSample?.crop || 'auto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [qualityWarning, setQualityWarning] = useState<any | null>(null);
  const [showSensors, setShowSensors] = useState(false);
  const [notes, setNotes] = useState('');

  // Sensor parameters state
  const [sensors, setSensors] = useState({
    soil_moisture: initialSample?.preset_sensors?.soil_moisture?.toString() || '',
    temperature: initialSample?.preset_sensors?.temperature?.toString() || '',
    humidity: initialSample?.preset_sensors?.humidity?.toString() || '',
    ph: initialSample?.preset_sensors?.ph?.toString() || '',
    light: initialSample?.preset_sensors?.light?.toString() || '',
    rainfall: initialSample?.preset_sensors?.rainfall?.toString() || '',
  });

  const [sensorErrors, setSensorErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const stages = [
    'Preparing image & color normalization',
    'Checking optical quality & leaf focus',
    'Deep neural foliar feature extraction',
    'Evaluating calibrated confidence bounds',
    'Correlating environmental telemetry & compounding risk',
    'Formulating agronomic action recommendations',
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setQualityWarning(null);
      if (onClearSample) onClearSample();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setQualityWarning(null);
      if (onClearSample) onClearSample();
    }
  };

  const handleSensorChange = (field: string, val: string) => {
    setSensors((prev) => ({ ...prev, [field]: val }));
    validateSensorField(field, val);
  };

  const validateSensorField = (field: string, val: string) => {
    if (!val || val.trim() === '') {
      setSensorErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }

    const num = parseFloat(val);
    let error = '';

    if (isNaN(num)) {
      error = 'Must be a valid number';
    } else {
      if (field === 'soil_moisture' && (num < 0 || num > 100)) error = 'Moisture must be 0–100%';
      if (field === 'humidity' && (num < 0 || num > 100)) error = 'Humidity must be 0–100%';
      if (field === 'ph' && (num < 0 || num > 14)) error = 'pH must be 0–14';
      if (field === 'temperature' && (num < -20 || num > 65)) error = 'Range -20°C to 65°C';
      if (field === 'light' && num < 0) error = 'Light intensity cannot be negative';
      if (field === 'rainfall' && num < 0) error = 'Rainfall cannot be negative';
    }

    setSensorErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const populateSampleSensors = () => {
    setSensors({
      soil_moisture: '72.5',
      temperature: '26.8',
      humidity: '82.0',
      ph: '6.4',
      light: '35000',
      rainfall: '14.0',
    });
    setSensorErrors({});
    setShowSensors(true);
  };

  const handleStartAnalysis = async (forceOverride = false) => {
    if (!selectedFile && !previewUrl) return;

    // Check for sensor validation errors
    if (Object.keys(sensorErrors).length > 0) {
      alert('Please correct sensor validation errors before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setQualityWarning(null);

    // Simulated progress stage animation
    let curStage = 0;
    const stageInterval = setInterval(() => {
      if (curStage < stages.length - 1) {
        curStage += 1;
        setAnalysisStage(curStage);
      }
    }, 450);

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (previewUrl) {
        // Fetch sample file as blob if using pre-loaded preset
        const resp = await fetch(previewUrl);
        const blob = await resp.blob();
        formData.append('image', blob, 'sample_leaf.jpg');
      }

      formData.append('crop', crop);
      formData.append('force', forceOverride ? 'true' : 'false');
      if (notes) formData.append('notes', notes);

      if (sensors.soil_moisture) formData.append('soil_moisture', sensors.soil_moisture);
      if (sensors.temperature) formData.append('temperature', sensors.temperature);
      if (sensors.humidity) formData.append('humidity', sensors.humidity);
      if (sensors.ph) formData.append('ph', sensors.ph);
      if (sensors.light) formData.append('light', sensors.light);
      if (sensors.rainfall) formData.append('rainfall', sensors.rainfall);

      const result = await analyzePlant(formData);
      clearInterval(stageInterval);

      if (!result.quality_passed && !forceOverride) {
        setIsAnalyzing(false);
        setQualityWarning(result);
        return;
      }

      // Small pause to complete visual pipeline
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalysisComplete(result);
      }, 500);
    } catch (err: any) {
      clearInterval(stageInterval);
      setIsAnalyzing(false);
      alert(err.message || 'Analysis encountered an error. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Plant Foliage
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Upload an image of the affected plant leaf. Optionally include ambient or soil sensor readings
          for compound environmental risk assessment.
        </p>
      </div>

      {/* Main Upload / Preview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {!previewUrl ? (
          /* Dropzone */
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Click to select or drag and drop leaf photo
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Supported formats: JPG, JPEG, PNG, WEBP. For optimal precision, ensure the leaf fills the frame with clear focus.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Browse Files</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Open Camera</span>
              </button>
            </div>
          </div>
        ) : (
          /* Image Preview & Controls */
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-96">
              <img
                src={previewUrl}
                alt="Plant preview"
                className="max-h-96 w-full object-contain"
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setQualityWarning(null);
                    if (onClearSample) onClearSample();
                  }}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition shadow-md"
                  title="Change Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {initialSample && (
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs backdrop-blur-md border border-slate-700">
                  <span className="text-emerald-400 font-bold">Preset:</span> {initialSample.title}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Select Different Image</span>
              </button>

              <div className="text-xs text-slate-400">
                Image loaded & ready for classification
              </div>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Crop Selection (Optional Auto-detect) */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Target Crop / Plant Species (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'auto', label: 'Auto Detect' },
              { id: 'Tomato', label: 'Tomato' },
              { id: 'Potato', label: 'Potato' },
              { id: 'Corn', label: 'Corn / Maize' },
              { id: 'Apple', label: 'Apple' },
              { id: 'Grape', label: 'Grape' },
              { id: 'Pepper', label: 'Pepper' },
              { id: 'Other', label: 'Other Species' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCrop(c.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                  crop === c.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Environmental Sensor Panel */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowSensors(!showSensors)}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-left transition border border-slate-200"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-white rounded-xl shadow-xs text-emerald-600">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Environmental & Soil Telemetry (Optional)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Integrate soil moisture, humidity, and temperature for compound risk calculation
                </span>
              </div>
            </div>
            {showSensors ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {showSensors && (
            <div className="mt-4 p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Field Telemetry Inputs
                </span>
                <button
                  type="button"
                  onClick={populateSampleSensors}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Load Sample Field Readings
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Soil Moisture */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Soil Moisture (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="e.g. 68.5"
                      value={sensors.soil_moisture}
                      onChange={(e) => handleSensorChange('soil_moisture', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        sensorErrors.soil_moisture ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <Droplets className="w-4 h-4 text-blue-400 absolute right-3 top-2.5" />
                  </div>
                  {sensorErrors.soil_moisture && (
                    <p className="text-[10px] text-rose-500 mt-1">{sensorErrors.soil_moisture}</p>
                  )}
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Temperature (°C)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 25.4"
                      value={sensors.temperature}
                      onChange={(e) => handleSensorChange('temperature', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        sensorErrors.temperature ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <Thermometer className="w-4 h-4 text-amber-400 absolute right-3 top-2.5" />
                  </div>
                  {sensorErrors.temperature && (
                    <p className="text-[10px] text-rose-500 mt-1">{sensorErrors.temperature}</p>
                  )}
                </div>

                {/* Humidity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Humidity (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="e.g. 78"
                      value={sensors.humidity}
                      onChange={(e) => handleSensorChange('humidity', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        sensorErrors.humidity ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <Wind className="w-4 h-4 text-teal-400 absolute right-3 top-2.5" />
                  </div>
                  {sensorErrors.humidity && (
                    <p className="text-[10px] text-rose-500 mt-1">{sensorErrors.humidity}</p>
                  )}
                </div>

                {/* pH */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Soil pH (0-14)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      placeholder="e.g. 6.4"
                      value={sensors.ph}
                      onChange={(e) => handleSensorChange('ph', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        sensorErrors.ph ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <Gauge className="w-4 h-4 text-indigo-400 absolute right-3 top-2.5" />
                  </div>
                  {sensorErrors.ph && (
                    <p className="text-[10px] text-rose-500 mt-1">{sensorErrors.ph}</p>
                  )}
                </div>

                {/* Light Intensity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Light Intensity (lux)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="100"
                      min="0"
                      placeholder="e.g. 35000"
                      value={sensors.light}
                      onChange={(e) => handleSensorChange('light', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        sensorErrors.light ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <Sun className="w-4 h-4 text-yellow-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Rainfall */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Precipitation / Rain (mm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="e.g. 15"
                      value={sensors.rainfall}
                      onChange={(e) => handleSensorChange('rainfall', e.target.value)}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        sensorErrors.rainfall ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    <CloudRain className="w-4 h-4 text-sky-400 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quality Check Warning Dialog */}
        {qualityWarning && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-bold">{qualityWarning.message}</h4>
            </div>

            {qualityWarning.issues && qualityWarning.issues.length > 0 && (
              <div className="text-xs">
                <span className="font-semibold text-amber-900 block mb-1">Issues Identified:</span>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  {qualityWarning.issues.map((iss: string, idx: number) => (
                    <li key={idx}>{iss}</li>
                  ))}
                </ul>
              </div>
            )}

            {qualityWarning.tips && qualityWarning.tips.length > 0 && (
              <div className="text-xs">
                <span className="font-semibold text-amber-900 block mb-1">Suggested Adjustments:</span>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  {qualityWarning.tips.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-700 hover:bg-amber-800"
              >
                Try Another Image
              </button>
              <button
                type="button"
                onClick={() => handleStartAnalysis(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-800 hover:underline"
              >
                Analyze Anyway (Override Quality Guard)
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={!previewUrl || isAnalyzing}
            onClick={() => handleStartAnalysis(false)}
            className={`w-full py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center space-x-2 transition shadow-md ${
              !previewUrl || isAnalyzing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.01]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Multi-Stage AI Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Plant & Environmental Health</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Multi-Stage Processing Visualizer Overlay */}
      {isAnalyzing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <h3 className="text-base font-bold text-slate-900">
                AI Diagnostic Engine Processing
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {Math.round(((analysisStage + 1) / stages.length) * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${((analysisStage + 1) / stages.length) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-2">
            {stages.map((stg, idx) => {
              const isDone = idx < analysisStage;
              const isCurrent = idx === analysisStage;
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 text-xs p-2 rounded-xl transition ${
                    isCurrent
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : isDone
                      ? 'text-slate-400'
                      : 'text-slate-300'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    )}
                  </div>
                  <span>{stg}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
