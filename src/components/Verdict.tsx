export function Verdict() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <i className="fa-solid fa-flag-checkered text-amber-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Final Verdict</h2>
          <p className="text-sm text-gray-400">Go / No-Go / Conditional recommendation</p>
        </div>
      </div>

      {/* Verdict Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent rounded-2xl p-6 border border-amber-500/30">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/40 flex flex-col items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-amber-400 text-3xl mb-2"></i>
              <span className="text-lg font-bold text-amber-400">CONDITIONAL</span>
              <span className="text-sm text-amber-400/70">GO</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">Conditional Go — Proceed with Precautions</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              The project is <strong className="text-emerald-400">technically feasible</strong> and <strong className="text-emerald-400">financially viable</strong> at low cost. 
              The market opportunity is real. However, <strong className="text-red-400">critical legal and regulatory risks</strong> must be 
              resolved before any production deployment. The timeline is more aggressive than achievable.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mt-3">
              <strong className="text-amber-400">The project should proceed</strong> only if the following conditions are met before production launch.
            </p>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Conditions for Go</h3>
        <div className="space-y-3">
          {[
            {
              condition: 'Legal data access confirmed',
              priority: 'MUST',
              detail: 'Written confirmation that data collection complies with SportPesa ToS, OR a contract with a licensed data provider (API-Football, Sportradar).',
              status: 'unresolved'
            },
            {
              condition: 'BCLB compliance determined',
              priority: 'MUST',
              detail: 'Formal legal opinion on whether prediction apps require BCLB registration. If yes, registration must be initiated.',
              status: 'unresolved'
            },
            {
              condition: 'App renamed (trademark cleared)',
              priority: 'MUST',
              detail: 'Remove "SportPesa" from the app name and all branding. Conduct trademark search for new name.',
              status: 'actionable'
            },
            {
              condition: 'Revenue model defined',
              priority: 'SHOULD',
              detail: 'Define how the app generates revenue before investing in v1 features. Freemium, subscription, or ads — pick one.',
              status: 'unresolved'
            },
            {
              condition: '12 testers recruited',
              priority: 'MUST',
              detail: 'Begin recruiting immediately. Without 12 testers for 14 days, the app cannot reach production on Play Store.',
              status: 'actionable'
            },
            {
              condition: 'ML model baseline validated',
              priority: 'SHOULD',
              detail: 'Before launch, validate that the prediction model performs better than random chance on historical data.',
              status: 'unresolved'
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                item.priority === 'MUST' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {item.priority}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{item.condition}</p>
                  <span className={`w-2 h-2 rounded-full ${
                    item.status === 'unresolved' ? 'bg-red-500' : 'bg-amber-500'
                  }`}></span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Framework */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Decision Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/5 rounded-lg p-4 border border-emerald-500/20">
            <p className="text-sm font-semibold text-emerald-400 mb-2">FULL GO if:</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>✓ Legal data access confirmed</li>
              <li>✓ BCLB compliance cleared</li>
              <li>✓ Trademark issue resolved</li>
              <li>✓ 12 testers recruited</li>
              <li>✓ Revenue model defined</li>
            </ul>
          </div>
          <div className="bg-amber-500/5 rounded-lg p-4 border border-amber-500/20">
            <p className="text-sm font-semibold text-amber-400 mb-2">CONDITIONAL GO if:</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>✓ Technical development proceeds</li>
              <li>✓ Legal review initiated</li>
              <li>✓ App renamed</li>
              <li>⚠ Data access uncertain</li>
              <li>⚠ BCLB status unknown</li>
            </ul>
          </div>
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
            <p className="text-sm font-semibold text-red-400 mb-2">NO GO if:</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>✗ SportPesa ToS forbids scraping</li>
              <li>✗ No licensed data provider available</li>
              <li>✗ BCLB requires expensive license</li>
              <li>✗ Play Store rejects the app</li>
              <li>✗ No viable revenue model found</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
        <h3 className="text-base font-semibold text-white mb-4">Dimension Scores Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Technical', score: 8, color: 'emerald' },
            { label: 'Legal', score: 4, color: 'red' },
            { label: 'Financial', score: 7, color: 'emerald' },
            { label: 'Market', score: 6, color: 'amber' },
            { label: 'Operational', score: 7, color: 'emerald' },
            { label: 'Timeline', score: 5, color: 'amber' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <span className="text-sm text-gray-300">{item.label}</span>
              <span className={`text-lg font-bold ${
                item.color === 'emerald' ? 'text-emerald-400' :
                item.color === 'amber' ? 'text-amber-400' :
                'text-red-400'
              }`}>{item.score}/10</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-600">
          <span className="text-sm font-medium text-white">Overall (weighted)</span>
          <span className="text-xl font-bold text-amber-400">6.3/10</span>
        </div>
      </div>
    </div>
  );
}
