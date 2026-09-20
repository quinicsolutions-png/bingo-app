export function FeasibilityScores() {
  const scores = [
    { label: 'Technical', score: 8, max: 10, color: 'emerald', icon: 'fa-microchip', detail: 'Proven stack, sound architecture' },
    { label: 'Legal & Regulatory', score: 4, max: 10, color: 'red', icon: 'fa-scale-balanced', detail: 'Multiple unresolved compliance issues' },
    { label: 'Financial', score: 7, max: 10, color: 'emerald', icon: 'fa-coins', detail: 'Low costs, but no revenue model' },
    { label: 'Market', score: 6, max: 10, color: 'amber', icon: 'fa-users', detail: 'Large market, but competitive' },
    { label: 'Operational', score: 7, max: 10, color: 'emerald', icon: 'fa-gears', detail: 'Well-planned, small team feasible' },
    { label: 'Timeline', score: 5, max: 10, color: 'amber', icon: 'fa-clock', detail: 'Aggressive; regulatory delays likely' },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return { bg: 'bg-emerald-500', text: 'text-emerald-400', bgLight: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
      case 'amber': return { bg: 'bg-amber-500', text: 'text-amber-400', bgLight: 'bg-amber-500/10', border: 'border-amber-500/30' };
      case 'red': return { bg: 'bg-red-500', text: 'text-red-400', bgLight: 'bg-red-500/10', border: 'border-red-500/30' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-400', bgLight: 'bg-gray-500/10', border: 'border-gray-500/30' };
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Feasibility Dimensions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((item) => {
          const colors = getColorClasses(item.color);
          const percentage = (item.score / item.max) * 100;
          return (
            <div key={item.label} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${colors.bgLight} border ${colors.border} flex items-center justify-center`}>
                    <i className={`fa-solid ${item.icon} ${colors.text} text-sm`}></i>
                  </div>
                  <span className="text-sm font-medium text-gray-200">{item.label}</span>
                </div>
                <span className={`text-lg font-bold ${colors.text}`}>{item.score}/{item.max}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors.bg} rounded-full transition-all duration-1000`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Radar-style summary */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/30 mt-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-4">Feasibility Radar</h4>
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-full max-w-xs">
            {/* Background circles */}
            {[20, 40, 60, 80, 100].map((r) => (
              <circle key={r} cx="150" cy="150" r={r * 1.2} fill="none" stroke="rgba(75,85,99,0.3)" strokeWidth="0.5" />
            ))}
            {/* Axis lines */}
            {scores.map((_, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const x = 150 + 120 * Math.cos(angle);
              const y = 150 + 120 * Math.sin(angle);
              return <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="rgba(75,85,99,0.3)" strokeWidth="0.5" />;
            })}
            {/* Data polygon */}
            <polygon
              points={scores.map((s, i) => {
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const r = (s.score / s.max) * 120;
                return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
              }).join(' ')}
              fill="rgba(16,185,129,0.15)"
              stroke="rgba(16,185,129,0.8)"
              strokeWidth="2"
            />
            {/* Data points and labels */}
            {scores.map((s, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const r = (s.score / s.max) * 120;
              const px = 150 + r * Math.cos(angle);
              const py = 150 + r * Math.sin(angle);
              const lx = 150 + 135 * Math.cos(angle);
              const ly = 150 + 135 * Math.sin(angle);
              return (
                <g key={i}>
                  <circle cx={px} cy={py} r="4" fill={s.color === 'emerald' ? '#10b981' : s.color === 'amber' ? '#f59e0b' : '#ef4444'} />
                  <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-gray-400">
                    {s.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
