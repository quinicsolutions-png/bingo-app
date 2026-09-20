import { ACTIVE_WEEK, PLATFORM_STATS } from '../data/matchData';

interface Props {
  onNavigate: (page: 'dashboard' | 'predictions' | 'history' | 'methodology' | 'opensource' | 'mitigation') => void;
}

export function Dashboard({ onNavigate }: Props) {
  const timeUntilCutoff = getTimeUntil(ACTIVE_WEEK.cutoffTime);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent rounded-2xl p-6 border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">LIVE</span>
              <span className="text-xs text-gray-500">{ACTIVE_WEEK.label}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">This Week's Predictions</h2>
            <p className="text-sm text-gray-400">
              {ACTIVE_WEEK.matches.length} matches • Cutoff in {timeUntilCutoff}
            </p>
          </div>
          <button
            onClick={() => onNavigate('predictions')}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            View All Predictions <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon="fa-bullseye"
          label="Overall Accuracy"
          value={`${PLATFORM_STATS.overallAccuracy}%`}
          sublabel={`${PLATFORM_STATS.correctPredictions}/${PLATFORM_STATS.totalPredictions}`}
          color="emerald"
        />
        <StatCard
          icon="fa-fire"
          label="High Confidence"
          value={`${PLATFORM_STATS.highConfidenceAccuracy}%`}
          sublabel="When model is sure"
          color="amber"
        />
        <StatCard
          icon="fa-calendar-check"
          label="Weeks Tracked"
          value={PLATFORM_STATS.weeksTracked.toString()}
          sublabel="Public record"
          color="cyan"
        />
        <StatCard
          icon="fa-trophy"
          label="Leagues"
          value={PLATFORM_STATS.leaguesCovered.toString()}
          sublabel="Top European"
          color="purple"
        />
      </div>

      {/* Quick Predictions Preview */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Top Picks This Week</h3>
          <button onClick={() => onNavigate('predictions')} className="text-xs text-emerald-400 hover:text-emerald-300">
            See all →
          </button>
        </div>
        <div className="divide-y divide-gray-800">
          {ACTIVE_WEEK.matches.slice(0, 5).map((match) => (
            <div key={match.id} className="flex items-center justify-between p-3 hover:bg-gray-800/30">
              <div className="flex items-center gap-3">
                <span className="text-sm">{match.leagueIcon}</span>
                <div>
                  <p className="text-sm text-white">
                    <span className="font-medium">{match.homeShort}</span>
                    <span className="text-gray-500 mx-1.5">vs</span>
                    <span className="font-medium">{match.awayShort}</span>
                  </p>
                  <p className="text-[10px] text-gray-500">{match.league}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">
                    {match.prediction?.pick === '1' ? match.homeShort : match.prediction?.pick === '2' ? match.awayShort : 'Draw'}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {Math.round((match.prediction?.confidenceScore || 0) * 100)}% confidence
                  </p>
                </div>
                <ConfidenceBadge confidence={match.prediction?.confidence || 'LOW'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free & Open Source Banner */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-lock-open text-emerald-400 text-lg"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">100% Free & Open Source</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No ads, no subscriptions, no data collection. Built with open-source tools (Dixon-Coles, XGBoost) 
              and free data APIs (football-data.org). All code is available on GitHub under MIT license.
            </p>
          </div>
          <button
            onClick={() => onNavigate('opensource')}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 text-xs font-medium hover:bg-gray-700 transition-colors border border-gray-700 flex-shrink-0"
          >
            <i className="fa-brands fa-github mr-1.5"></i>View Source
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3">
            <i className="fa-solid fa-database text-cyan-400 text-sm"></i>
          </div>
          <h4 className="text-sm font-medium text-white mb-1">1. Free Data</h4>
          <p className="text-xs text-gray-400">Match data from football-data.org's free API. No scraping, no legal issues.</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3">
            <i className="fa-solid fa-brain text-purple-400 text-sm"></i>
          </div>
          <h4 className="text-sm font-medium text-white mb-1">2. AI Analysis</h4>
          <p className="text-xs text-gray-400">Dixon-Coles + Poisson models predict match outcomes with confidence scores.</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
            <i className="fa-solid fa-chart-simple text-emerald-400 text-sm"></i>
          </div>
          <h4 className="text-sm font-medium text-white mb-1">3. Public Record</h4>
          <p className="text-xs text-gray-400">Every prediction is tracked. Full transparency — you see our wins and losses.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sublabel, color }: { icon: string; label: string; value: string; sublabel: string; color: string }) {
  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  };
  const c = colorClasses[color] || colorClasses.emerald;

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.border} border flex items-center justify-center mb-2`}>
        <i className={`fa-solid ${icon} ${c.text} text-sm`}></i>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
      <p className="text-[10px] text-gray-600">{sublabel}</p>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const styles: Record<string, string> = {
    HIGH: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    DRAW_ALERT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    LOW: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${styles[confidence] || styles.LOW}`}>
      {confidence.replace('_', ' ')}
    </span>
  );
}

function getTimeUntil(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}
