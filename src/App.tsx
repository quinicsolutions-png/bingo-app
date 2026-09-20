import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Predictions } from './components/Predictions';
import { History } from './components/History';
import { Methodology } from './components/Methodology';
import { OpenSource } from './components/OpenSource';
import { BlockerMitigation } from './components/BlockerMitigation';

type Page = 'dashboard' | 'predictions' | 'history' | 'methodology' | 'opensource' | 'mitigation';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'predictions', label: 'Predictions', icon: 'fa-brain' },
    { id: 'history', label: 'Track Record', icon: 'fa-chart-line' },
    { id: 'methodology', label: 'Methodology', icon: 'fa-flask' },
    { id: 'opensource', label: 'Open Source', icon: 'fa-code-branch' },
    { id: 'mitigation', label: 'Blocker Fix', icon: 'fa-shield-halved' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <i className="fa-solid fa-futbol text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">MatchIQ</h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">Free AI Football Predictions</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  page === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <i className={`fa-solid ${item.icon} mr-1.5`}></i>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-gray-400`}></i>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-800 p-2 bg-gray-900">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm ${
                  page === item.id
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-4`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
        {page === 'predictions' && <Predictions />}
        {page === 'history' && <History />}
        {page === 'methodology' && <Methodology />}
        {page === 'opensource' && <OpenSource />}
        {page === 'mitigation' && <BlockerMitigation />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">MatchIQ</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Free, open-source AI football predictions. Statistical analysis only — not a betting service.
                Built with open-source tools and free data APIs.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Data Sources</h4>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• football-data.org (free tier)</li>
                <li>• openfootball datasets (public domain)</li>
                <li>• Dixon-Coles model (open source)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Disclaimer</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                This app provides statistical analysis only. It does not accept wagers, guarantee outcomes, or constitute gambling advice. Predictions are probabilistic and may be wrong.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-600">© 2026 MatchIQ — Open Source (MIT License)</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" className="text-xs text-gray-500 hover:text-gray-300">
                <i className="fa-brands fa-github mr-1"></i>GitHub
              </a>
              <span className="text-xs text-gray-600">v2.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
