import { useBingoData, publicAsset } from '../data/api';
import { APP_VERSION } from '../data/matchData';

export function Settings() {
  const { data } = useBingoData();
  const updated = data?.generatedAt ? new Date(data.generatedAt).toLocaleDateString() : 'Not published yet';
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Settings & Info</h2>
        <p className="text-xs text-gray-400">App information and preferences</p>
      </div>

      {/* App Info */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <img src={publicAsset('icon.svg')} alt="Bingo" className="w-14 h-14 rounded-xl" />
          <div>
            <h3 className="text-base font-bold text-white">Bingo</h3>
            <p className="text-[10px] text-gray-500">Version {APP_VERSION}</p>
            <p className="text-[10px] text-emerald-400">AI Football Predictions</p>
          </div>
        </div>
        <div className="space-y-2">
          <InfoRow label="Model" value="Dixon-Coles + Poisson" />
          <InfoRow label="Last Updated" value={updated} />
          <InfoRow label="Data Source" value="football-data.org" />
          <InfoRow label="Scores" value="Delayed on the free plan" />
          <InfoRow label="License" value="MIT (Open Source)" />
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">How It Works</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-cyan-400">1</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Data Collection</p>
              <p className="text-[10px] text-gray-400">Match data from football-data.org. Scores on the free plan are delayed.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-purple-400">2</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">AI Analysis</p>
              <p className="text-[10px] text-gray-400">Dixon-Coles model predicts match outcomes</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-emerald-400">3</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Public Record</p>
              <p className="text-[10px] text-gray-400">Every prediction tracked for transparency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Tiers */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Confidence Levels</h3>
        <div className="space-y-2">
          <ConfidenceRow tier="HIGH" threshold="≥55%" color="emerald" />
          <ConfidenceRow tier="MEDIUM" threshold="42-54%" color="cyan" />
          <ConfidenceRow tier="DRAW ALERT" threshold="Draw ≥30%" color="amber" />
          <ConfidenceRow tier="LOW" threshold="<42%" color="gray" />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-red-500/5 rounded-xl p-3 border border-red-500/20">
        <p className="text-[10px] text-red-400/80 leading-relaxed">
          <i className="fa-solid fa-triangle-exclamation mr-1"></i>
          <strong>Disclaimer:</strong> This app provides statistical analysis only. It is not a betting service, 
          does not accept wagers, and does not guarantee outcomes. Predictions are probabilistic and may be wrong.
        </p>
      </div>

      {/* Links */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Links</h3>
        <div className="space-y-2">
          <a href="https://github.com" className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-xs text-gray-300">
              <i className="fa-brands fa-github mr-2 text-gray-500"></i>Source Code
            </span>
            <i className="fa-solid fa-arrow-right text-[10px] text-gray-500"></i>
          </a>
          <a href="https://www.football-data.org/" className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-xs text-gray-300">
              <i className="fa-solid fa-database mr-2 text-gray-500"></i>Data Provider
            </span>
            <i className="fa-solid fa-arrow-right text-[10px] text-gray-500"></i>
          </a>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-gray-300">
              <i className="fa-solid fa-info-circle mr-2 text-gray-500"></i>About
            </span>
            <span className="text-[10px] text-gray-500">v{APP_VERSION}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
      <span className="text-[10px] text-gray-500">{label}</span>
      <span className="text-[10px] text-gray-300 font-medium">{value}</span>
    </div>
  );
}

function ConfidenceRow({ tier, threshold, color }: { tier: string; threshold: string; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    amber: 'bg-amber-500/20 text-amber-400',
    gray: 'bg-gray-500/20 text-gray-400',
  };
  return (
    <div className="flex items-center justify-between">
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${colorClasses[color]}`}>{tier}</span>
      <span className="text-[10px] text-gray-400">{threshold}</span>
    </div>
  );
}
