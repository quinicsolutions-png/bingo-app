export function TechnicalFeasibility() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <i className="fa-solid fa-microchip text-emerald-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Technical Feasibility</h2>
          <p className="text-sm text-gray-400">Score: <span className="text-emerald-400 font-semibold">8/10 — HIGH</span></p>
        </div>
      </div>

      {/* Assessment */}
      <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
        <p className="text-sm text-gray-300 leading-relaxed">
          The technical architecture is <strong className="text-emerald-400">well-designed and implementable</strong>. The Flutter + FastAPI stack 
          is mature, well-documented, and has a large developer community. The choice of Provider for state management 
          is appropriate for the app's scope. The ML pipeline (XGBoost + Poisson) is proven in sports prediction. 
          The main technical concerns are around data integration complexity and model accuracy validation.
        </p>
      </div>

      {/* Technology Stack Assessment */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white">Technology Stack Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { tech: 'Flutter 3.x', verdict: '✓ Excellent', detail: 'Mature cross-platform framework. Material 3 support. Large community. Good for rapid mobile development.', risk: 'Low' },
            { tech: 'Provider', verdict: '✓ Appropriate', detail: 'Simple state management. Right-sized for 4 screens. Avoids over-engineering.', risk: 'Low' },
            { tech: 'Hive (local cache)', verdict: '✓ Good choice', detail: 'Fast, no native deps, simple API. Well-suited for offline caching of JSON data.', risk: 'Low' },
            { tech: 'FastAPI', verdict: '✓ Excellent', detail: 'Async, automatic docs, Pydantic validation. Python ecosystem for ML integration.', risk: 'Low' },
            { tech: 'XGBoost + Poisson', verdict: '⚠ Viable', detail: 'Proven in sports prediction. Requires careful feature engineering and validation. Model accuracy is unproven for this specific use case.', risk: 'Medium' },
            { tech: 'PostgreSQL', verdict: '✓ Excellent', detail: 'Robust, JSONB support, excellent for structured + semi-structured data.', risk: 'Low' },
            { tech: 'Fly.io', verdict: '✓ Good choice', detail: 'Affordable, easy deploys, global edge. May need to scale if traffic spikes on jackpot days.', risk: 'Low' },
            { tech: 'API-Football', verdict: '⚠ Dependency risk', detail: 'Third-party dependency. Rate limits, pricing changes, or downtime could break the app. Need fallback plan.', risk: 'Medium' },
          ].map((item) => (
            <div key={item.tech} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{item.tech}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {item.risk} risk
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{item.verdict}</p>
              <p className="text-xs text-gray-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Concerns */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white">Technical Concerns & Gaps</h3>
        <div className="space-y-3">
          {[
            {
              severity: 'high',
              title: 'Data Integration Complexity',
              description: 'Team name mapping and match ID mapping between SportPesa and API-Football is a non-trivial engineering challenge. SportPesa may change names/IDs without notice, breaking mappings.',
              mitigation: 'Build a robust alias system with fuzzy matching. Monitor for changes. Consider a manual curation step for critical mappings.'
            },
            {
              severity: 'high',
              title: 'ML Model Validation',
              description: 'The blueprint mentions XGBoost + Poisson but does not specify training data volume, feature set, or validation methodology. Sports prediction models often overfit.',
              mitigation: 'Start with a simple baseline (e.g., odds-implied probabilities). Validate against historical data before adding complexity. Track prediction accuracy weekly.'
            },
            {
              severity: 'medium',
              title: 'Certificate Pinning in Flutter',
              description: 'Certificate pinning adds complexity and can break if certs rotate. If the server cert changes and the app is pinned, all users are locked out.',
              mitigation: 'Use a pin backup strategy. Consider whether the security benefit justifies the operational risk for a v0 app.'
            },
            {
              severity: 'medium',
              title: 'Hive Schema Migration',
              description: 'The blueprint correctly identifies this risk but the mitigation (versioned boxes) leaves orphaned data and increases storage. No rollback strategy.',
              mitigation: 'Implement proper migration with data transformation. Test migration paths in CI. Document the rollback procedure.'
            },
            {
              severity: 'low',
              title: 'Performance at Scale',
              description: 'The blueprint mentions 10k concurrent users on jackpot day but the load testing plan is vague. Fly.io auto-scaling may have cold-start delays.',
              mitigation: 'Set up load testing early. Configure Fly.io auto-scaling with appropriate minimums. Consider caching at the CDN level.'
            },
          ].map((concern, i) => (
            <div key={i} className={`rounded-lg p-4 border ${
              concern.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
              concern.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/20' :
              'bg-gray-800/30 border-gray-700/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${
                  concern.severity === 'high' ? 'bg-red-500' :
                  concern.severity === 'medium' ? 'bg-amber-500' : 'bg-gray-500'
                }`}></span>
                <span className="text-sm font-medium text-white">{concern.title}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{concern.description}</p>
              <p className="text-xs text-emerald-400/80"><strong>Mitigation:</strong> {concern.mitigation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Assessment */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
        <h3 className="text-base font-semibold text-white mb-3">Architecture Verdict</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-emerald-400">✓</div>
            <p className="text-xs text-gray-400 mt-1">Client-server separation is clean</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-emerald-400">✓</div>
            <p className="text-xs text-gray-400 mt-1">API versioning planned correctly</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-400">⚠</div>
            <p className="text-xs text-gray-400 mt-1">ML pipeline needs more detail</p>
          </div>
        </div>
      </div>
    </div>
  );
}
