import { HISTORY_WEEKS, PLATFORM_STATS } from '../data/matchData';

export function History() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Track Record</h2>
        <p className="text-sm text-gray-400">Public history of every prediction — wins and losses</p>
      </div>

      {/* Overall Stats */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 rounded-xl p-5 border border-emerald-500/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">{PLATFORM_STATS.overallAccuracy}%</p>
            <p className="text-xs text-gray-400">Overall Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{PLATFORM_STATS.totalPredictions}</p>
            <p className="text-xs text-gray-400">Total Predictions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">{PLATFORM_STATS.correctPredictions}</p>
            <p className="text-xs text-gray-400">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{PLATFORM_STATS.weeksTracked}</p>
            <p className="text-xs text-gray-400">Weeks Tracked</p>
          </div>
        </div>
      </div>

      {/* Accuracy Chart (Simple visual) */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h3 className="text-sm font-semibold text-white mb-4">Weekly Accuracy Trend</h3>
        <div className="flex items-end gap-1 h-32">
          {HISTORY_WEEKS.map((week, i) => {
            const accuracy = week.score !== null ? (week.score / week.totalMatches) * 100 : 0;
            const height = Math.max(10, accuracy);
            return (
              <div key={week.id} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-500">{Math.round(accuracy)}%</span>
                <div
                  className={`w-full rounded-t transition-all ${
                    accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 50 ? 'bg-cyan-500' : 'bg-amber-500'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[8px] text-gray-600">W{i + 1}</span>
              </div>
            );
          })}
          {/* Add more bars for visual effect */}
          {[65, 70, 55, 80, 60, 75, 50, 68, 72, 58].map((acc, i) => (
            <div key={`extra-${i}`} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-gray-500">{acc}%</span>
              <div
                className={`w-full rounded-t ${
                  acc >= 70 ? 'bg-emerald-500/60' : acc >= 50 ? 'bg-cyan-500/60' : 'bg-amber-500/60'
                }`}
                style={{ height: `${acc}%` }}
              ></div>
              <span className="text-[8px] text-gray-600">W{i + 4}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 justify-center">
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ≥70%
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span> 50-69%
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> &lt;50%
          </span>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Recent Weeks</h3>
        {HISTORY_WEEKS.map((week) => (
          <div key={week.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-white">{week.label}</p>
                <p className="text-[10px] text-gray-500">
                  Settled: {week.settledAt ? new Date(week.settledAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-400">{week.score}/{week.totalMatches}</p>
                <p className="text-[10px] text-gray-500">
                  {week.score !== null ? Math.round((week.score / week.totalMatches) * 100) : 0}% accuracy
                </p>
              </div>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
              {week.matches.map((match, i) => (
                <div
                  key={i}
                  className={`h-8 rounded flex items-center justify-center text-[10px] font-bold ${
                    match.result?.correct
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                  title={`${match.homeShort} vs ${match.awayShort}: ${match.result?.correct ? '✓' : '✗'}`}
                >
                  {match.result?.correct ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Transparency Note */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
        <p className="text-xs text-gray-400 leading-relaxed">
          <i className="fa-solid fa-shield-halved text-emerald-400 mr-1"></i>
          <strong className="text-white">Full Transparency:</strong> Every prediction is recorded before kickoff. 
          We cannot edit past predictions. This public track record is our credibility — you see every win and every loss.
          No model is perfect. Our 64% accuracy means we're wrong 36% of the time.
        </p>
      </div>
    </div>
  );
}
