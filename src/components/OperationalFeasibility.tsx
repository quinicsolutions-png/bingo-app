export function OperationalFeasibility() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <i className="fa-solid fa-gears text-emerald-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Operational Feasibility</h2>
          <p className="text-sm text-gray-400">Score: <span className="text-emerald-400 font-semibold">7/10 — MEDIUM-HIGH</span></p>
        </div>
      </div>

      {/* Team Requirements */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Team & Skills Required</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-400">MINIMUM TEAM (v0)</p>
            {[
              { role: 'Flutter Developer', skill: 'Required', availability: '1 person, full-time' },
              { role: 'Backend/ML Engineer', skill: 'Required', availability: '1 person (can be same as Flutter dev)' },
              { role: 'Legal Advisor', skill: 'Required', availability: 'Consultant, 10-20 hours' },
            ].map((item) => (
              <div key={item.role} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.role}</p>
                  <p className="text-xs text-gray-500">{item.availability}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">{item.skill}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-400">SKILL GAPS TO ASSESS</p>
            {[
              { skill: 'Flutter/Dart', risk: 'Low', note: 'Abundant learning resources' },
              { skill: 'FastAPI/Python', risk: 'Low', note: 'Well-documented framework' },
              { skill: 'ML/Sports modeling', risk: 'High', note: 'Requires domain expertise + data science skills' },
              { skill: 'Kenyan gambling law', risk: 'High', note: 'Specialized legal knowledge needed' },
              { skill: 'Play Store publishing', risk: 'Medium', note: 'Complex policies, first-time complexity' },
            ].map((item) => (
              <div key={item.skill} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.skill}</p>
                  <p className="text-xs text-gray-500">{item.note}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  item.risk === 'High' ? 'bg-red-500/10 text-red-400' :
                  item.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>{item.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Readiness */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Operational Readiness Checklist</h3>
        <div className="space-y-2">
          {[
            { item: 'CI/CD pipeline defined', status: 'ready', detail: 'GitHub Actions workflow provided in blueprint' },
            { item: 'Environment separation', status: 'ready', detail: 'Dev/staging/prod environments clearly defined' },
            { item: 'Monitoring & alerting', status: 'ready', detail: 'Sentry, health checks, uptime monitoring planned' },
            { item: 'Database backup strategy', status: 'ready', detail: 'Daily backups with restore testing mentioned' },
            { item: 'Play Console account', status: 'blocked', detail: 'Not yet created; 12-tester rule applies' },
            { item: 'Legal pages hosted', status: 'blocked', detail: 'Privacy policy and ToS not yet written' },
            { item: 'Data provider contract', status: 'blocked', detail: 'API-Football or SportPesa access not confirmed' },
            { item: 'ML model trained', status: 'blocked', detail: 'No training data or model exists yet' },
            { item: 'Revenue model defined', status: 'blocked', detail: 'Deferred to v1 — needs definition before scaling' },
            { item: 'Responsible gambling features', status: 'partial', detail: 'Planned but not prioritized for v0' },
          ].map((item) => (
            <div key={item.item} className="flex items-center gap-3 bg-gray-800/30 rounded-lg p-3">
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                item.status === 'ready' ? 'bg-emerald-500' :
                item.status === 'partial' ? 'bg-amber-500' :
                'bg-red-500'
              }`}></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{item.item}</p>
                <p className="text-xs text-gray-500 truncate">{item.detail}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                item.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' :
                item.status === 'partial' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {item.status === 'ready' ? 'Ready' : item.status === 'partial' ? 'Partial' : 'Blocked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Burden */}
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
        <h3 className="text-base font-semibold text-white mb-4">Ongoing Maintenance Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">WEEKLY TASKS</p>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>• Monitor prediction accuracy vs. actual results</li>
              <li>• Check for SportPesa fixture changes/postponements</li>
              <li>• Review user feedback on Play Console</li>
              <li>• Monitor API uptime and error rates</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">MONTHLY TASKS</p>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>• Retrain ML model with new data</li>
              <li>• Update team name mappings if changed</li>
              <li>• Review and update rules engine</li>
              <li>• Dependency updates (security patches)</li>
              <li>• Database backup verification</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
          <p className="text-xs text-amber-400">
            <strong>Estimated ongoing effort:</strong> 5-10 hours/week for maintenance, monitoring, and model updates. 
            This is significant for a solo developer and should be factored into the feasibility assessment.
          </p>
        </div>
      </div>

      {/* Operational Verdict */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30">
        <h3 className="text-base font-semibold text-white mb-3">Operational Verdict</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          The blueprint demonstrates strong operational planning. CI/CD, monitoring, backups, and environment 
          separation are all well-considered. The main operational risks are: (1) the ongoing maintenance burden 
          of 5-10 hours/week, (2) dependency on external data providers, and (3) the need for specialized 
          legal knowledge. A solo developer can manage v0 operations, but v1+ will require either more time 
          or additional team members.
        </p>
      </div>
    </div>
  );
}
