import React from 'react';
import {
  Sparkles,
  Scan,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Droplets,
  Thermometer,
  Wind,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onSelectSample?: (sample: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectSample }) => {
  const steps = [
    {
      num: '01',
      title: 'Capture or Upload',
      desc: 'Take a high-resolution photo with your smartphone or upload an existing leaf image.',
      icon: Scan,
    },
    {
      num: '02',
      title: 'AI Analyzes',
      desc: 'Our modular agronomic engine verifies image sharpness, exposure, and classifies foliar pathology.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Understand Condition',
      desc: 'Inspect disease symptoms, calibrated confidence metrics, and compounding environmental risk.',
      icon: ShieldCheck,
    },
    {
      num: '04',
      title: 'Take Action',
      desc: 'Receive immediate quarantine steps, field canopy guidance, and region-compliant treatments.',
      icon: FileText,
    },
  ];

  const features = [
    {
      title: 'AI Disease Detection',
      desc: 'Trained on 38 botanical pathology classes across tomatoes, potatoes, apples, corn, grapes, and peppers.',
      badge: 'PlantVillage Taxonomy',
    },
    {
      title: 'Crop Health Score',
      desc: 'A weighted 0-100 index factoring foliar symptoms, thermal stress, moisture deficit, and pH imbalance.',
      badge: 'Multi-factor Index',
    },
    {
      title: 'Environmental Analysis',
      desc: 'Interprets soil moisture, ambient temperature, humidity, and pH against physiological safety limits.',
      badge: 'IoT Ready',
    },
    {
      title: 'Smart Recommendations',
      desc: 'Provides structured immediate actions, organic biocontrols, and 7-day field scouting schedules.',
      badge: 'Agronomic Guidance',
    },
    {
      title: 'Scan History & Trends',
      desc: 'Maintain longitudinal health records to track pathogen progression and seasonal outbreaks.',
      badge: 'Persistent Storage',
    },
    {
      title: 'Calibrated Confidence',
      desc: 'Explicit certainty categorization (High, Moderate, Low) with automated image-quality checks.',
      badge: 'Responsible AI',
    },
  ];

  return (
    <div className="space-y-16 py-6 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Agricultural Intelligence SaaS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Understand Your Plant.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Protect Your Crop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
            AI-powered plant disease detection and smart crop monitoring from a single plant image
            and environmental conditions. Designed for agronomists, researchers, farmers, and project evaluators.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('analyze')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <Scan className="w-4 h-4" />
              <span>Analyze a Plant</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
            >
              <span>Explore Dashboard</span>
            </button>
          </div>

          {/* Key metrics ticker */}
          <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-slate-800/80 max-w-xl">
            <div>
              <div className="text-2xl font-black text-white">38+</div>
              <div className="text-xs text-slate-400">Pathology Classes</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">6</div>
              <div className="text-xs text-slate-400">Sensor Parameters</div>
            </div>
            <div>
              <div className="text-2xl font-black text-teal-300">&lt; 100ms</div>
              <div className="text-xs text-slate-400">Inference Latency</div>
            </div>
          </div>
        </div>

        {/* Decorative Floating Card on Desktop */}
        <div className="hidden lg:block absolute right-12 top-12 w-80 bg-slate-800/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Live Telemetry Stream</span>
            </span>
            <span className="text-[10px] text-slate-400">Crop: Tomato</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>Soil Moisture</span>
              </span>
              <span className="font-bold text-white">68.4% (Optimal)</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Temperature</span>
              </span>
              <span className="font-bold text-white">25.1°C (Optimal)</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 flex items-center space-x-1.5">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Humidity</span>
              </span>
              <span className="font-bold text-amber-400">79.2% (Elevated)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
            <span>Fungal Risk Index:</span>
            <span className="font-bold text-emerald-400">Low (Managed)</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 mb-2">
            Seamless Workflow
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            From Leaf Image to Actionable Diagnosis in Seconds
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Designed for practical deployment in field trials, educational laboratories, and commercial greenhouses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="text-3xl font-black text-slate-100 group-hover:text-emerald-100 transition-colors mb-4">
                  {s.num}
                </div>
                <div className="p-3 w-fit bg-emerald-50 rounded-xl text-emerald-600 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-600 mb-2">
            Engineered Capabilities
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Comprehensive Precision Agriculture Suite
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 mb-3">
                  {f.badge}
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-2">{f.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span>Fully Operational</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Responsible AI Advisory */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start space-x-4">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <h5 className="font-bold text-sm text-amber-950 mb-1">
              Responsible AI & Agronomic Advisory Notice
            </h5>
            <p className="mb-2">
              AI-generated predictions and health scores are indicative tools designed to assist rapid
              scouting. They represent probabilistic classifications rather than definitive plant
              pathology confirmations.
            </p>
            <p className="font-medium text-amber-950">
              When treatment decisions carry significant financial or biological consequences,
              always confirm diagnoses with accredited agricultural extension agents or university diagnostic labs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
