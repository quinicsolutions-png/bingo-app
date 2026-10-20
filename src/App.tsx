import { useState, useEffect } from 'react';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Dashboard } from './components/Dashboard';
import { Predictions } from './components/Predictions';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { InstallPrompt } from './components/InstallPrompt';
import { publicAsset, useBingoData } from './data/api';

type Page = 'dashboard' | 'predictions' | 'history' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useBingoData();
  const live = data?.week?.matches.some((match) => match.status === 'live') ?? false;

  useEffect(() => {
    document.documentElement.classList.add('dark');

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Fetch token from secure storage
    const fetchToken = async () => {
      try {
        const { value } = await SecureStoragePlugin.get({ key: 'token' });
        if (value) {
          // Perform any additional actions with the token
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching token:', error);
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const getToken = async (): Promise<string | null> => {
    try {
      const { value } = await SecureStoragePlugin.get({ key: 'token' });
      return value;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const setToken = async (token: string) => {
    try {
      await SecureStoragePlugin.set({ key: 'token', value: token });
      // Perform any additional actions after setting the token
    } catch (error) {
      console.error('Error setting token:', error);
    }
  };

  const removeToken = async () => {
    try {
      await SecureStoragePlugin.remove({ key: 'token' });
      // Perform any additional actions after removing the token
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  const login = async (token: string) => {
    await setToken(token);
    // Perform any additional login actions here
  };

  const logout = async () => {
    await removeToken();
    // Perform any additional logout actions here
  };

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home', icon: 'fa-house' },
    { id: 'predictions', label: 'Predict', icon: 'fa-brain' },
    { id: 'history', label: 'History', icon: 'fa-chart-line' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 safe-top">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white">Loading...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
            <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={publicAsset('icon.svg')} alt="Bingo" className="w-8 h-8 rounded-lg" />
                <div>
                  <h1 className="text-base font-bold text-white tracking-tight">Bingo</h1>
                  <p className="text-[9px] text-gray-500 -mt-0.5">AI Football Predictions</p>
                </div>
              </div>
              {live && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-lg mx-auto px-4 py-4 pb-20">
            {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
            {page === 'predictions' && <Predictions />}
            {page === 'history' && <History />}
            {page === 'settings' && <Settings />}
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 safe-bottom z-40">
            <div className="max-w-lg mx-auto px-2 py-2 flex items-center justify-around">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-all ${
                    page === item.id
                      ? 'text-emerald-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} text-lg`}></i>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Install Prompt */}
          {installPrompt && <InstallPrompt onInstall={handleInstall} />}
        </>
      )}
    </div>
  );
}
