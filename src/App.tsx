import { useCallback, useEffect, useRef, useState } from 'react';
import { Brain, ChartLine, Download, Home, RefreshCw, Settings as SettingsIcon, TriangleAlert, WifiOff, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Predictions } from './components/Predictions';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { InstallPrompt } from './components/InstallPrompt';
import { publicAsset, refreshBingoData, useBingoData } from './data/api';

type Page = 'dashboard' | 'predictions' | 'history' | 'settings';

const PAGES: Page[] = ['dashboard', 'predictions', 'history', 'settings'];
const INSTALL_DISMISSED_KEY = 'bingo-install-dismissed';
const DISCLAIMER_DISMISSED_KEY = 'bingo-disclaimer-dismissed';

function initialPage(): Page {
  // Manifest shortcuts and external links address tabs as ?tab=predictions etc.
  const tab = new URLSearchParams(window.location.search).get('tab');
  return PAGES.includes(tab as Page) ? (tab as Page) : 'dashboard';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function App() {
  const [page, setPage] = useState<Page>(initialPage);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStart = useRef<{ x: number; y: number } | null>(null);
  const pullActive = useRef(false);
  const { data } = useBingoData();
  const live = data?.week?.matches.some((match) => match.status === 'live') ?? false;

  useEffect(() => {
    document.documentElement.classList.add('dark');

    // Listen for install prompt, unless the user dismissed it earlier
    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === '1';
    const beforeinstall = (e: Event) => {
      e.preventDefault();
      if (!dismissed) setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', beforeinstall);

    try {
      setShowDisclaimer(localStorage.getItem(DISCLAIMER_DISMISSED_KEY) !== '1');
    } catch {
      setShowDisclaimer(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', beforeinstall);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handleDismissInstall = () => {
    setInstallPrompt(null);
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
    } catch {
      // Storage unavailable — dismissal just won't persist.
    }
  };

  const handleDismissDisclaimer = () => {
    setShowDisclaimer(false);
    try {
      localStorage.setItem(DISCLAIMER_DISMISSED_KEY, '1');
    } catch {
      // Storage unavailable — dismissal just won't persist.
    }
  };

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refreshBingoData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Custom pull-to-refresh: works in the installed PWA where the browser's
  // native gesture is disabled by overscroll-behavior: contain.
  const onTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY > 0 || refreshing) return;
    const touch = e.touches[0];
    pullStart.current = { x: touch.clientX, y: touch.clientY };
    pullActive.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const start = pullStart.current;
    if (!start || refreshing) return;
    const touch = e.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      pullStart.current = null;
      setPullDistance(0);
      return;
    }
    if (dy > 0 && window.scrollY <= 0) {
      pullActive.current = true;
      setPullDistance(Math.min(dy * 0.4, 72));
    }
  };
  const onTouchEnd = () => {
    pullStart.current = null;
    if (pullActive.current && pullDistance > 48) {
      handleRefresh();
    }
    setPullDistance(0);
  };

  const pulling = pullDistance > 0 || refreshing;
  const pullProgress = refreshing ? 1 : Math.min(pullDistance / 48, 1);

  const navItems: { id: Page; label: string; icon: typeof Home }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'predictions', label: 'Predict', icon: Brain },
    { id: 'history', label: 'History', icon: ChartLine },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 safe-top"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={publicAsset('icon.svg')} alt="Bingo" className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Bingo</h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">AI Football Predictions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data?.generatedAt && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-800/80 text-[10px] text-gray-300 font-medium hover:bg-gray-700/80 transition-colors"
                title="Updated — tap to refresh"
              >
                <RefreshCw
                  className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`}
                  aria-hidden
                />
                {refreshing ? 'Updating…' : timeAgo(data.generatedAt)}
              </button>
            )}
            {live && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* Pull-to-refresh indicator */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center overflow-hidden transition-[height] duration-200"
          style={{ height: pulling ? Math.max(pullDistance, refreshing ? 40 : 0) : 0, top: '100%' }}
        >
          <RefreshCw
            className={`text-emerald-400 transition-transform ${refreshing ? 'animate-spin' : ''}`}
            style={{ transform: refreshing ? undefined : `rotate(${pullProgress * 360}deg)` }}
            size={20}
            aria-hidden
          />
        </div>
      </header>

      {/* Offline banner: cache is being shown because the network fetch failed */}
      {data?.source === 'cache' && (
        <div className="max-w-lg mx-auto px-4 pt-3">
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" aria-hidden />
            <p className="text-[11px] text-amber-400/90">
              Offline — showing saved data{data.generatedAt ? ` from ${timeAgo(data.generatedAt)}` : ''}.
            </p>
          </div>
        </div>
      )}

      {/* Consolidated dismissible disclaimer (single source of truth) */}
      {showDisclaimer && (
        <div className="max-w-lg mx-auto px-4 pt-3">
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2">
            <TriangleAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden />
            <p className="text-[11px] text-amber-400/80 leading-relaxed flex-1">
              Statistical predictions only — not betting advice, no guarantees. Never risk money you cannot afford to lose.
            </p>
            <button
              onClick={handleDismissDisclaimer}
              aria-label="Dismiss disclaimer"
              className="text-gray-500 hover:text-gray-300 -mt-0.5"
            >
              <X className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-20">
        {page === 'dashboard' && <Dashboard onNavigate={setPage} onRefresh={handleRefresh} refreshing={refreshing} />}
        {page === 'predictions' && <Predictions />}
        {page === 'history' && <History />}
        {page === 'settings' && <Settings />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 safe-bottom z-40">
        <div className="max-w-lg mx-auto px-2 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-all ${
                  active
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {active && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-emerald-400" aria-hidden />
                )}
                <Icon className="w-5 h-5" aria-hidden />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Install Prompt */}
      {installPrompt && <InstallPrompt onInstall={handleInstall} onDismiss={handleDismissInstall} />}
    </div>
  );
}
