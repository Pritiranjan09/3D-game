import React from 'react';
import { 
  Trophy, RotateCcw, Volume2, VolumeX, Home, HelpCircle, 
  BarChart2, Shield, Bot, User, Flame, ArrowRight 
} from 'lucide-react';
import { Choice, GameMode, Difficulty, RoundResult, CHOICE_MAP, ALL_CHOICES, RoundRecord } from '../game/rules';
import { ChoiceArt, SnakeArt, WaterArt, GunArt } from './ArtIcons';

interface ClashArenaProps {
  playerName: string;
  avatar: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  playerScore: number;
  computerScore: number;
  currentRound: number;
  isProcessing: boolean;
  countdown: number | null;
  playerSelection: Choice | null;
  computerSelection: Choice | null;
  roundResult: RoundResult | null;
  outcomeReason: string | null;
  onSelectChoice: (choice: Choice) => void;
  onRestartMatch: () => void;
  onReturnToTitle: () => void;
  onOpenStats: () => void;
  onOpenHowToPlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  streak: number;
  reducedMotion: boolean;
}

export const ClashArena: React.FC<ClashArenaProps> = ({
  playerName,
  avatar,
  gameMode,
  difficulty,
  playerScore,
  computerScore,
  currentRound,
  isProcessing,
  countdown,
  playerSelection,
  computerSelection,
  roundResult,
  outcomeReason,
  onSelectChoice,
  onRestartMatch,
  onReturnToTitle,
  onOpenStats,
  onOpenHowToPlay,
  isMuted,
  onToggleMute,
  streak,
  reducedMotion,
}) => {
  const getAvatarEmoji = () => {
    switch (avatar) {
      case 'viper': return '🐍';
      case 'hydro': return '💧';
      case 'cyborg': return '🤖';
      case 'ninja': return '🥷';
      case 'pilot': return '⚡';
      default: return '👤';
    }
  };

  const getAIMood = () => {
    if (countdown !== null) return 'Analyzing neural pattern...';
    if (!roundResult) return 'Ready for your move';
    if (roundResult === 'lose') return 'Ha! Target neutralized!';
    if (roundResult === 'win') return 'Recalibrating counter-metrics...';
    return 'Synchronized stalemate!';
  };

  // Render pips for Best of 5 (first to 3) or Best of 10
  const renderPips = (score: number, maxPips: number, colorClass: string) => {
    return (
      <div className="flex gap-1 justify-center my-1">
        {Array.from({ length: maxPips }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border transition-all duration-300 ${
              i < score
                ? `${colorClass} shadow-[0_0_8px_currentColor]`
                : 'border-slate-700 bg-slate-900/60'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-3 sm:p-5 md:p-6 max-w-5xl mx-auto z-10 selection:bg-emerald-500 selection:text-black">
      {/* Top HUD Cluster */}
      <header className="w-full flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        {/* Left: Mode & Round Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToTitle}
            aria-label="Exit to main menu"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold font-heading text-slate-200 uppercase tracking-wide">
                {gameMode === 'best_of_5' && 'Best of 5'}
                {gameMode === 'best_of_10' && 'Best of 10'}
                {gameMode === 'quick' && 'Quick Play'}
                {gameMode === 'practice' && 'Practice Duel'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-arcade font-bold bg-slate-800 text-slate-300 border border-slate-700">
                ROUND {currentRound}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono-arcade hidden sm:inline-block">
              Difficulty: {difficulty.toUpperCase()} {gameMode === 'best_of_5' ? '· First to 3 Wins' : ''}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenStats}
            aria-label="Open performance statistics"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={onOpenHowToPlay}
            aria-label="View game rules"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={onRestartMatch}
            aria-label="Restart current match"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Restart</span>
          </button>
        </div>
      </header>

      {/* Main Clash Stage */}
      <main className="my-auto py-3 sm:py-6 flex flex-col items-center w-full">
        {/* Scoreboard Cards (Player vs AI) */}
        <div className="w-full grid grid-cols-2 gap-3 sm:gap-6 mb-4 max-w-2xl">
          {/* Player Card */}
          <div
            className={`p-3 sm:p-4 rounded-2xl bg-slate-900/90 border transition-all ${
              roundResult === 'win'
                ? 'border-emerald-500 glow-emerald scale-[1.02]'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  {getAvatarEmoji()}
                </span>
                <div className="text-left">
                  <div className="font-heading font-bold text-xs sm:text-sm text-slate-100 truncate max-w-28 sm:max-w-40">
                    {playerName}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono-arcade flex items-center gap-1">
                    {streak > 1 && (
                      <span className="flex items-center text-amber-400">
                        <Flame className="w-3 h-3 inline fill-amber-400" /> {streak} streak
                      </span>
                    )}
                    {streak <= 1 && 'READY'}
                  </div>
                </div>
              </div>

              {/* Big Score Numeral */}
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-emerald-400 tabular-nums">
                {playerScore}
              </div>
            </div>

            {gameMode === 'best_of_5' && renderPips(playerScore, 3, 'bg-emerald-400 border-emerald-300 text-emerald-400')}
          </div>

          {/* Computer Card */}
          <div
            className={`p-3 sm:p-4 rounded-2xl bg-slate-900/90 border transition-all ${
              roundResult === 'lose'
                ? 'border-rose-500 glow-rose scale-[1.02]'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Big Score Numeral */}
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-rose-400 tabular-nums order-2 sm:order-1">
                {computerScore}
              </div>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <div className="text-right">
                  <div className="font-heading font-bold text-xs sm:text-sm text-slate-100">
                    AI Rival
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono-arcade">
                    {difficulty.toUpperCase()} AI
                  </div>
                </div>
                <span className="text-xl p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  🤖
                </span>
              </div>
            </div>

            {gameMode === 'best_of_5' && renderPips(computerScore, 3, 'bg-rose-500 border-rose-400 text-rose-500')}
          </div>
        </div>

        {/* Center Arena Battle Display */}
        <div className="w-full max-w-2xl bg-slate-950/70 border border-slate-800/90 rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[260px]">
          {/* Subtle Cyber Grid in battle field */}
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

          {/* AI Dialogue Banner */}
          <div className="mb-4 text-xs font-mono-arcade text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            {getAIMood()}
          </div>

          {/* Clash Stage Centerpiece */}
          <div className="flex items-center justify-around w-full gap-4 relative z-10">
            {/* Player Choice Reveal Slot */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono-arcade text-slate-400 uppercase tracking-wider mb-2">
                Your Weapon
              </span>
              <div
                className={`w-28 h-32 sm:w-36 sm:h-40 rounded-2xl border flex flex-col items-center justify-center p-3 transition-all duration-300 ${
                  playerSelection
                    ? `${CHOICE_MAP[playerSelection].borderClass} ${CHOICE_MAP[playerSelection].glowClass} bg-slate-900`
                    : 'border-dashed border-slate-700 bg-slate-900/40 text-slate-600'
                }`}
              >
                {playerSelection ? (
                  <>
                    <ChoiceArt choice={playerSelection} size={64} glow />
                    <span className={`mt-2 font-heading font-bold text-xs uppercase ${CHOICE_MAP[playerSelection].textGlowClass}`}>
                      {CHOICE_MAP[playerSelection].name}
                    </span>
                  </>
                ) : (
                  <div className="text-center text-xs text-slate-500 font-mono-arcade animate-pulse">
                    Select a<br />weapon below
                  </div>
                )}
              </div>
            </div>

            {/* Middle Countdown or VS Orb */}
            <div className="flex flex-col items-center justify-center min-w-16">
              {countdown !== null ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 bg-amber-950/60 flex items-center justify-center text-3xl sm:text-4xl font-black font-heading text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-ping">
                  {countdown}
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-sm sm:text-base font-black font-heading text-slate-400">
                  VS
                </div>
              )}
            </div>

            {/* Computer Choice Reveal Slot */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono-arcade text-slate-400 uppercase tracking-wider mb-2">
                Opponent
              </span>
              <div
                className={`w-28 h-32 sm:w-36 sm:h-40 rounded-2xl border flex flex-col items-center justify-center p-3 transition-all duration-300 ${
                  computerSelection
                    ? `${CHOICE_MAP[computerSelection].borderClass} ${CHOICE_MAP[computerSelection].glowClass} bg-slate-900`
                    : 'border-dashed border-slate-700 bg-slate-900/40 text-slate-600'
                }`}
              >
                {computerSelection ? (
                  <>
                    <ChoiceArt choice={computerSelection} size={64} glow />
                    <span className={`mt-2 font-heading font-bold text-xs uppercase ${CHOICE_MAP[computerSelection].textGlowClass}`}>
                      {CHOICE_MAP[computerSelection].name}
                    </span>
                  </>
                ) : (
                  <div className="text-center text-xs text-slate-500 font-mono-arcade">
                    {isProcessing ? 'Arming...' : '???'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Outcome Explanation Banner */}
          {outcomeReason && (
            <div
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm font-semibold transition-all border ${
                roundResult === 'win'
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 glow-emerald'
                  : roundResult === 'lose'
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300 glow-rose'
                  : 'bg-amber-950/70 border-amber-500 text-amber-300 glow-amber'
              }`}
            >
              <div className="font-heading font-bold uppercase tracking-wider mb-0.5">
                {roundResult === 'win' && '⚡ ROUND WON!'}
                {roundResult === 'lose' && '💥 ROUND LOST'}
                {roundResult === 'draw' && '⚖️ STAND-OFF (DRAW)'}
              </div>
              <div className="text-slate-300 font-sans-main text-xs">{outcomeReason}</div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Interactive Weapon Selection Dock */}
      <footer className="w-full max-w-3xl mx-auto pt-2 pb-1">
        <div className="text-center mb-2">
          <span className="text-[11px] uppercase tracking-wider font-mono-arcade text-slate-400">
            {isProcessing ? 'Resolving encounter...' : 'Deploy Your Weapon'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* Option 1: Snake */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onSelectChoice('snake')}
            aria-label="Select Snake"
            className={`relative p-3 sm:p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group ${
              playerSelection === 'snake'
                ? 'border-emerald-400 bg-emerald-950/40 glow-emerald ring-2 ring-emerald-400 scale-[1.03]'
                : 'border-slate-800 bg-slate-900/90 hover:border-emerald-500/60 hover:bg-slate-850 hover:glow-emerald'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-mono-arcade rounded bg-slate-800 border border-slate-700 text-emerald-400">
              [1]
            </span>
            <div className="my-1 group-hover:scale-110 transition-transform">
              <SnakeArt size={56} />
            </div>
            <div className="mt-1">
              <div className="font-heading font-bold text-xs sm:text-sm text-emerald-400">
                SNAKE
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Defeats Water
              </div>
            </div>
          </button>

          {/* Option 2: Water */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onSelectChoice('water')}
            aria-label="Select Water"
            className={`relative p-3 sm:p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group ${
              playerSelection === 'water'
                ? 'border-cyan-400 bg-cyan-950/40 glow-cyan ring-2 ring-cyan-400 scale-[1.03]'
                : 'border-slate-800 bg-slate-900/90 hover:border-cyan-500/60 hover:bg-slate-850 hover:glow-cyan'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-mono-arcade rounded bg-slate-800 border border-slate-700 text-cyan-400">
              [2]
            </span>
            <div className="my-1 group-hover:scale-110 transition-transform">
              <WaterArt size={56} />
            </div>
            <div className="mt-1">
              <div className="font-heading font-bold text-xs sm:text-sm text-cyan-400">
                WATER
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Defeats Gun
              </div>
            </div>
          </button>

          {/* Option 3: Gun */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onSelectChoice('gun')}
            aria-label="Select Gun"
            className={`relative p-3 sm:p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between group ${
              playerSelection === 'gun'
                ? 'border-purple-400 bg-purple-950/40 glow-purple ring-2 ring-purple-400 scale-[1.03]'
                : 'border-slate-800 bg-slate-900/90 hover:border-purple-500/60 hover:bg-slate-850 hover:glow-purple'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-mono-arcade rounded bg-slate-800 border border-slate-700 text-purple-400">
              [3]
            </span>
            <div className="my-1 group-hover:scale-110 transition-transform">
              <GunArt size={56} />
            </div>
            <div className="mt-1">
              <div className="font-heading font-bold text-xs sm:text-sm text-purple-400">
                GUN
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Defeats Snake
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-2 font-mono-arcade">
          Press [1] Snake · [2] Water · [3] Gun or Click to fire
        </p>
      </footer>
    </div>
  );
};
