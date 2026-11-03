import { ArrowRight, CalendarCheck, Clock, Flame, Target, Trophy } from 'lucide-react';
import { useBingoData } from '../data/api';
import { statsFromWeeks } from '../data/matchData';

interface Props {
  onNavigate: (page: 'dashboard' | 'predictions' | 'history' | 'settings') => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function Dashboard({ onNavigate, onRefresh, refreshing }: Props) {
  const { status, data } = useBingoData();
  if (status === 'loading') {
    return (
      <div className="space-y-4" aria-label="Loading dashboard">
        <div className="h-28 rounded-2xl bg-gray-900 animate-pulse border border-gray-800" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
          <div className="h-24 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
          <div className="h-24 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
          <div className="h-24 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
        </div>
        <div className="h-44 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
      </div>
    );
  }
  const week = data?.week ?? null;
  if (!week) {
    return (
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 text-center">
        <Target className="w-8 h-8 text-emerald-400/60 mx-auto" aria-hidden />
        <h2 className="text-sm font-bold text-white mt-3">No slate yet</h2>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed max-w-xs mx-auto">
          The next matches will appear here after GitHub Actions publishes the slate.
          Data refreshes automatically every 30 minutes.
        </p>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="mt-4 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 disabled:opacity-50 transition-colors"
        >
          {refreshing ? 'Checking…' : 'Check for updates'}
        </button>
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
            <p className="text-[11px] text-gray-400">matches</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden />
            <span className="text-xs text-gray-300">{timeUntilCutoff === 'passed' ? 'Cutoff ' : 'Cutoff in '}<strong className="text-amber-400">{timeUntilCutoff}</strong></span>
          </div>
          <button
            onClick={() => onNavigate('predictions')}
            className="flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-md"
          >
            View Picks <ArrowRight className="w-3 h-3 ml-1" aria-hidden />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Target}
          label="Accuracy"
          value={formatPercent(stats.overallAccuracy)}
          sublabel={stats.totalPredictions ? `${stats.correctPredictions}/${stats.totalPredictions}` : 'No settled picks'}
          color="emerald"
        />
        <StatCard
          icon={Flame}
          label="High Confidence"
          value={formatPercent(stats.highConfidenceAccuracy)}
          sublabel="When model is sure"
          color="amber"
        />
        <StatCard
          icon={CalendarCheck}
          label="Weeks Tracked"
          value={stats.weeksTracked.toString()}
          sublabel="Public record"
          color="cyan"
        />
        <StatCard
          icon={Trophy}
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
          <button onClick={() => onNavigate('predictions')} className="text-[11px] text-emerald-400 font-medium">
            See all →
          </button>
        </div>
        <div className="divide-y divide-gray-800/50">
          {week.matches.slice(0, 5).map((match) => (
            <div key={match.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm">{match.leagueIcon}</span>
                <div className="min-w-0">
                  <p className="text-xs text-white font-medium truncate">
                    {match.homeShort} <span className="text-gray-500">vs</span> {match.awayShort}
                  </p>
                  <p className="text-[10px] text-gray-400">{match.league}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {match.prediction ? (
                  <>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-400">
                        {match.prediction.pick === '1' ? match.homeShort : match.prediction.pick === '2' ? match.awayShort : 'Draw'}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {Math.round(match.prediction.confidenceScore * 100)}%
                      </p>
                    </div>
                    <ConfidenceBadge confidence={match.prediction.confidence} />
                  </>
                ) : (
                  <span className="text-[10px] text-gray-400">
                    {match.odds ? `${match.dataSource ?? 'Uploaded'} odds` : 'Uploaded fixture'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel, color }: { icon: typeof Target; label: string; value: string; sublabel: string; color: string }) {
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
        <Icon className={`w-3.5 h-3.5 ${c.text}`} aria-hidden />
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="text-[10px] text-gray-500">{sublabel}</p>
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
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${styles[confidence] || styles.LOW}`}>
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
