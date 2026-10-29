import React, { useState } from 'react';
import { X, Volume2, VolumeX, Cpu, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { Difficulty } from '../game/rules';
import { audioSystem } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  difficulty,
  onDifficultyChange,
  isMuted,
  onToggleMute,
  reducedMotion,
  onToggleReducedMotion,
  onResetStats,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [volume, setVolume] = useState(audioSystem.getVolume());
  const [resetDone, setResetDone] = useState(false);

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioSystem.setVolume(val);
  };

  const handleTestAudio = () => {
    audioSystem.win();
  };

  const handleExecuteReset = () => {
    onResetStats();
    setShowConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 id="settings-dialog-title" className="text-xl sm:text-2xl font-bold font-heading text-white">
                Game Settings
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Audio, AI intelligence & interface preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings dialog"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 mt-6">
          {/* Audio Section */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                )}
                <span className="font-semibold text-sm">Sound Effects</span>
              </div>
              <button
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isMuted ? 'MUTED' : 'ENABLED'}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label htmlFor="volume-range" className="text-xs text-slate-400 min-w-14">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                id="volume-range"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                disabled={isMuted}
                className="w-full accent-emerald-400 cursor-pointer disabled:opacity-40"
              />
              <button
                onClick={handleTestAudio}
                disabled={isMuted}
                aria-label="Test sound effects"
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded border border-slate-700 text-slate-300 whitespace-nowrap"
              >
                Test Chime
              </button>
            </div>
          </div>

          {/* AI Difficulty Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              AI Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onDifficultyChange('easy')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  difficulty === 'easy'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 glow-emerald'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-sm">Easy</div>
                <div className="text-[10px] text-slate-400 mt-1">Random choice</div>
              </button>

              <button
                type="button"
                onClick={() => onDifficultyChange('medium')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  difficulty === 'medium'
                    ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 glow-cyan'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-sm">Medium</div>
                <div className="text-[10px] text-slate-400 mt-1">Reactive counter</div>
              </button>

              <button
                type="button"
                onClick={() => onDifficultyChange('hard')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  difficulty === 'hard'
                    ? 'bg-purple-950/50 border-purple-500 text-purple-300 glow-purple'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-sm">Hard</div>
                <div className="text-[10px] text-purple-400 mt-1">Markov Predictor</div>
              </button>
            </div>
          </div>

          {/* Accessibility & Visual FX */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm">Reduced Motion</span>
              <p className="text-xs text-slate-400">Disables rapid screen shakes and high-speed flashes</p>
            </div>
            <button
              onClick={onToggleReducedMotion}
              aria-label={reducedMotion ? 'Disable reduced motion' : 'Enable reduced motion'}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                reducedMotion
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Data Management Section */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-slate-200">Career Statistics</span>
                <p className="text-xs text-slate-400">Reset match records, win streaks, and choice counts</p>
              </div>
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  aria-label="Prompt reset statistics"
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Data
                </button>
              ) : null}
            </div>

            {showConfirmReset && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg animate-fade-in space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Are you sure? This cannot be undone!
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white rounded bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExecuteReset}
                    className="px-3 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded shadow-md"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}

            {resetDone && (
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <Check className="w-4 h-4" /> Statistics have been wiped successfully!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold font-heading rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
