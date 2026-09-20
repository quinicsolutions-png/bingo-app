export function Recommendations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <i className="fa-solid fa-list-check text-emerald-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Recommendations</h2>
          <p className="text-sm text-gray-400">Prioritized action plan based on feasibility findings</p>
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/20">
        <h3 className="text-base font-semibold text-red-400 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-bolt"></i>
          Immediate Actions (This Week)
        </h3>
        <div className="space-y-3">
          {[
            {
              action: 'Engage a Kenyan gambling lawyer',
              why: 'BCLB and SportPesa ToS issues are existential. Get a formal legal opinion before writing more code.',
              cost: '$200-500',
              effort: '1-2 meetings'
            },
            {
              action: 'Rename the app',
              why: '"SportPesa AI" is a trademark liability. Choose a neutral name (JackpotIQ, PredictAI, BetBrain).',
              cost: '$0',
              effort: '1 hour'
            },
            {
              action: 'Start 12-tester recruitment',
              why: 'Play Store requires 12 testers for 14 days. This is the longest unavoidable delay. Start NOW.',
              cost: '$0',
              effort: 'Ongoing'
            },
            {
              action: 'Review SportPesa ToS in detail',
              why: 'Determine if scraping is prohibited. If yes, pivot to licensed data provider immediately.',
              cost: '$0',
              effort: '2-3 hours'
            },
            {
              action: 'Register Play Console developer account',
              why: 'Account setup + app creation takes time. Start the process while legal review happens.',
              cost: '$25 (one-time)',
              effort: '1 hour'
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3">
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.why}</p>
                <div className="flex gap-3 mt-1.5">
                  <span className="text-[10px] text-gray-500">Cost: {item.cost}</span>
                  <span className="text-[10px] text-gray-500">Effort: {item.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Short-term Actions */}
      <div className="bg-amber-500/5 rounded-xl p-5 border border-amber-500/20">
        <h3 className="text-base font-semibold text-amber-400 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-calendar-week"></i>
          Short-term Actions (Weeks 2-4)
        </h3>
        <div className="space-y-3">
          {[
            {
              action: 'Define revenue model',
              why: 'Cannot assess financial viability without knowing how the app makes money. Evaluate freemium, subscription, and ads.',
              cost: '$0',
              effort: '1 week'
            },
            {
              action: 'Build ML baseline model',
              why: 'Validate that odds-implied probabilities outperform random. This is the minimum viable prediction.',
              cost: '$0',
              effort: '1-2 weeks'
            },
            {
              action: 'Contract licensed data provider',
              why: 'If SportPesa ToS forbids scraping, you need API-Football or Sportradar. Sign contract before building data pipeline.',
              cost: '$0-50/month',
              effort: '1 week'
            },
            {
              action: 'Write and host legal pages',
              why: 'Privacy policy and Terms of Service are required by Play Store. Host on GitHub Pages or similar.',
              cost: '$0',
              effort: '2-3 days'
            },
            {
              action: 'Develop MVP (4 screens)',
              why: 'Technical development can proceed in parallel with legal work. Build the 4 screens with mock data.',
              cost: '$0',
              effort: '3 weeks'
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{item.action}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.why}</p>
                <div className="flex gap-3 mt-1.5">
                  <span className="text-[10px] text-gray-500">Cost: {item.cost}</span>
                  <span className="text-[10px] text-gray-500">Effort: {item.effort}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chess text-blue-400"></i>
          Strategic Recommendations
        </h3>
        <div className="space-y-4">
          {[
            {
              title: 'Start with a "prediction accuracy" proof of concept',
              detail: 'Before building the full app, spend 1 week validating that your ML model can predict jackpot results better than random chance (33% for 1/X/2). If it cannot, the entire value proposition fails. This is a cheap experiment that saves months of wasted development.',
              priority: 'HIGH'
            },
            {
              title: 'Consider a web app first (bypass Play Store)',
              detail: 'A Progressive Web App (PWA) avoids Play Store gambling policy issues entirely. Users access it via URL. This lets you validate the market before investing in native app development. Flutter can target web with minimal changes.',
              priority: 'MEDIUM'
            },
            {
              title: 'Build the "track record" feature first',
              detail: 'The most compelling feature is a public history of predictions with accuracy scores. This builds trust and differentiates from tipsters who hide losses. Prioritize this over the combination slip generator.',
              priority: 'HIGH'
            },
            {
              title: 'Plan for a pivot if legal issues block launch',
              detail: 'If BCLB registration is required and too expensive, or if data access is denied, consider pivoting to: (a) a general football stats app, (b) a prediction aggregator (curating free sources), or (c) a different market (non-Kenya).',
              priority: 'MEDIUM'
            },
            {
              title: 'Budget $1,000-2,000 for legal costs',
              detail: 'The blueprint underestimates legal costs. A proper legal review in Kenya for a gambling-adjacent app will cost $500-2,000. This is a necessary investment, not optional.',
              priority: 'HIGH'
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.priority}
                </span>
                <h4 className="text-sm font-medium text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revised Timeline */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-calendar-days text-emerald-400"></i>
          Recommended Revised Timeline
        </h3>
        <div className="space-y-2">
          {[
            { phase: 'Phase 0: Legal & Setup', duration: 'Weeks 1-3', tasks: 'Legal review, app rename, Play Console, tester recruitment, data provider contract' },
            { phase: 'Phase 1: MVP Development', duration: 'Weeks 3-6', tasks: 'Backend API, Flutter app (4 screens), ML baseline model, Hive caching' },
            { phase: 'Phase 2: Integration & Testing', duration: 'Weeks 6-8', tasks: 'Connect app to real data, closed testing with 12 testers, bug fixes' },
            { phase: 'Phase 3: Launch Prep', duration: 'Weeks 8-10', tasks: 'Play Store submission, legal pages, analytics setup, responsible gambling features' },
            { phase: 'Phase 4: Production Launch', duration: 'Weeks 10-12', tasks: 'Staged rollout (5% → 20% → 50% → 100%), monitoring, user feedback' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-emerald-400">{i}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{item.phase}</p>
                  <span className="text-xs text-emerald-400">{item.duration}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{item.tasks}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/20">
          <p className="text-xs text-emerald-400">
            <strong>Realistic total: 10-12 weeks</strong> to production launch. This accounts for legal review, 
            Play Store testing requirements, and development time running in parallel.
          </p>
        </div>
      </div>

      {/* Final Note */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700">
        <p className="text-sm text-gray-300 leading-relaxed">
          <strong className="text-white">Bottom line:</strong> This is a well-planned project with a sound technical foundation 
          operating in a large, real market. The blueprint is one of the most thorough I've reviewed. However, the 
          legal and regulatory risks are not optional — they can kill the project entirely. The single most important 
          action is to <strong className="text-amber-400">get legal clarity this week</strong> before investing more time in development. 
          If the legal path is clear, this project has strong potential. If it's blocked, pivot quickly to avoid 
          sunk cost fallacy.
        </p>
      </div>
    </div>
  );
}
