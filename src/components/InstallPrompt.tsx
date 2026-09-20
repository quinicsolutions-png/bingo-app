interface Props {
  onInstall: () => void;
}

export function InstallPrompt({ onInstall }: Props) {
  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-4 shadow-2xl shadow-emerald-500/20 border border-emerald-400/30 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-download text-white"></i>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white">Install Bingo</h4>
          <p className="text-[10px] text-emerald-100 mt-0.5 leading-relaxed">
            Add to home screen for instant access. Works offline.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onInstall}
              className="px-3 py-1.5 rounded-lg bg-white text-emerald-600 text-[10px] font-bold hover:bg-emerald-50 transition-colors"
            >
              Install Now
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-medium hover:bg-white/20 transition-colors">
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
