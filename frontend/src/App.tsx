import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { SettingsPage } from './pages/SettingsPage';
import { AnalysisResponse, SampleLeaf } from './types';
import { getScanDetails } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeResult, setActiveResult] = useState<AnalysisResponse | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleLeaf | null>(null);

  const handleAnalysisComplete = (result: AnalysisResponse) => {
    setActiveResult(result);
    setActiveTab('result');
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    setSelectedSample(sample);
    setActiveTab('analyze');
  };

  const handleViewScan = async (scanId: string) => {
    try {
      const scan = await getScanDetails(scanId);
      if (scan) {
        // Map database scan to AnalysisResponse
        const mappedResult: AnalysisResponse = {
          success: true,
          quality_passed: true,
          quality_report: {
            is_valid: true,
            overall_score: 90,
            metrics: {
              resolution: '1280x720',
              sharpness_variance: 150,
              blur_score: 95,
              mean_brightness: 120,
              brightness_score: 95,
              foliage_ratio: 0.6,
              vegetation_score: 90,
            },
            issues: [],
            tips: [],
          },
          scan_id: scan.id,
          created_at: scan.created_at,
          image_url: scan.image_url,
          thumbnail_url: scan.thumbnail_url,
          prediction: scan.prediction_data,
          evaluated_sensors: scan.evaluated_sensors,
          compound_risk: scan.compound_risk,
          health_score: {
            score: scan.health_score,
            label: scan.is_healthy ? 'Robust / Healthy' : 'Active Symptoms',
            breakdown: {
              foliar_condition: scan.health_score,
              moisture_stability: 85,
              thermal_comfort: 90,
              humidity_balance: 80,
              nutrient_ph: 90,
            },
            disclaimer: 'Retrieved from historical scan record',
          },
          recommendations: scan.recommendations,
          technical: scan.technical,
        };
        setActiveResult(mappedResult);
        setActiveTab('result');
      }
    } catch (err) {
      console.error('Failed to load scan details:', err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={(t) => setActiveTab(t)}
            onSelectSample={handleSelectSample}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(t) => setActiveTab(t)}
            onViewScan={handleViewScan}
            onSelectSample={handleSelectSample}
          />
        );
      case 'analyze':
        return (
          <AnalyzePage
            onAnalysisComplete={handleAnalysisComplete}
            initialSample={selectedSample}
            onClearSample={() => setSelectedSample(null)}
          />
        );
      case 'result':
        return activeResult ? (
          <ResultPage
            result={activeResult}
            onScanAgain={() => {
              setSelectedSample(null);
              setActiveTab('analyze');
            }}
          />
        ) : (
          <AnalyzePage
            onAnalysisComplete={handleAnalysisComplete}
            initialSample={selectedSample}
            onClearSample={() => setSelectedSample(null)}
          />
        );
      case 'history':
        return (
          <HistoryPage
            onViewScan={handleViewScan}
            onNavigate={(t) => setActiveTab(t)}
          />
        );
      case 'environment':
        return <EnvironmentPage />;
      case 'knowledge':
        return <KnowledgeBasePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <LandingPage
            onNavigate={(t) => setActiveTab(t)}
            onSelectSample={handleSelectSample}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar activeTab={activeTab} onNavigate={(t) => setActiveTab(t)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {activeTab !== 'landing' && (
          <Sidebar activeTab={activeTab} onNavigate={(t) => setActiveTab(t)} />
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-full overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
