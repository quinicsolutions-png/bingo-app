export function MarketFeasibility() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <i className="fa-solid fa-users text-amber-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Market Feasibility</h2>
          <p className="text-sm text-gray-400">Score: <span className="text-amber-400 font-semibold">6/10 — MEDIUM</span></p>
        </div>
      </div>

      {/* Market Size */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Addressable Market</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">~$2B</p>
            <p className="text-xs text-gray-400 mt-1">Kenya sports betting market</p>
            <p className="text-xs text-gray-500 mt-1">Annual (2025 est.)</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">10M+</p>
            <p className="text-xs text-gray-400 mt-1">Active sports bettors in Kenya</p>
            <p className="text-xs text-gray-500 mt-1">Mobile-first market</p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">KES 1M+</p>
            <p className="text-xs text-gray-400 mt-1">SportPesa Mega Jackpot prize</p>
            <p className="text-xs text-gray-500 mt-1">Weekly draws</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          Kenya has one of Africa's largest and most active sports betting markets. SportPesa is a dominant player 
          with millions of registered users. The jackpot products (13-game Midweek, 17-game Mega) are particularly 
          popular due to the large prizes relative to the small stake required. There is clear demand for prediction 
          tools and analysis.
        </p>
      </div>

      {/* Competition */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Competitive Landscape</h3>
        <div className="space-y-3">
          {[
            { name: 'Free prediction websites', threat: 'High', detail: 'Many free sites offer jackpot predictions. Users have no incentive to download an app for the same information.' },
            { name: 'Telegram/WhatsApp groups', threat: 'High', detail: 'Prediction groups are extremely popular in Kenya. Low friction, social proof, free.' },
            { name: 'SportPesa\'s own stats', threat: 'Medium', detail: 'SportPesa provides some statistics. Users may not see value in a separate app.' },
            { name: 'Other prediction apps', threat: 'Medium', detail: 'Several apps on Play Store offer similar functionality. Differentiation is key.' },
            { name: 'Paid tipsters', threat: 'Low', detail: 'Individual tipsters charge for predictions. Your app competes on price (free/cheap) and consistency.' },
          ].map((comp) => (
            <div key={comp.name} className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                comp.threat === 'High' ? 'bg-red-500/20 text-red-400' :
                comp.threat === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {comp.threat}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{comp.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{comp.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Acquisition */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">User Acquisition Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-red-400 mb-2">CHALLENGES</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-xmark text-red-400 mt-1 text-xs"></i>
                <span>12-tester requirement delays Play Store launch by 2+ weeks</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-xmark text-red-400 mt-1 text-xs"></i>
                <span>No marketing budget defined in blueprint</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-xmark text-red-400 mt-1 text-xs"></i>
                <span>Users may not trust AI predictions over human tipsters</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-xmark text-red-400 mt-1 text-xs"></i>
                <span>App Store discovery for gambling-adjacent apps is limited</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-400 mb-2">OPPORTUNITIES</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-emerald-400 mt-1 text-xs"></i>
                <span>Football WhatsApp groups are massive in Kenya — viral potential</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-emerald-400 mt-1 text-xs"></i>
                <span>Push notifications create engagement loop</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-emerald-400 mt-1 text-xs"></i>
                <span>Track record (history screen) builds trust over time</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-emerald-400 mt-1 text-xs"></i>
                <span>Swahili localization differentiates from English-only competitors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Differentiation */}
      <div className="bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-xl p-5 border border-emerald-500/20">
        <h3 className="text-sm font-semibold text-emerald-400 mb-3">Potential Differentiators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: 'AI + Reasoning', desc: 'Unlike static tipsters, the app shows WHY it makes each pick (confidence scores, absence analysis)' },
            { title: 'Track Record', desc: 'Public history of predictions builds credibility over time — most tipsters hide losses' },
            { title: 'Combination Slip Generator', desc: 'Budget-constrained slip optimization is a unique feature not widely available' },
            { title: 'Offline + Fast', desc: 'Cached data works without internet — important for users with limited data bundles' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-800/30 rounded-lg p-3">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Market Verdict */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
        <h3 className="text-base font-semibold text-white mb-3">Market Verdict</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          The market exists and is large. However, the <strong>competitive landscape is crowded</strong> with free alternatives 
          (websites, Telegram groups, other apps). The app's success depends on: (1) prediction accuracy that exceeds 
          random chance and free alternatives, (2) a compelling user experience that justifies downloading an app, 
          and (3) effective distribution through Kenyan social channels. The 12-tester requirement is a real 
          acquisition challenge that needs immediate attention.
        </p>
      </div>
    </div>
  );
}
