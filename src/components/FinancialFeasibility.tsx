export function FinancialFeasibility() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <i className="fa-solid fa-coins text-emerald-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Financial Feasibility</h2>
          <p className="text-sm text-gray-400">Score: <span className="text-amber-400 font-semibold">7/10 — MEDIUM-HIGH</span></p>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Cost Projection</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400 font-medium">Service</th>
                <th className="text-right py-2 text-gray-400 font-medium">Monthly Cost</th>
                <th className="text-right py-2 text-gray-400 font-medium">Annual Cost</th>
                <th className="text-left py-2 text-gray-400 font-medium pl-4">Notes</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-2.5">Fly.io (backend + DB)</td>
                <td className="text-right">$15–30</td>
                <td className="text-right">$180–360</td>
                <td className="pl-4 text-xs text-gray-500">Scales with traffic</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2.5">Firebase (Analytics + Crash)</td>
                <td className="text-right text-emerald-400">Free</td>
                <td className="text-right text-emerald-400">$0</td>
                <td className="pl-4 text-xs text-gray-500">Free tier sufficient for v0-v1</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2.5">Domain name</td>
                <td className="text-right">$1</td>
                <td className="text-right">$12</td>
                <td className="pl-4 text-xs text-gray-500">.app or .com</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2.5">API-Football (data provider)</td>
                <td className="text-right">$0–50</td>
                <td className="text-right">$0–600</td>
                <td className="pl-4 text-xs text-gray-500">Free tier may suffice for v0</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2.5">Apple Developer (v2)</td>
                <td className="text-right">—</td>
                <td className="text-right">$99</td>
                <td className="pl-4 text-xs text-gray-500">Only in v2</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-2.5">Sentry (error tracking)</td>
                <td className="text-right text-emerald-400">Free</td>
                <td className="text-right text-emerald-400">$0</td>
                <td className="pl-4 text-xs text-gray-500">Free tier: 5k events/mo</td>
              </tr>
              <tr className="border-b border-gray-800 bg-gray-800/30">
                <td className="py-2.5">Legal consultation</td>
                <td className="text-right">—</td>
                <td className="text-right">$500–2,000</td>
                <td className="pl-4 text-xs text-gray-500">One-time; critical expense</td>
              </tr>
              <tr className="bg-emerald-500/5 font-medium">
                <td className="py-3 text-emerald-400">TOTAL (v0, Year 1)</td>
                <td className="text-right text-emerald-400">~$30–80</td>
                <td className="text-right text-emerald-400">$860–2,670</td>
                <td className="pl-4 text-xs text-emerald-400/70">Including legal costs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="bg-amber-500/5 rounded-xl p-5 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-circle-question text-amber-400 text-lg mt-0.5"></i>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">Revenue Model: UNDEFINED</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              The blueprint explicitly defers monetization to v1 ("Deferred to v1 decision"). This is a 
              <strong> significant gap</strong>. Without a revenue model, the project cannot be evaluated for 
              financial viability beyond cost analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 mb-2">Possible Revenue Models:</p>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li>• <strong>Freemium:</strong> Free basic predictions, paid premium (detailed analysis)</li>
                  <li>• <strong>Subscription:</strong> Monthly fee for full access (KES 100-500/mo)</li>
                  <li>• <strong>Ads:</strong> Non-intrusive banner ads (risky for gambling-adjacent)</li>
                  <li>• <strong>Affiliate:</strong> Referral commissions from betting sites (legally complex)</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 mb-2">Revenue Risks:</p>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li>• Users may not pay for predictions (free alternatives exist)</li>
                  <li>• Ad networks may reject gambling-adjacent content</li>
                  <li>• Affiliate models may trigger BCLB requirements</li>
                  <li>• Kenyan market price sensitivity is high</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Cost */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Development Investment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">3–6</p>
            <p className="text-xs text-gray-400 mt-1">Weeks of development</p>
            <p className="text-xs text-gray-500 mt-1">1 developer, full-time</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">~$5K</p>
            <p className="text-xs text-gray-400 mt-1">Opportunity cost</p>
            <p className="text-xs text-gray-500 mt-1">If developer is paid market rate</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">$0</p>
            <p className="text-xs text-gray-400 mt-1">If solo/founder-led</p>
            <p className="text-xs text-gray-500 mt-1">Sweat equity only</p>
          </div>
        </div>
      </div>

      {/* Financial Verdict */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
        <h3 className="text-base font-semibold text-white mb-3">Financial Verdict</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-check text-emerald-400 mt-0.5"></i>
            <p className="text-sm text-gray-300"><strong>Low burn rate</strong> — the project can run on ~$30/month, making it sustainable for a solo developer or small team.</p>
          </div>
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-check text-emerald-400 mt-0.5"></i>
            <p className="text-sm text-gray-300"><strong>Low upfront investment</strong> — no expensive infrastructure, licenses, or equipment required for v0.</p>
          </div>
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i>
            <p className="text-sm text-gray-300"><strong>No revenue model</strong> — cannot assess ROI without knowing how the app makes money. This must be defined before v1.</p>
          </div>
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i>
            <p className="text-sm text-gray-300"><strong>Legal costs are underestimated</strong> — proper legal review in Kenya for gambling-adjacent apps will likely cost $500-2,000.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
