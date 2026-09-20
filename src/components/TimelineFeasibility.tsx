export function TimelineFeasibility() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <i className="fa-solid fa-clock text-amber-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Timeline Feasibility</h2>
          <p className="text-sm text-gray-400">Score: <span className="text-amber-400 font-semibold">5/10 — MEDIUM-LOW</span></p>
        </div>
      </div>

      {/* Timeline Comparison */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Blueprint Timeline vs. Realistic Timeline</h3>
        <div className="space-y-4">
          {/* Blueprint Timeline */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">BLUEPRINT TIMELINE (6 weeks to production)</p>
            <div className="relative">
              <div className="flex items-center gap-1">
                {['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map((week, i) => (
                  <div key={week} className="flex-1 bg-emerald-500/20 border border-emerald-500/30 rounded px-2 py-1.5 text-center">
                    <p className="text-xs font-medium text-emerald-400">{week}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {i === 0 && 'API + Jackpot'}
                      {i === 1 && 'History + Rules'}
                      {i === 2 && 'Slip + Build'}
                      {i === 3 && 'Testing + Legal'}
                      {i === 4 && 'Bug fixes'}
                      {i === 5 && 'Rollout'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Realistic Timeline */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">REALISTIC TIMELINE (10-14 weeks to production)</p>
            <div className="relative">
              <div className="flex items-center gap-1">
                {[
                  { week: 'W0', label: 'Legal', color: 'red' },
                  { week: 'W1-2', label: 'Legal + Setup', color: 'red' },
                  { week: 'W3-4', label: 'Dev MVP', color: 'emerald' },
                  { week: 'W5-6', label: 'Dev + Test', color: 'emerald' },
                  { week: 'W7-8', label: 'Closed Test', color: 'amber' },
                  { week: 'W9-10', label: 'Fixes + Review', color: 'amber' },
                  { week: 'W11-12', label: 'Rollout', color: 'emerald' },
                ].map((item) => (
                  <div key={item.week} className={`flex-1 rounded px-1 py-1.5 text-center border ${
                    item.color === 'red' ? 'bg-red-500/10 border-red-500/30' :
                    item.color === 'amber' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-emerald-500/10 border-emerald-500/30'
                  }`}>
                    <p className={`text-[10px] font-medium ${
                      item.color === 'red' ? 'text-red-400' :
                      item.color === 'amber' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>{item.week}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Gaps */}
      <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/20">
        <h3 className="text-sm font-semibold text-red-400 mb-3">Why the Blueprint Timeline is Unrealistic</h3>
        <div className="space-y-3">
          {[
            {
              issue: 'No Week 0 for legal work',
              detail: 'The blueprint starts development in Week 1, but legal review (BCLB, SportPesa ToS, trademark) must happen before any code is deployed. This alone adds 2-4 weeks.',
              impact: '+2-4 weeks'
            },
            {
              issue: 'Play Store 12-tester rule',
              detail: 'New personal developer accounts need 12+ testers for 14 continuous days before production release. Recruiting 12 testers takes time, and the 14-day clock cannot be shortened.',
              impact: '+2-3 weeks (minimum)'
            },
            {
              issue: 'Play Store review time',
              detail: 'Google Play review can take 1-7 days for new apps, longer for gambling-adjacent apps. Rejection means resubmission.',
              impact: '+1-2 weeks (if rejected)'
            },
            {
              issue: 'ML model development underestimated',
              detail: 'Training, validating, and deploying a sports prediction model is non-trivial. The blueprint allocates no specific time for this critical component.',
              impact: '+1-2 weeks'
            },
            {
              issue: 'Data integration complexity',
              detail: 'Team name mapping and match ID mapping between SportPesa and API-Football will take longer than expected. Edge cases are numerous.',
              impact: '+1 week'
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3">
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium flex-shrink-0">
                {item.impact}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{item.issue}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Path */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Critical Path Analysis</h3>
        <div className="space-y-2">
          {[
            { task: 'Legal review & data licensing', duration: '2-4 weeks', parallel: false, blocker: true },
            { task: 'Play Console account + tester recruitment', duration: '1-2 weeks', parallel: true, blocker: true },
            { task: 'Backend API development', duration: '2 weeks', parallel: true, blocker: false },
            { task: 'Flutter app development', duration: '3 weeks', parallel: true, blocker: false },
            { task: 'ML model training & validation', duration: '2-3 weeks', parallel: true, blocker: false },
            { task: '14-day closed testing period', duration: '2 weeks', parallel: false, blocker: true },
            { task: 'Play Store review & approval', duration: '1-2 weeks', parallel: false, blocker: true },
            { task: 'Staged rollout', duration: '1 week', parallel: false, blocker: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-2.5">
              <span className="text-xs text-gray-500 w-5 text-center">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm text-white">{item.task}</p>
              </div>
              <span className="text-xs text-gray-400">{item.duration}</span>
              {item.parallel && (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">parallel</span>
              )}
              {item.blocker && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px]">blocker</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            <strong>Critical path duration:</strong> Legal review (4w) → Closed testing (2w) → Play Store review (1w) → Rollout (1w) = <strong>8 weeks minimum</strong>, 
            assuming legal review starts immediately and development runs in parallel.
          </p>
        </div>
      </div>

      {/* Timeline Verdict */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
        <h3 className="text-base font-semibold text-white mb-3">Timeline Verdict</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          The blueprint's 6-week timeline is <strong>not achievable</strong> for a production release. The critical path 
          through legal review, Play Store testing requirements, and review processes extends the realistic timeline 
          to <strong>10-14 weeks</strong>. However, a development build (internal testing) could be ready in 4-5 weeks. 
          The key insight is that legal and regulatory work should start immediately (Week 0), running in parallel 
          with technical development.
        </p>
      </div>
    </div>
  );
}
