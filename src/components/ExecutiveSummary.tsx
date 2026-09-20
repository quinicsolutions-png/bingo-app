export function ExecutiveSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Executive Summary</h2>
        <p className="text-gray-400 text-sm">
          Comprehensive feasibility assessment of the SportPesa AI prediction app blueprint
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/50 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-amber-400">6.3</span>
              <span className="text-xs text-amber-400/70">/10</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Overall Feasibility: CONDITIONAL GO</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The project is technically sound and financially viable with low operational costs. However, 
              <strong className="text-amber-400"> significant legal and regulatory risks</strong> exist that must be resolved 
              before development begins. The 3-week MVP timeline is achievable for the technical work, but 
              regulatory compliance and Play Store requirements add 3+ weeks of unavoidable delay.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/30">
                ✓ Technically Feasible
              </span>
              <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/30">
                ✓ Financially Viable
              </span>
              <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/30">
                ⚠ Legal Uncertainty
              </span>
              <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs border border-amber-500/30">
                ⚠ Timeline Risk
              </span>
              <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/30">
                ✗ Trademark Conflict
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-check-circle"></i> Key Strengths
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Proven tech stack (Flutter + FastAPI) with low learning curve</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Low infrastructure costs (~$30/month for v0)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Clear MVP scope with well-defined non-goals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Large addressable market (Kenya's sports betting sector)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Excellent blueprint documentation and planning</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation"></i> Critical Blockers
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span><strong>SportPesa ToS</strong> — scraping may violate terms; need legal data source</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span><strong>BCLB registration</strong> — prediction apps may require licensing in Kenya</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span><strong>Trademark</strong> — "SportPesa" in app name is a legal liability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span><strong>Play Store gambling policy</strong> — prediction apps face scrutiny</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span><strong>Revenue model undefined</strong> — no monetization strategy in blueprint</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recommendation Summary */}
      <div className="bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded-xl p-5 border border-amber-500/20">
        <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb"></i> Recommendation
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed">
          <strong>Proceed with caution.</strong> Begin legal review and data licensing immediately (Week 0). 
          Rename the app to remove "SportPesa" from the brand. Start the 12-tester recruitment process now. 
          Technical development can proceed in parallel, but <strong>do not deploy to production</strong> until 
          legal clearance is obtained. Budget for 8-10 weeks total (not 6) to reach production. 
          Define a revenue model before committing to v1 features.
        </p>
      </div>
    </div>
  );
}
