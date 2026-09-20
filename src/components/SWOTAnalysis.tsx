export function SWOTAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
          <i className="fa-solid fa-bullseye text-blue-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">SWOT Analysis</h2>
          <p className="text-sm text-gray-400">Strategic assessment of the SportPesa AI project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <i className="fa-solid fa-arrow-up text-emerald-400 text-sm"></i>
            </div>
            <h3 className="text-base font-semibold text-emerald-400">Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              'Excellent blueprint documentation — all decisions recorded, gaps identified',
              'Proven, mature tech stack (Flutter + FastAPI) with large community support',
              'Low infrastructure costs (~$30/month) make it sustainable for solo developer',
              'Clear MVP scope with well-defined non-goals prevents scope creep',
              'Offline-first design (Hive cache) addresses Kenyan data constraints',
              'CI/CD pipeline planned from day one — professional engineering practice',
              'Swahili localization differentiates from English-only competitors',
              'Responsible gambling features show ethical awareness',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-plus text-emerald-500 mt-0.5 text-xs flex-shrink-0"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <i className="fa-solid fa-arrow-down text-red-400 text-sm"></i>
            </div>
            <h3 className="text-base font-semibold text-red-400">Weaknesses</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              'No revenue model defined — cannot assess financial viability',
              'SportPesa data access legality unresolved — existential risk',
              'Trademark infringement risk from using "SportPesa" in app name',
              'ML model accuracy unvalidated — may perform no better than random',
              'No marketing budget or user acquisition strategy',
              '3-week MVP timeline ignores legal and regulatory requirements',
              'Solo developer risk — single point of failure for development and operations',
              'No fallback data provider identified if API-Football fails',
              'Team name/match ID mapping complexity underestimated',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-minus text-red-500 mt-0.5 text-xs flex-shrink-0"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-blue-500/5 rounded-xl p-5 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <i className="fa-solid fa-lightbulb text-blue-400 text-sm"></i>
            </div>
            <h3 className="text-base font-semibold text-blue-400">Opportunities</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              'Kenya\'s sports betting market is $2B+ and growing rapidly',
              'Mobile-first market with high smartphone penetration',
              'Football WhatsApp groups offer viral distribution potential',
              'AI/ML predictions are a differentiator vs. human tipsters',
              'Public track record (history) builds trust over time',
              'Combination slip generator is a unique feature',
              'Expansion to other African markets (Nigeria, Tanzania, Uganda)',
              'Push notifications create engagement and retention loop',
              'Partnership opportunities with betting data providers',
              'Self-improving model (v3) creates competitive moat over time',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-star text-blue-500 mt-0.5 text-xs flex-shrink-0"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="bg-amber-500/5 rounded-xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <i className="fa-solid fa-bolt text-amber-400 text-sm"></i>
            </div>
            <h3 className="text-base font-semibold text-amber-400">Threats</h3>
          </div>
          <ul className="space-y-2.5">
            {[
              'BCLB enforcement action could shut down the app entirely',
              'SportPesa could issue cease & desist for data scraping',
              'Google Play could reject or remove the app (gambling policy)',
              'Free alternatives (websites, Telegram) reduce willingness to pay',
              'Kenyan government could tighten gambling regulations further',
              'Data provider (API-Football) could change pricing or shut down',
              'Competitors with more resources could copy the concept',
              'Model inaccuracy damages reputation and drives users away',
              'User data breach could trigger ODPC penalties',
              'Economic downturn reduces disposable income for betting',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-bolt text-amber-500 mt-0.5 text-xs flex-shrink-0"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Implications */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Strategic Implications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <p className="text-xs font-medium text-emerald-400 mb-2">SO Strategies (Use strengths to capture opportunities)</p>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>• Leverage low costs + large market to achieve profitability with small user base</li>
              <li>• Use excellent documentation to attract collaborators/investors</li>
              <li>• Deploy Swahili localization to capture underserved segment</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <p className="text-xs font-medium text-amber-400 mb-2">WT Strategies (Minimize weaknesses to avoid threats)</p>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>• Resolve legal issues before launch to avoid BCLB/Play Store threats</li>
              <li>• Define revenue model to ensure financial sustainability</li>
              <li>• Validate ML model accuracy to prevent reputation damage</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <p className="text-xs font-medium text-blue-400 mb-2">ST Strategies (Use strengths to counter threats)</p>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>• Use offline-first design to reduce dependency on data connectivity</li>
              <li>• Use responsible gambling features to preempt regulatory action</li>
              <li>• Use track record transparency to compete against free alternatives</li>
            </ul>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <p className="text-xs font-medium text-red-400 mb-2">WO Strategies (Fix weaknesses to capture opportunities)</p>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>• Define revenue model to monetize the large addressable market</li>
              <li>• Resolve data access legally to build on the growing market</li>
              <li>• Extend timeline to accommodate legal requirements and reach market</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
