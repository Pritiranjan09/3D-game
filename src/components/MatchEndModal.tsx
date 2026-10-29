import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Skull, RefreshCw, Home, Sparkles } from 'lucide-react';
import { GameMode } from '../game/rules';
import { audioSystem } from '../utils/audio';

interface MatchEndModalProps {
  isOpen: boolean;
  winner: 'player' | 'computer' | 'draw' | null;
  mode: GameMode;
  playerScore: number;
  computerScore: number;
  totalRounds: number;
  playerName: string;
  onPlayAgain: () => void;
  onReturnToTitle: () => void;
}

export const MatchEndModal: React.FC<MatchEndModalProps> = ({
  isOpen,
  winner,
  mode,
  playerScore,
  computerScore,
  totalRounds,
  playerName,
  onPlayAgain,
  onReturnToTitle,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (winner === 'player') {
        audioSystem.matchVictory();
        // Fire celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#06b6d4', '#a855f7', '#f59e0b'],
          });
          setTimeout(() => {
            confetti({
              particleCount: 60,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#10b981', '#06b6d4'],
            });
            confetti({
              particleCount: 60,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#a855f7', '#f59e0b'],
            });
          }, 350);
        } catch {
          // Confetti fallback
        }
      } else if (winner === 'computer') {
        audioSystem.lose();
      } else {
        audioSystem.draw();
      }
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  const isPlayerWinner = winner === 'player';
  const isComputerWinner = winner === 'computer';

  const getModeTitle = () => {
    switch (mode) {
      case 'best_of_5':
        return 'Best of 5 Match';
      case 'best_of_10':
        return 'Best of 10 Marathon';
      default:
        return 'Match Complete';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-end-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        className={`relative w-full max-w-md bg-slate-900 border rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden ${
          isPlayerWinner
            ? 'border-emerald-500/80 glow-emerald'
            : isComputerWinner
            ? 'border-rose-500/80 glow-rose'
            : 'border-amber-500/80 glow-amber'
        }`}
      >
        {/* Decorative Top Accent Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isPlayerWinner ? 'bg-emerald-500' : isComputerWinner ? 'bg-rose-500' : 'bg-amber-500'
          }`}
        />

        {/* Hero Icon Badge */}
        <div className="mx-auto mb-4 flex items-center justify-center">
          {isPlayerWinner && (
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>
          )}
          {isComputerWinner && (
            <div className="w-20 h-20 rounded-2xl bg-rose-500/20 border-2 border-rose-400 text-rose-400 flex items-center justify-center shadow-lg">
              <Skull className="w-10 h-10" />
            </div>
          )}
          {!isPlayerWinner && !isComputerWinner && (
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Outcome Heading */}
        <span className="text-xs uppercase tracking-widest font-mono-arcade text-slate-400">
          {getModeTitle()}
        </span>
        <h2
          id="match-end-title"
          className={`text-3xl sm:text-4xl font-extrabold font-heading mt-1 ${
            isPlayerWinner
              ? 'text-emerald-400 text-glow-emerald'
              : isComputerWinner
              ? 'text-rose-400'
              : 'text-amber-400'
          }`}
        >
          {isPlayerWinner
            ? 'VICTORY!'
            : isComputerWinner
            ? 'DEFEAT'
            : 'DRAW MATCH!'}
        </h2>

        <p className="text-sm text-slate-300 mt-2">
          {isPlayerWinner
            ? `Outstanding combat strategy, ${playerName}! You dominated the arena.`
            : isComputerWinner
            ? 'The AI calculated your strategy and took the match victory.'
            : 'Honorable stalemate! Both combatants matched each other blow for blow.'}
        </p>

        {/* Final Scoreboard Card */}
        <div className="my-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-around">
          <div className="text-center">
            <span className="text-xs text-slate-400 block font-semibold truncate max-w-24">
              {playerName}
            </span>
            <span className="text-3xl font-extrabold font-heading text-emerald-400 tabular-nums">
              {playerScore}
            </span>
          </div>

          <div className="text-center px-4">
            <span className="text-xs text-slate-500 font-mono-arcade block">ROUNDS</span>
            <span className="text-xl font-bold text-slate-400 font-mono-arcade tabular-nums">
              {totalRounds}
            </span>
          </div>

          <div className="text-center">
            <span className="text-xs text-slate-400 block font-semibold">AI Rival</span>
            <span className="text-3xl font-extrabold font-heading text-rose-400 tabular-nums">
              {computerScore}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            data-start="true"
            className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-heading rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" /> Play Again
          </button>
          <button
            onClick={onReturnToTitle}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-heading rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" /> Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
