import { useState } from 'react';
import { useBingoData } from '../data/api';
import { Match } from '../data/matchData';

export function Predictions() {
  const { status, data } = useBingoData();
  const [filter, setFilter] = useState<'all' | 'HIGH' | 'MEDIUM' | 'DRAW_ALERT'>('all');
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const week = data?.week ?? null;
  const matches = week?.matches ?? [];

  const filteredMatches = filter === 'all'
    ? matches
    : matches.filter(m => m.prediction?.confidence === filter);

  if (status === 'loading') {
    return <p className="text-xs text-gray-400">Loading predictions…</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">AI Predictions</h2>
        <p className="text-xs text-gray-400">{week?.label ?? 'Waiting for the next slate'}</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'HIGH', 'MEDIUM', 'DRAW_ALERT'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
        <span className="text-[10px] text-gray-500 ml-auto">{filteredMatches.length} matches</span>
      </div>

      {/* Match Cards */}
      <div className="space-y-2">
        {filteredMatches.length === 0 && (
          <p className="text-xs text-gray-400">No matches in this slate yet.</p>
        )}
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
      <div className="bg-amber-500/5 rounded-xl p-3 border border-amber-500/20">
        <p className="text-[10px] text-amber-400/80 leading-relaxed">
          <i className="fa-solid fa-circle-info mr-1"></i>
          <strong>Disclaimer:</strong> Statistical predictions only. Not guarantees. Never risk money you cannot afford to lose.
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
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <button onClick={onToggle} className="w-full p-3 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-base">{match.leagueIcon}</span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {match.homeTeam} <span className="text-gray-500">vs</span> {match.awayTeam}
              </p>
              <p className="text-[9px] text-gray-500">{match.league} • {timeStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-400">
                {pred.pick === '1' ? match.homeShort : pred.pick === '2' ? match.awayShort : 'Draw'}
              </p>
              <p className="text-[9px] text-gray-500">{Math.round(pred.confidenceScore * 100)}%</p>
            </div>
            <ConfidencePill confidence={pred.confidence} />
            <i className={`fa-solid fa-chevron-down text-gray-500 text-[10px] transition-transform ${expanded ? 'rotate-180' : ''}`}></i>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mt-2 flex items-center gap-0.5 h-1.5 rounded-full overflow-hidden bg-gray-800">
          <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${pred.home * 100}%` }}></div>
          <div className="h-full bg-gray-500" style={{ width: `${pred.draw * 100}%` }}></div>
          <div className="h-full bg-cyan-500 rounded-r-full" style={{ width: `${pred.away * 100}%` }}></div>
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[8px] text-gray-500">{match.homeShort} {Math.round(pred.home * 100)}%</span>
          <span className="text-[8px] text-gray-500">Draw {Math.round(pred.draw * 100)}%</span>
          <span className="text-[8px] text-gray-500">{match.awayShort} {Math.round(pred.away * 100)}%</span>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-800 p-3 bg-gray-800/20">
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Model Reasoning</p>
              <p className="text-[10px] text-gray-300 leading-relaxed">{pred.reasoning}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-800/50 rounded p-2 text-center">
                <p className="text-[9px] text-gray-500">Algorithm</p>
                <p className="text-[10px] text-emerald-400 font-bold">{pred.model.split(' ')[0]}</p>
              </div>
              <div className="bg-gray-800/50 rounded p-2 text-center">
                <p className="text-[9px] text-gray-500">Confidence</p>
                <p className="text-[10px] text-emerald-400 font-bold">{Math.round(pred.confidenceScore * 100)}%</p>
              </div>
              <div className="bg-gray-800/50 rounded p-2 text-center">
                <p className="text-[9px] text-gray-500">Pick</p>
                <p className="text-[10px] text-emerald-400 font-bold">{pred.pick === '1' ? 'Home' : pred.pick === '2' ? 'Away' : 'Draw'}</p>
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
    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${styles[confidence] || styles.LOW}`}>
      {confidence.replace('_', ' ')}
    </span>
  );
}
