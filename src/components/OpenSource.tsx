import { DATA_SOURCES } from '../data/matchData';

export function OpenSource() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Open Source</h2>
        <p className="text-sm text-gray-400">Built entirely with free, open-source tools and data</p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-4">Architecture (Free Tier)</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre className="whitespace-pre leading-relaxed">{`
┌─────────────────────────────────────────────────────────┐
│              MatchIQ Web App (GitHub Pages)              │
│  React + Tailwind CSS + TypeScript (Vite build)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │Dashboard │ │Predict   │ │ History  │ │Methodology│  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│       └─────────────┴────────────┴─────────────┘         │
│                     │                                     │
│           ┌─────────▼─────────┐                          │
│           │  Prediction Engine │                          │
│           │  (Client-side JS)  │                          │
│           │  Dixon-Coles +     │                          │
│           │  Poisson Model     │                          │
│           └─────────┬─────────┘                          │
└─────────────────────┼───────────────────────────────────┘
                      │ HTTPS (Free)
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Free Data Sources                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │football-     │ │openfootball  │ │football-     │     │
│  │data.org      │ │(GitHub)      │ │data.csv      │     │
│  │Free API      │ │Public Domain │ │Historical    │     │
│  │10 req/min    │ │              │ │Results       │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
└─────────────────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>

      {/* Data Sources */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-white">Data Sources (All Free)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DATA_SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {source.name}
                </h4>
                <i className="fa-solid fa-arrow-up-right-from-square text-gray-600 group-hover:text-emerald-400 text-xs"></i>
              </div>
              <p className="text-xs text-gray-400 mb-1">{source.type}</p>
              <p className="text-[10px] text-emerald-400/70">{source.license}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-4">Technology Stack (All Free)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'React 18', category: 'Frontend', icon: 'fa-brands fa-react', color: 'cyan' },
            { name: 'TypeScript', category: 'Language', icon: 'fa-solid fa-code', color: 'blue' },
            { name: 'Tailwind CSS', category: 'Styling', icon: 'fa-solid fa-palette', color: 'cyan' },
            { name: 'Vite', category: 'Build Tool', icon: 'fa-solid fa-bolt', color: 'purple' },
            { name: 'GitHub Pages', category: 'Hosting', icon: 'fa-brands fa-github', color: 'gray' },
            { name: 'football-data.org', category: 'Data API', icon: 'fa-solid fa-database', color: 'emerald' },
            { name: 'Dixon-Coles', category: 'ML Model', icon: 'fa-solid fa-brain', color: 'amber' },
            { name: 'MIT License', category: 'License', icon: 'fa-solid fa-scale-balanced', color: 'emerald' },
          ].map((tech) => (
            <div key={tech.name} className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700/50">
              <i className={`${tech.icon} text-${tech.color}-400 text-lg mb-1`}></i>
              <p className="text-xs font-medium text-white">{tech.name}</p>
              <p className="text-[10px] text-gray-500">{tech.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
        <h3 className="text-base font-semibold text-emerald-400 mb-3 flex items-center gap-2">
          <i className="fa-solid fa-coins"></i>
          Total Cost: $0/month
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">Infrastructure (Free)</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li className="flex justify-between">
                <span>GitHub Pages (hosting)</span>
                <span className="text-emerald-400">$0</span>
              </li>
              <li className="flex justify-between">
                <span>GitHub (code + CI/CD)</span>
                <span className="text-emerald-400">$0</span>
              </li>
              <li className="flex justify-between">
                <span>football-data.org (data)</span>
                <span className="text-emerald-400">$0</span>
              </li>
              <li className="flex justify-between">
                <span>Cloudflare (CDN/DNS)</span>
                <span className="text-emerald-400">$0</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">Development (Free)</p>
            <ul className="space-y-1 text-xs text-gray-300">
              <li className="flex justify-between">
                <span>React + Vite (framework)</span>
                <span className="text-emerald-400">$0</span>
              </li>
              <li className="flex justify-between">
                <span>Tailwind CSS (styling)</span>
                <span className="text-emerald-400">$0</span>
              </li>
              <li className="flex justify-between">
                <span>ML models (open source)</span>
                <span className="text-emerald-400">$0</span>
              </li>
              <li className="flex justify-between">
                <span>VS Code (editor)</span>
                <span className="text-emerald-400">$0</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-emerald-500/20">
          <p className="text-xs text-emerald-400 font-medium">
            <i className="fa-solid fa-check-circle mr-1"></i>
            No servers, no databases, no API keys to manage, no monthly bills.
            Deploy once, runs forever.
          </p>
        </div>
      </div>

      {/* How to Contribute */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <i className="fa-brands fa-github text-gray-400"></i>
          Contribute
        </h3>
        <p className="text-sm text-gray-300 mb-4">
          MatchIQ is open source under the MIT License. Contributions welcome:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: 'Improve Predictions', desc: 'Better models, more features, accuracy improvements', icon: 'fa-brain' },
            { title: 'Add Leagues', desc: 'Expand coverage to more competitions', icon: 'fa-globe' },
            { title: 'Bug Reports', desc: 'Found an issue? Let us know on GitHub', icon: 'fa-bug' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <i className={`fa-solid ${item.icon} text-emerald-400 text-sm mb-2`}></i>
              <p className="text-xs font-medium text-white">{item.title}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
