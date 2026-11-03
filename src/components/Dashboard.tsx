import { useBingoData } from '../data/api';
import { statsFromWeeks } from '../data/matchData';

interface Props {
  onNavigate: (page: 'dashboard' | 'predictions' | 'history' | 'settings') => void;
}

export function Dashboard({ onNavigate }: Props) {
  const { status, data } = useBingoData();
  if (status === 'loading') {
    return <p className="text-xs text-gray-400">Loading slate…</p>;
  }
  const week = data?.week ?? null;
  if (!week) {
    return (
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h2 className="text-sm font-bold text-white">No slate yet</h2>
        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
          The next matches will appear here after GitHub Actions publishes the slate.
        </p>
      </div>
    );
  }
  const stats = statsFromWeeks(data?.weeks ?? [], week);
  const timeUntilCutoff = getTimeUntil(week.cutoffTime);

  return (
    <div className="space-y-4">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-cyan-500/5 rounded-2xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">This Week</p>
            <h2 className="text-lg font-bold text-white mt-0.5">{week.label}</h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{week.matches.length}</p>
            <p className="text-[10px] text-gray-400">matches</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-amber-400 text-xs"></i>
            <span className="text-xs text-gray-300">{timeUntilCutoff === 'passed' ? 'Cutoff ' : 'Cutoff in '}<strong className="text-amber-400">{timeUntilCutoff}</strong></span>
          </div>
          <button
            onClick={() => onNavigate('predictions')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-md"
          >
            View Picks <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon="fa-bullseye"
          label="Accuracy"
          value={formatPercent(stats.overallAccuracy)}
          sublabel={stats.totalPredictions ? `${stats.correctPredictions}/${stats.totalPredictions}` : 'No settled picks'}
          color="emerald"
        />
        <StatCard
          icon="fa-fire"
          label="High Confidence"
          value={formatPercent(stats.highConfidenceAccuracy)}
          sublabel="When model is sure"
          color="amber"
        />
        <StatCard
          icon="fa-calendar-check"
          label="Weeks Tracked"
          value={stats.weeksTracked.toString()}
          sublabel="Public record"
          color="cyan"
        />
        <StatCard
          icon="fa-trophy"
          label="Leagues"
          value={stats.leaguesCovered.toString()}
          sublabel="Top European"
          color="purple"
        />
      </div>

      {/* Top Picks */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Picks</h3>
          <button onClick={() => onNavigate('predictions')} className="text-[10px] text-emerald-400 font-medium">
            See all →
          </button>
        </div>
        <div className="divide-y divide-gray-800/50">
          {week.matches.slice(0, 5).map((match) => (
            <div key={match.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{match.leagueIcon}</span>
                <div>
                  <p className="text-xs text-white font-medium">
                    {match.homeShort} <span className="text-gray-500">vs</span> {match.awayShort}
                  </p>
                  <p className="text-[9px] text-gray-500">{match.league}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {match.prediction ? (
                  <>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">
                        {match.prediction.pick === '1' ? match.homeShort : match.prediction.pick === '2' ? match.awayShort : 'Draw'}
                      </p>
                      <p className="text-[9px] text-gray-500">
                        {Math.round(match.prediction.confidenceScore * 100)}%
                      </p>
                    </div>
                    <ConfidenceBadge confidence={match.prediction.confidence} />
                  </>
                ) : (
                  <span className="text-[9px] text-gray-500">
                    {match.odds ? `${match.dataSource ?? 'Uploaded'} odds` : 'Uploaded fixture'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Install Banner */}
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-download text-emerald-400"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-white">Install Bingo App</h4>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
              Add to your home screen for instant access. Works offline. No app store needed.
            </p>
          </div>
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
    <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
      <div className={`w-7 h-7 rounded-lg ${c.bg} ${c.border} border flex items-center justify-center mb-2`}>
        <i className={`fa-solid ${icon} ${c.text} text-xs`}></i>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[9px] text-gray-500">{label}</p>
      <p className="text-[9px] text-gray-600">{sublabel}</p>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const styles: Record<string, string> = {
    HIGH: 'bg-emerald-500/20 text-emerald-400',
    MEDIUM: 'bg-cyan-500/20 text-cyan-400',
    DRAW_ALERT: 'bg-amber-500/20 text-amber-400',
    LOW: 'bg-gray-500/20 text-gray-400',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${styles[confidence] || styles.LOW}`}>
      {confidence.replace('_', ' ')}
    </span>
  );
}

function formatPercent(value: number | null): string {
  return value == null ? '—' : `${value}%`;
}

function getTimeUntil(isoDate: string): string {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) return 'passed';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
