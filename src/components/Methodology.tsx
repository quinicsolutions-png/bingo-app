import { RULES } from '../data/matchData';

export function Methodology() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Methodology</h2>
        <p className="text-sm text-gray-400">How our AI predictions work — fully transparent</p>
      </div>

      {/* Model Overview */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-4">Prediction Pipeline</h3>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {[
            { step: '1', title: 'Data Collection', desc: 'football-data.org free API', icon: 'fa-database', color: 'cyan' },
            { step: '2', title: 'Feature Engineering', desc: 'Form, H2H, stats, context', icon: 'fa-gears', color: 'purple' },
            { step: '3', title: 'Dixon-Coles Model', desc: 'Bivariate Poisson + correlation', icon: 'fa-brain', color: 'emerald' },
            { step: '4', title: 'Output', desc: 'Probabilities + confidence', icon: 'fa-chart-pie', color: 'amber' },
          ].map((item, i) => (
            <div key={i} className="flex-1 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className={`w-8 h-8 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center mb-2`}>
                <i className={`fa-solid ${item.icon} text-${item.color}-400 text-sm`}></i>
              </div>
              <p className="text-xs font-medium text-white">Step {item.step}: {item.title}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dixon-Coles Explanation */}
      <div className="bg-gradient-to-br from-emerald-500/5 to-transparent rounded-xl p-5 border border-emerald-500/20">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <i className="fa-solid fa-flask text-emerald-400"></i>
          Dixon-Coles Model
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          The Dixon-Coles model (1994) is the gold standard for football match prediction. It models the number of goals 
          scored by each team as a <strong>bivariate Poisson distribution</strong>, accounting for the correlation between 
          home and away scoring (e.g., a defensive game affects both teams).
        </p>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          <p className="text-gray-500 mb-1">// Simplified Dixon-Coles probability</p>
          <p>P(Home=i, Away=j) = τ(i,j) × [λ<sub>home</sub><sup>i</sup> × e<sup>-λ<sub>home</sub></sup> / i!] × [λ<sub>away</sub><sup>j</sup> × e<sup>-λ<sub>away</sub></sup> / j!]</p>
          <p className="mt-2 text-gray-500">// Where:</p>
          <p>λ<sub>home</sub> = attack<sub>home</sub> × defense<sub>away</sub> × home_advantage</p>
          <p>λ<sub>away</sub> = attack<sub>away</sub> × defense<sub>home</sub></p>
          <p>τ(i,j) = correction factor for low-scoring correlation</p>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          <strong>Open-source reference:</strong>{' '}
          <a href="https://github.com/DOsinga/football_predictions" className="text-emerald-400 hover:underline">
            DOsinga/football_predictions
          </a>{' '}
          (MIT License)
        </p>
      </div>

      {/* Rules/Features */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-white">Prediction Rules & Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {RULES.map((rule) => (
            <div key={rule.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={rule.category} />
                  <h4 className="text-sm font-medium text-white">{rule.name}</h4>
                </div>
                <span className="text-xs text-emerald-400 font-bold">{Math.round(rule.hitRate * 100)}%</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">{rule.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${rule.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-500">n={rule.sampleSize.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Tiers */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-4">Confidence Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { tier: 'HIGH', threshold: '≥55%', desc: 'Strong signal, model very confident', color: 'emerald', example: 'Top team vs. relegation zone at home' },
            { tier: 'MEDIUM', threshold: '42-54%', desc: 'Moderate signal, reasonable confidence', color: 'cyan', example: 'Mid-table team with good form' },
            { tier: 'DRAW_ALERT', threshold: 'Draw ≥30%', desc: 'Tight match, draw likely', color: 'amber', example: 'Two evenly-matched top teams' },
            { tier: 'LOW', threshold: '<42%', desc: 'Weak signal, high uncertainty', color: 'gray', example: 'Unpredictable matchup, many variables' },
          ].map((item) => (
            <div key={item.tier} className={`rounded-lg p-3 border ${
              item.color === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20' :
              item.color === 'cyan' ? 'bg-cyan-500/5 border-cyan-500/20' :
              item.color === 'amber' ? 'bg-amber-500/5 border-amber-500/20' :
              'bg-gray-800/50 border-gray-700/50'
            }`}>
              <p className={`text-xs font-bold mb-1 ${
                item.color === 'emerald' ? 'text-emerald-400' :
                item.color === 'cyan' ? 'text-cyan-400' :
                item.color === 'amber' ? 'text-amber-400' :
                'text-gray-400'
              }`}>{item.tier}</p>
              <p className="text-[10px] text-gray-400 mb-1">{item.threshold}</p>
              <p className="text-[10px] text-gray-500 mb-2">{item.desc}</p>
              <p className="text-[9px] text-gray-600 italic">e.g. {item.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/20">
        <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation"></i>
          Known Limitations
        </h3>
        <ul className="space-y-1.5 text-xs text-gray-300">
          <li>• Model does not account for last-minute injuries or lineup changes</li>
          <li>• Red cards, penalties, and own goals are inherently unpredictable</li>
          <li>• "Derby effect" — local derbies often defy statistical predictions</li>
          <li>• End-of-season motivation varies wildly between teams</li>
          <li>• Weather, travel fatigue, and referee tendencies are not modeled</li>
          <li>• Historical accuracy of ~64% means 36% of predictions are WRONG</li>
        </ul>
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    form: 'bg-blue-500/20 text-blue-400',
    h2h: 'bg-purple-500/20 text-purple-400',
    stats: 'bg-emerald-500/20 text-emerald-400',
    context: 'bg-amber-500/20 text-amber-400',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${styles[category] || styles.stats}`}>
      {category.toUpperCase()}
    </span>
  );
}
