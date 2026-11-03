import { ArrowRight, Code, Database, Info } from 'lucide-react';
import { useBingoData, publicAsset } from '../data/api';
import { APP_VERSION } from '../data/matchData';
import { ManualImport } from './ManualImport';

export function Settings() {
  const { data } = useBingoData();
  const updated = data?.generatedAt ? new Date(data.generatedAt).toLocaleDateString() : 'Not published yet';
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Settings & Info</h2>
        <p className="text-xs text-gray-400">App information and preferences</p>
      </div>

      <ManualImport />

      {/* App Info */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <img src={publicAsset('icon.svg')} alt="Bingo" className="w-14 h-14 rounded-xl" />
          <div>
            <h3 className="text-base font-bold text-white">Bingo</h3>
            <p className="text-[11px] text-gray-400">Version {APP_VERSION}</p>
            <p className="text-[11px] text-emerald-400">AI Football Predictions</p>
          </div>
        </div>
        <div className="space-y-2">
          <InfoRow label="Model" value="Dixon-Coles + Poisson" />
          <InfoRow label="Last Updated" value={updated} />
          <InfoRow label="Active Data Source" value="football-data.org" />
          <InfoRow label="Tubet API" value="EPL evaluation only" />
          <InfoRow label="Scores" value="Provider-dependent" />
          <InfoRow label="License" value="MIT (Open Source)" />
        </div>
      </div>

      {/* Methodology */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">How It Works</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-cyan-400">1</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Data Collection</p>
              <p className="text-[11px] text-gray-400">Match data currently comes from football-data.org. Tubet is being evaluated for EPL fixtures and is not active.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-purple-400">2</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">AI Analysis</p>
              <p className="text-[11px] text-gray-400">Dixon-Coles + Poisson model with team strengths derived from league standings (goals scored and conceded, home and away)</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-emerald-400">3</span>
            </div>
            <div>
              <p className="text-xs font-medium text-white">Public Record</p>
              <p className="text-[11px] text-gray-400">Every prediction tracked for transparency</p>
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

      {/* Links */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Links</h3>
        <div className="space-y-2">
          <a href="https://github.com/quinicsolutions-png/bingo-app" target="_blank" rel="noreferrer" className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-xs text-gray-300 flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-gray-400" aria-hidden /> Source Code
            </span>
            <ArrowRight className="w-3 h-3 text-gray-500" aria-hidden />
          </a>
          <a href="https://www.football-data.org/" target="_blank" rel="noreferrer" className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-xs text-gray-300 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-gray-400" aria-hidden /> Active Data Provider
            </span>
            <ArrowRight className="w-3 h-3 text-gray-500" aria-hidden />
          </a>
          <a href="https://github.com/ongair/tubet_api" target="_blank" rel="noreferrer" className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-xs text-gray-300 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-gray-400" aria-hidden /> Tubet API (evaluation)
            </span>
            <ArrowRight className="w-3 h-3 text-gray-500" aria-hidden />
          </a>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-gray-300 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-gray-400" aria-hidden /> About
            </span>
            <span className="text-[11px] text-gray-400">v{APP_VERSION}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
      <span className="text-[11px] text-gray-400">{label}</span>
      <span className="text-[11px] text-gray-300 font-medium">{value}</span>
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
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorClasses[color]}`}>{tier}</span>
      <span className="text-[11px] text-gray-400">{threshold}</span>
    </div>
  );
}
