export function RiskMatrix() {
  const risks = [
    { id: 1, risk: 'SportPesa ToS violation / cease & desist', likelihood: 'Medium', impact: 'Critical', score: 9, mitigation: 'Use licensed data provider; get legal opinion before launch' },
    { id: 2, risk: 'BCLB requires registration (unplanned cost/delay)', likelihood: 'High', impact: 'High', score: 8, mitigation: 'Get legal opinion early; budget for registration if required' },
    { id: 3, risk: 'Play Store gambling policy rejection', likelihood: 'High', impact: 'High', score: 8, mitigation: 'Review policy; no real-money features; correct category; prepare appeal' },
    { id: 4, risk: 'ML model underperforms (worse than random)', likelihood: 'High', impact: 'Medium', score: 6, mitigation: 'Start with odds-implied baseline; track accuracy; set minimum threshold' },
    { id: 5, risk: '12-tester recruitment fails/delays', likelihood: 'High', impact: 'High', score: 8, mitigation: 'Start recruiting NOW; use WhatsApp groups, Reddit, friends/family' },
    { id: 6, risk: 'API-Football rate limits or price increase', likelihood: 'Medium', impact: 'Medium', score: 5, mitigation: 'Cache aggressively; identify backup data provider' },
    { id: 7, risk: 'Trademark complaint from SportPesa', likelihood: 'Medium', impact: 'High', score: 7, mitigation: 'Rename app immediately; remove all SportPesa branding' },
    { id: 8, risk: 'Backend downtime on jackpot day', likelihood: 'Medium', impact: 'High', score: 7, mitigation: 'Hive cache; retry logic; Fly.io auto-scaling; load test before launch' },
    { id: 9, risk: 'User churn (no retention after first week)', likelihood: 'High', impact: 'Medium', score: 6, mitigation: 'Push notifications; weekly engagement loop; track record builds habit' },
    { id: 10, risk: 'Data provider downtime', likelihood: 'Medium', impact: 'Medium', score: 5, mitigation: 'Fallback provider; cached data; graceful degradation in UI' },
    { id: 11, risk: 'Model drift over time', likelihood: 'High', impact: 'Medium', score: 6, mitigation: 'Weekly accuracy monitoring; scheduled retraining; alerting on degradation' },
    { id: 12, risk: 'Solo developer burnout', likelihood: 'Medium', impact: 'Medium', score: 5, mitigation: 'Scope discipline; cut features ruthlessly; 5-10hr/week maintenance budget' },
  ];

  const getLikelihoodColor = (l: string) => {
    switch (l) {
      case 'High': return 'text-red-400 bg-red-500/10';
      case 'Medium': return 'text-amber-400 bg-amber-500/10';
      case 'Low': return 'text-emerald-400 bg-emerald-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getImpactColor = (i: string) => {
    switch (i) {
      case 'Critical': return 'text-red-400 bg-red-500/20 font-bold';
      case 'High': return 'text-red-400 bg-red-500/10';
      case 'Medium': return 'text-amber-400 bg-amber-500/10';
      case 'Low': return 'text-emerald-400 bg-emerald-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-red-500';
    if (score >= 6) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // Sort by score descending
  const sortedRisks = [...risks].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Risk Matrix</h2>
          <p className="text-sm text-gray-400">12 identified risks, sorted by severity score</p>
        </div>
      </div>

      {/* Risk Heatmap Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20 text-center">
          <p className="text-2xl font-bold text-red-400">3</p>
          <p className="text-xs text-gray-400 mt-1">Critical Risks</p>
          <p className="text-[10px] text-gray-500">Score 8-9</p>
        </div>
        <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/20 text-center">
          <p className="text-2xl font-bold text-amber-400">5</p>
          <p className="text-xs text-gray-400 mt-1">High Risks</p>
          <p className="text-[10px] text-gray-500">Score 6-7</p>
        </div>
        <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20 text-center">
          <p className="text-2xl font-bold text-emerald-400">4</p>
          <p className="text-xs text-gray-400 mt-1">Manageable Risks</p>
          <p className="text-[10px] text-gray-500">Score 4-5</p>
        </div>
      </div>

      {/* Risk Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs">Risk</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium text-xs">Likelihood</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium text-xs">Impact</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium text-xs">Score</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {sortedRisks.map((r) => (
                <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <div className={`w-6 h-6 rounded-full ${getScoreColor(r.score)} flex items-center justify-center`}>
                      <span className="text-[10px] font-bold text-white">{r.score}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-200 text-xs">{r.risk}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${getLikelihoodColor(r.likelihood)}`}>
                      {r.likelihood}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${getImpactColor(r.impact)}`}>
                      {r.impact}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs font-bold text-white">{r.score}/9</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400 max-w-xs">{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Heatmap Visual */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Risk Heatmap</h3>
        <div className="flex items-end gap-1 justify-center">
          {/* Y-axis label */}
          <div className="flex flex-col items-center mr-2">
            <span className="text-[10px] text-gray-500 writing-mode-vertical transform -rotate-0">Impact →</span>
          </div>
          {/* Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 flex-1 max-w-sm">
            {/* Row 1 (Critical impact) */}
            <div className="bg-amber-500/20 rounded p-2 text-center border border-amber-500/20">
              <p className="text-[9px] text-amber-400">ToS Violation</p>
            </div>
            <div className="bg-red-500/20 rounded p-2 text-center border border-red-500/20">
              <p className="text-[9px] text-red-400">BCLB</p>
              <p className="text-[9px] text-red-400">Play Store</p>
            </div>
            <div className="bg-red-500/30 rounded p-2 text-center border border-red-500/30">
              <p className="text-[9px] text-red-400">Testers</p>
            </div>
            {/* Row 2 (High impact) */}
            <div className="bg-emerald-500/10 rounded p-2 text-center border border-emerald-500/20">
              <p className="text-[9px] text-gray-400">Burnout</p>
            </div>
            <div className="bg-amber-500/20 rounded p-2 text-center border border-amber-500/20">
              <p className="text-[9px] text-amber-400">Trademark</p>
              <p className="text-[9px] text-amber-400">Downtime</p>
            </div>
            <div className="bg-amber-500/10 rounded p-2 text-center border border-amber-500/20">
              <p className="text-[9px] text-gray-400">Model</p>
              <p className="text-[9px] text-gray-400">Churn</p>
            </div>
            {/* Row 3 (Medium impact) */}
            <div className="bg-emerald-500/10 rounded p-2 text-center border border-emerald-500/20">
              <p className="text-[9px] text-gray-500">—</p>
            </div>
            <div className="bg-emerald-500/10 rounded p-2 text-center border border-emerald-500/20">
              <p className="text-[9px] text-gray-400">API limits</p>
              <p className="text-[9px] text-gray-400">Data down</p>
            </div>
            <div className="bg-emerald-500/10 rounded p-2 text-center border border-emerald-500/20">
              <p className="text-[9px] text-gray-500">—</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2 max-w-sm mx-auto">
          <span className="text-[10px] text-gray-500">Low</span>
          <span className="text-[10px] text-gray-500">Likelihood →</span>
          <span className="text-[10px] text-gray-500">High</span>
        </div>
      </div>
    </div>
  );
}
