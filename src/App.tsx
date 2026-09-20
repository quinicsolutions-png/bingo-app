import { useState } from 'react';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { FeasibilityScores } from './components/FeasibilityScores';
import { TechnicalFeasibility } from './components/TechnicalFeasibility';
import { LegalFeasibility } from './components/LegalFeasibility';
import { FinancialFeasibility } from './components/FinancialFeasibility';
import { MarketFeasibility } from './components/MarketFeasibility';
import { OperationalFeasibility } from './components/OperationalFeasibility';
import { TimelineFeasibility } from './components/TimelineFeasibility';
import { RiskMatrix } from './components/RiskMatrix';
import { SWOTAnalysis } from './components/SWOTAnalysis';
import { Recommendations } from './components/Recommendations';
import { Verdict } from './components/Verdict';

type Section = 'overview' | 'technical' | 'legal' | 'financial' | 'market' | 'operational' | 'timeline' | 'risks' | 'swot' | 'recommendations';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-line' },
    { id: 'technical', label: 'Technical', icon: 'fa-microchip' },
    { id: 'legal', label: 'Legal', icon: 'fa-scale-balanced' },
    { id: 'financial', label: 'Financial', icon: 'fa-coins' },
    { id: 'market', label: 'Market', icon: 'fa-users' },
    { id: 'operational', label: 'Operational', icon: 'fa-gears' },
    { id: 'timeline', label: 'Timeline', icon: 'fa-clock' },
    { id: 'risks', label: 'Risk Matrix', icon: 'fa-triangle-exclamation' },
    { id: 'swot', label: 'SWOT', icon: 'fa-bullseye' },
    { id: 'recommendations', label: 'Verdict', icon: 'fa-flag-checkered' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <i className="fa-solid fa-brain text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SportPesa AI</h1>
              <p className="text-xs text-gray-400">Feasibility Study Report</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <i className="fa-regular fa-calendar"></i>
            <span>September 2026</span>
            <span className="mx-2">|</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
              CONDITIONAL GO
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <nav className="lg:w-56 lg:min-h-screen bg-gray-900/50 border-r border-gray-800 p-4 lg:sticky lg:top-16 lg:self-start">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all w-full text-left ${
                    activeSection === section.id
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  <i className={`fa-solid ${section.icon} w-4 text-center`}></i>
                  <span>{section.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-full overflow-hidden">
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <ExecutiveSummary />
              <FeasibilityScores />
            </div>
          )}
          {activeSection === 'technical' && <TechnicalFeasibility />}
          {activeSection === 'legal' && <LegalFeasibility />}
          {activeSection === 'financial' && <FinancialFeasibility />}
          {activeSection === 'market' && <MarketFeasibility />}
          {activeSection === 'operational' && <OperationalFeasibility />}
          {activeSection === 'timeline' && <TimelineFeasibility />}
          {activeSection === 'risks' && <RiskMatrix />}
          {activeSection === 'swot' && <SWOTAnalysis />}
          {activeSection === 'recommendations' && (
            <div className="space-y-8">
              <Verdict />
              <Recommendations />
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Feasibility Study — SportPesa AI Blueprint v1.0</p>
          <p className="mt-1">Prepared: September 2026 • Classification: Internal • Status: Draft — pending legal review</p>
        </div>
      </footer>
    </div>
  );
}
