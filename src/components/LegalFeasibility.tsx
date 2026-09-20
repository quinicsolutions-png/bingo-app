export function LegalFeasibility() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <i className="fa-solid fa-scale-balanced text-red-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Legal & Regulatory Feasibility</h2>
          <p className="text-sm text-gray-400">Score: <span className="text-red-400 font-semibold">4/10 — LOW</span></p>
        </div>
      </div>

      {/* Critical Warning */}
      <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/30">
        <div className="flex items-start gap-3">
          <i className="fa-solid fa-triangle-exclamation text-red-400 text-lg mt-0.5"></i>
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-1">CRITICAL: This is the highest-risk dimension</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              The legal and regulatory landscape presents <strong>existential risks</strong> to this project. Multiple 
              unresolved compliance issues could prevent the app from launching entirely, or result in legal action 
              after launch. <strong>No code should be deployed to production until these are resolved.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Issue Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white">Legal Issues Analysis</h3>
        
        {/* Issue 1: SportPesa ToS */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">CRITICAL</span>
            <h4 className="text-sm font-semibold text-white">SportPesa Terms of Service</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">THE PROBLEM:</p>
              <p className="text-sm text-gray-300">
                The blueprint acknowledges this risk but does not resolve it. If SportPesa's ToS prohibits scraping 
                or automated data collection, the entire data pipeline is illegal. The blueprint lists three options 
                (official API, licensed provider, written permission) but has not confirmed any of them.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">IMPACT:</p>
              <p className="text-sm text-gray-300">
                Without legal data access, the app has no product. This is a single point of failure. 
                Cease-and-desist letters are common in the betting industry.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-400 mb-1">REQUIRED ACTIONS:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>1. Obtain and review SportPesa's full ToS (not just the website terms)</li>
                <li>2. Contact SportPesa for written data usage permission, OR</li>
                <li>3. Contract a licensed data provider (Sportradar, API-Football) for match data</li>
                <li>4. Document the legal basis for data collection in an ADR</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Issue 2: BCLB */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">CRITICAL</span>
            <h4 className="text-sm font-semibold text-white">BCLB Registration (Kenya)</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">THE PROBLEM:</p>
              <p className="text-sm text-gray-300">
                Kenya's Betting Control and Licensing Board regulates all betting-adjacent activities. 
                The blueprint correctly flags this but notes it's "unclear" whether a prediction app needs registration. 
                The BCLB has broad discretion and has previously taken action against unlicensed prediction services.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">IMPACT:</p>
              <p className="text-sm text-gray-300">
                Operating without required registration can result in fines, app removal, and criminal liability. 
                The BCLB has been increasingly aggressive in enforcement since 2023.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-400 mb-1">REQUIRED ACTIONS:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>1. Engage a Kenyan lawyer specializing in gambling law</li>
                <li>2. Get a formal legal opinion on whether prediction apps require BCLB registration</li>
                <li>3. If yes, begin the registration process (can take 2-6 months)</li>
                <li>4. Consider structuring the app to clearly fall outside BCLB scope</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Issue 3: Trademark */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">HIGH</span>
            <h4 className="text-sm font-semibold text-white">Trademark Infringement</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">THE PROBLEM:</p>
              <p className="text-sm text-gray-300">
                "SportPesa" is a registered trademark. Using it in the app name ("SportPesa AI") creates 
                a clear trademark infringement risk. SportPesa could file a complaint with Google Play, 
                resulting in app removal, or pursue legal action.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-400 mb-1">REQUIRED ACTIONS:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>1. Rename the app immediately (blueprint suggests "JackpotIQ" or "PredictAI")</li>
                <li>2. Remove all SportPesa branding from the app UI</li>
                <li>3. Use only factual references ("predictions for SportPesa jackpots") in descriptions</li>
                <li>4. Conduct a trademark search for the new name</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Issue 4: Play Store Policy */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">HIGH</span>
            <h4 className="text-sm font-semibold text-white">Google Play Gambling Policy</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">THE PROBLEM:</p>
              <p className="text-sm text-gray-300">
                Google Play has strict policies for gambling-adjacent apps. Even "prediction" apps that 
                reference real betting operators can be rejected. The app must be categorized correctly 
                and include appropriate disclaimers.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-400 mb-1">REQUIRED ACTIONS:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>1. Review Google Play's gambling and games policy thoroughly</li>
                <li>2. Ensure the app does not facilitate or encourage real-money betting</li>
                <li>3. Include prominent "not a betting service" disclaimers</li>
                <li>4. Choose the correct app category (likely "Sports" not "Gambling")</li>
                <li>5. Prepare for potential rejection and appeal process</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Issue 5: Data Protection */}
        <div className="bg-gray-800/50 rounded-xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">MEDIUM</span>
            <h4 className="text-sm font-semibold text-white">Kenya Data Protection Act (ODPC)</h4>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-300">
              Even though v0 stores no PII, the app collects device identifiers, IP addresses, and usage data 
              (via Firebase Analytics). This likely triggers ODPC registration requirements. The blueprint 
              mentions this but does not include it in the critical blockers.
            </p>
            <p className="text-sm text-gray-300">
              <strong>Action:</strong> Register with ODPC if processing any personal data. Update the Data Safety 
              form to accurately reflect all data collection.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Feasibility Summary */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
        <h3 className="text-base font-semibold text-white mb-3">Legal Feasibility Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-red-400 mb-2">BLOCKING ISSUES (Must resolve before launch)</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-circle text-red-500 text-[6px]"></i>
                SportPesa data access legality
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-circle text-red-500 text-[6px]"></i>
                BCLB registration requirement
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-circle text-red-500 text-[6px]"></i>
                Trademark removal from app name
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-amber-400 mb-2">MANAGEABLE ISSUES (Can be resolved with effort)</p>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-circle text-amber-500 text-[6px]"></i>
                Google Play policy compliance
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-circle text-amber-500 text-[6px]"></i>
                Privacy policy & ToS hosting
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-circle text-amber-500 text-[6px]"></i>
                ODPC registration
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <i className="fa-solid fa-circle text-amber-500 text-[6px]"></i>
                Responsible gambling features
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
