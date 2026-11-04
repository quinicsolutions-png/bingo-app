import { ShieldCheck } from 'lucide-react';
import { useBingoData } from '../data/api';
import { statsFromWeeks } from '../data/matchData';

export function History() {
  const { status, data } = useBingoData();
  const weeks = data?.weeks ?? [];
  const stats = statsFromWeeks(weeks, data?.week ?? null);
  const chartWeeks = weeks
    .filter((week) => week.score !== null && week.totalMatches > 0)
    .slice(0, 12)
    .reverse()
    .map((week) => ({
      label: week.label.replace(/^Week\s*/i, ''),
      accuracy: Math.round(((week.score ?? 0) / week.totalMatches) * 100),
    }));

  if (status === 'loading') {
    return (
      <div className="space-y-4" aria-label="Loading track record">
        <div className="h-28 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
        <div className="h-36 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-900 animate-pulse border border-gray-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Track Record</h2>
        <p className="text-xs text-gray-400">Every prediction — wins and losses</p>
      </div>

      {/* Overall Stats */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 rounded-xl p-4 border border-emerald-500/20">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.overallAccuracy == null ? '—' : `${stats.overallAccuracy}%`}</p>
            <p className="text-[11px] text-gray-400">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalPredictions}</p>
            <p className="text-[11px] text-gray-400">Predictions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{stats.correctPredictions}</p>
            <p className="text-[11px] text-gray-400">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.weeksTracked}</p>
            <p className="text-[11px] text-gray-400">Weeks</p>
          </div>
        </div>
      </div>

      {chartWeeks.length > 0 && (
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Accuracy</h3>
          <span className="text-[10px] text-gray-500">— 50% line</span>
        </div>
        <div className="relative">
          {/* 50% reference line */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-gray-600/70 pointer-events-none"
            style={{ bottom: '50%' }}
            aria-hidden
          />
          <div className="flex items-end gap-1 h-28 relative">
            {chartWeeks.map((week, i) => (
              <div key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-0.5 min-w-0">
                <span className="text-[10px] text-gray-400">{week.accuracy}%</span>
                <div
                  className={`w-full rounded-t ${
                    week.accuracy >= 70 ? 'bg-emerald-500' : week.accuracy >= 50 ? 'bg-cyan-500' : 'bg-amber-500'
                  }`}
                  style={{ height: `${week.accuracy}%` }}
                  title={`${week.label}: ${week.accuracy}%`}
                ></div>
                <span className="text-[10px] text-gray-500 truncate w-full text-center">{week.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Weekly Breakdown */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Weeks</h3>
        {weeks.length === 0 && (
          <p className="text-xs text-gray-400">The public record starts after the first slate settles. No weeks are stored yet.</p>
        )}
        {weeks.map((week) => (
          <div key={week.id} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-medium text-white">{week.label}</p>
                <p className="text-[10px] text-gray-400">
                  {week.settledAt ? new Date(week.settledAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-emerald-400">{week.score}/{week.totalMatches}</p>
                <p className="text-[10px] text-gray-400">
                  {week.score !== null ? Math.round((week.score / week.totalMatches) * 100) : 0}%
                </p>
              </div>
            </div>
            <div
              className="grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(${Math.max(week.matches.length, 1)}, minmax(0, 1fr))` }}
              role="img"
              aria-label={`${week.label}: ${week.score ?? 0} of ${week.totalMatches} correct`}
            >
              {week.matches.map((match, i) => (
                <div
                  key={i}
                  className={`h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                    !match.result
                      ? 'bg-gray-500/10 text-gray-400'
                      : match.result.correct
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                  title={`${match.homeTeam} vs ${match.awayTeam}${match.result ? ` — ${match.result.homeGoals}:${match.result.awayGoals}` : ''}`}
                >
                  {!match.result ? '–' : match.result.correct ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Transparency Note */}
      <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/30">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1 inline-block align-[-2px]" aria-hidden />
          <strong className="text-white">Full Transparency:</strong> Every prediction is recorded before kickoff.
          Settled weeks are appended and are not rewritten.
        </p>
      </div>
    </div>
  );
}
