import { useState } from 'react';
import { ACTIVE_WEEK, Match } from '../data/matchData';

export function Predictions() {
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MEDIUM' | 'DRAW_ALERT'>('all');
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const filteredMatches = filter === 'all'
    ? ACTIVE_WEEK.matches
    : ACTIVE_WEEK.matches.filter(m => m.prediction?.confidence === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">AI Predictions</h2>
        <p className="text-sm text-gray-400">{ACTIVE_WEEK.label} • {ACTIVE_WEEK.matches.length} matches</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {(['all', 'HIGH', 'MEDIUM', 'DRAW_ALERT'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-auto">{filteredMatches.length} matches</span>
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {filteredMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            expanded={expandedMatch === match.id}
            onToggle={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20">
        <p className="text-xs text-amber-400/80 leading-relaxed">
          <i className="fa-solid fa-circle-info mr-1"></i>
          <strong>Disclaimer:</strong> These are statistical predictions based on mathematical models. They are NOT guarantees. 
          Football is inherently unpredictable. Never risk money you cannot afford to lose. This is not gambling advice.
        </p>
      </div>
    </div>
  );
}

function MatchCard({ match, expanded, onToggle }: { match: Match; expanded: boolean; onToggle: () => void }) {
  const pred = match.prediction;
  if (!pred) return null;

  const kickoffDate = new Date(match.kickoff);
  const timeStr = kickoffDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
      <button onClick={onToggle} className="w-full p-4 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-lg">{match.leagueIcon}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {match.homeTeam} <span className="text-gray-500 font-normal">vs</span> {match.awayTeam}
              </p>
              <p className="text-[10px] text-gray-500">{match.league} • {timeStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-400">
                {pred.pick === '1' ? match.homeShort : pred.pick === '2' ? match.awayShort : 'Draw'}
              </p>
              <p className="text-[10px] text-gray-500">{Math.round(pred.confidenceScore * 100)}%</p>
            </div>
            <ConfidencePill confidence={pred.confidence} />
            <i className={`fa-solid fa-chevron-down text-gray-500 text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}></i>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mt-3 flex items-center gap-1 h-2 rounded-full overflow-hidden bg-gray-800">
          <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${pred.home * 100}%` }}></div>
          <div className="h-full bg-gray-500" style={{ width: `${pred.draw * 100}%` }}></div>
          <div className="h-full bg-cyan-500 rounded-r-full" style={{ width: `${pred.away * 100}%` }}></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-500">{match.homeShort} {Math.round(pred.home * 100)}%</span>
          <span className="text-[10px] text-gray-500">Draw {Math.round(pred.draw * 100)}%</span>
          <span className="text-[10px] text-gray-500">{match.awayShort} {Math.round(pred.away * 100)}%</span>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-800 p-4 bg-gray-800/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">Model Reasoning</p>
              <p className="text-xs text-gray-300 leading-relaxed">{pred.reasoning}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-2">Model Details</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-300">Algorithm: <span className="text-emerald-400">{pred.model}</span></p>
                <p className="text-xs text-gray-300">Confidence: <span className="text-emerald-400">{Math.round(pred.confidenceScore * 100)}%</span></p>
                <p className="text-xs text-gray-300">Pick: <span className="text-emerald-400">{pred.pick === '1' ? 'Home Win' : pred.pick === '2' ? 'Away Win' : 'Draw'}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfidencePill({ confidence }: { confidence: string }) {
  const styles: Record<string, string> = {
    HIGH: 'bg-emerald-500/20 text-emerald-400',
    MEDIUM: 'bg-cyan-500/20 text-cyan-400',
    DRAW_ALERT: 'bg-amber-500/20 text-amber-400',
    LOW: 'bg-gray-500/20 text-gray-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[confidence] || styles.LOW}`}>
      {confidence.replace('_', ' ')}
    </span>
  );
}
