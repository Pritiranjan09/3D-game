import React from 'react';
import { X, ShieldAlert, ArrowRight, Zap, Award, Sparkles } from 'lucide-react';
import { SnakeArt, WaterArt, GunArt } from './ArtIcons';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 id="how-to-play-title" className="text-xl sm:text-2xl font-bold font-heading text-white">
                How To Play & Rules
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Master the elemental triangle of combat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close how to play dialog"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Combat Triangle Matrix */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> The Rules of Engagement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Rule 1 */}
            <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <SnakeArt size={42} glow />
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <WaterArt size={36} />
              </div>
              <h4 className="font-heading text-sm text-emerald-400 font-bold">Snake Beats Water</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                The cyber-viper consumes and absorbs water pools effortlessly to thrive.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <WaterArt size={42} glow />
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <GunArt size={36} />
              </div>
              <h4 className="font-heading text-sm text-cyan-400 font-bold">Water Beats Gun</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                High-pressure flood water rusts firing pins and drowns plasma charges.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="bg-slate-950/70 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <GunArt size={42} glow />
                <ArrowRight className="w-4 h-4 text-purple-400" />
                <SnakeArt size={36} />
              </div>
              <h4 className="font-heading text-sm text-purple-400 font-bold">Gun Beats Snake</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                High-velocity projectile eliminates the swift serpent from a safe distance.
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2 italic">
            * Identical choices result in a standoff (Draw) with no points awarded.
          </p>
        </div>

        {/* Game Modes */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> Game Modes
          </h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex gap-3">
              <span className="font-bold text-amber-400 min-w-24">Quick Play</span>
              <span className="text-slate-300">Endless duel. Play round-by-round to test and build up your win streak.</span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex gap-3">
              <span className="font-bold text-emerald-400 min-w-24">Best of 5</span>
              <span className="text-slate-300">Championship sprint! First player to secure 3 round victories wins the match.</span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex gap-3">
              <span className="font-bold text-cyan-400 min-w-24">Best of 10</span>
              <span className="text-slate-300">Tactical marathon. Exactly 10 rounds; highest win tally takes the crown.</span>
            </div>
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex gap-3">
              <span className="font-bold text-purple-400 min-w-24">Practice</span>
              <span className="text-slate-300">Warm-up zone. Experiment freely without impacting your permanent career record.</span>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="mt-6 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Keyboard Hotkeys
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300 font-mono-arcade">
            <div><span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400">[1]</span> or <span className="text-emerald-400">[S]</span> Snake</div>
            <div><span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-400">[2]</span> or <span className="text-cyan-400">[W]</span> Water</div>
            <div><span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-purple-400">[3]</span> or <span className="text-purple-400">[G]</span> Gun</div>
            <div><span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-400">[Space]</span> Next / Restart</div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-heading rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
