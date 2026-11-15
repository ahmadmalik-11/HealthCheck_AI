import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { AboutPage } from './pages/AboutPage';
import { CheckClaimPage } from './pages/CheckClaimPage';
import { DashboardPage } from './pages/DashboardPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { DEFAULT_API_ENDPOINT } from './services/predictionService';
import type { ApiConfig, PageId } from './types/classification';

const PAGE_LABELS: Record<PageId, string> = {
  dashboard: 'Dashboard',
  check: 'Check a Claim',
  evaluation: 'Evaluation & Performance',
  about: 'About Project',
};

export function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    mode: 'demo',
    endpointUrl: DEFAULT_API_ENDPOINT,
  });

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F2942] lg:flex-row">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onMobileToggle={setMobileMenuOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Desktop Top Contextual Bar */}
        <header className="hidden h-16 items-center justify-between gap-8 border-b border-slate-200 bg-white px-8 lg:flex">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-[#0F2942]">HealthCheckAI</span>
            <span aria-hidden="true">/</span>
            <span>{PAGE_LABELS[activePage]}</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
              {apiConfig.mode === 'demo' ? 'Demo Mode' : 'Python API Connected'}
            </span>
            {activePage !== 'check' && (
              <button
                type="button"
                onClick={() => handleNavigate('check')}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 whitespace-nowrap shrink-0"
              >
                <span>Analyze a Claim</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 bg-slate-50/40 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-5xl">
            {activePage === 'dashboard' && (
              <DashboardPage onNavigate={handleNavigate} />
            )}
            {activePage === 'check' && (
              <CheckClaimPage
                apiConfig={apiConfig}
                onApiConfigChange={setApiConfig}
              />
            )}
            {activePage === 'evaluation' && <EvaluationPage />}
            {activePage === 'about' && <AboutPage />}
          </div>
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span>HealthCheckAI · Automated Health Claim Classification</span>
            <span>
              Supports, Refutes &amp; Neutral classification using TF-IDF + LinearSVC
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
