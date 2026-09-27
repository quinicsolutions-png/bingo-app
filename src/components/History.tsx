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
    .map((week) => Math.round(((week.score ?? 0) / week.totalMatches) * 100));

  if (status === 'loading') {
    return <p className="text-xs text-gray-400">Loading record…</p>;
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
            <p className="text-[10px] text-gray-400">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.totalPredictions}</p>
            <p className="text-[10px] text-gray-400">Predictions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{stats.correctPredictions}</p>
            <p className="text-[10px] text-gray-400">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.weeksTracked}</p>
            <p className="text-[10px] text-gray-400">Weeks</p>
          </div>
        </div>
      </div>

      {chartWeeks.length > 0 && (
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Weekly Accuracy</h3>
        <div className="flex items-end gap-1 h-24">
          {chartWeeks.map((acc, i) => (
            <div key={i} className="flex-1 h-full flex flex-col items-center justify-end gap-0.5">
              <span className="text-[8px] text-gray-500">{acc}%</span>
              <div
                className={`w-full rounded-t ${
                  acc >= 70 ? 'bg-emerald-500' : acc >= 50 ? 'bg-cyan-500' : 'bg-amber-500'
                }`}
                style={{ height: `${acc}%` }}
              ></div>
            </div>
          ))}
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
                <p className="text-[9px] text-gray-500">
                  {week.settledAt ? new Date(week.settledAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-emerald-400">{week.score}/{week.totalMatches}</p>
                <p className="text-[9px] text-gray-500">
                  {week.score !== null ? Math.round((week.score / week.totalMatches) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
              {week.matches.map((match, i) => (
                <div
                  key={i}
                  className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                    !match.result
                      ? 'bg-gray-500/10 text-gray-500'
                      : match.result.correct
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
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
        <p className="text-[10px] text-gray-400 leading-relaxed">
          <i className="fa-solid fa-shield-halved text-emerald-400 mr-1"></i>
          <strong className="text-white">Full Transparency:</strong> Every prediction is recorded before kickoff.
          Settled weeks are appended and are not rewritten.
        </p>
      </div>
    </div>
  );
}
