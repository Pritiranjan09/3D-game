import React, { useState } from 'react';
import { Play, HelpCircle, Settings, Trophy, Shield, Bot, User, Check, Zap } from 'lucide-react';
import { GameMode, Difficulty } from '../game/rules';
import { SnakeArt, WaterArt, GunArt } from './ArtIcons';
import { audioSystem } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: (nickname: string, mode: GameMode, avatar: string) => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  currentDifficulty: Difficulty;
  savedNickname: string;
  savedAvatar: string;
}

const AVATARS = [
  { id: 'viper', label: 'Viper', emoji: '🐍', color: 'border-emerald-500' },
  { id: 'hydro', label: 'Hydro', emoji: '💧', color: 'border-cyan-500' },
  { id: 'cyborg', label: 'Cyborg', emoji: '🤖', color: 'border-purple-500' },
  { id: 'ninja', label: 'Ninja', emoji: '🥷', color: 'border-amber-500' },
  { id: 'pilot', label: 'Ace', emoji: '⚡', color: 'border-rose-500' },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenStats,
  currentMode,
  onModeChange,
  currentDifficulty,
  savedNickname,
  savedAvatar,
}) => {
  const [nickname, setNickname] = useState(savedNickname || 'Player 1');
  const [avatar, setAvatar] = useState(savedAvatar || 'viper');

  const handleStart = () => {
    const trimmed = nickname.trim() || 'Player 1';
    audioSystem.click();
    onStartGame(trimmed, currentMode, avatar);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 max-w-5xl mx-auto z-10 selection:bg-emerald-500 selection:text-black">
      {/* Top Utility Bar */}
      <header className="w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono-arcade font-bold rounded-md bg-slate-900/90 border border-slate-700/80 text-emerald-400 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> ULTIMATE EDITION
          </span>
          <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-mono-arcade text-slate-400 rounded bg-slate-900/60 border border-slate-800">
            AI: {currentDifficulty.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioSystem.click();
              onOpenStats();
            }}
            aria-label="View career statistics"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          <button
            onClick={() => {
              audioSystem.click();
              onOpenHowToPlay();
            }}
            aria-label="How to play guide"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">How To Play</span>
          </button>

          <button
            onClick={() => {
              audioSystem.click();
              onOpenSettings();
            }}
            aria-label="Open settings"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>

      {/* Hero Showcase Centerpiece */}
      <main className="w-full flex flex-col items-center text-center my-auto py-6 sm:py-10">
        {/* Inline Bespoke SVG Title Lockup */}
        <div className="mb-6">
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
              SNAKE · WATER · GUN
            </h1>
          </div>
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-sans-main tracking-wide max-w-md mx-auto">
            Choose your move. Outsmart your opponent.
          </p>
        </div>

        {/* Trio Elemental Showcase Badges */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 my-4">
          <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl glow-emerald">
              <SnakeArt size={64} glow />
            </div>
            <span className="mt-2 text-xs font-bold font-heading text-emerald-400 tracking-wider">
              SNAKE
            </span>
          </div>

          <div className="text-xl font-mono-arcade font-extrabold text-slate-600">VS</div>

          <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl glow-cyan">
              <WaterArt size={64} glow />
            </div>
            <span className="mt-2 text-xs font-bold font-heading text-cyan-400 tracking-wider">
              WATER
            </span>
          </div>

          <div className="text-xl font-mono-arcade font-extrabold text-slate-600">VS</div>

          <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-2xl glow-purple">
              <GunArt size={64} glow />
            </div>
            <span className="mt-2 text-xs font-bold font-heading text-purple-400 tracking-wider">
              GUN
            </span>
          </div>
        </div>

        {/* Player Profile & Mode Selection Card */}
        <div className="w-full max-w-lg mt-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          {/* Nickname & Avatar input */}
          <div className="mb-5 text-left">
            <label htmlFor="player-nickname" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <User className="w-3.5 h-3.5 text-emerald-400" /> Enter Your Nickname
            </label>
            <div className="flex gap-2">
              <input
                id="player-nickname"
                type="text"
                maxLength={18}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Callsign / Nickname"
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStart();
                }}
              />
            </div>

            {/* Avatar Selector */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 whitespace-nowrap">Avatar:</span>
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => {
                    audioSystem.click();
                    setAvatar(av.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                    avatar === av.id
                      ? `${av.color} bg-slate-800 text-white shadow-sm font-bold`
                      : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{av.emoji}</span>
                  <span>{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="mb-6 text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Select Game Mode
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  audioSystem.click();
                  onModeChange('quick');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentMode === 'quick'
                    ? 'bg-amber-950/40 border-amber-500 text-amber-300 glow-amber'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-xs">Quick Play</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Endless rounds</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioSystem.click();
                  onModeChange('best_of_5');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentMode === 'best_of_5'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 glow-emerald'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-xs">Best of 5</div>
                <div className="text-[10px] text-slate-400 mt-0.5">First to 3 wins</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioSystem.click();
                  onModeChange('best_of_10');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentMode === 'best_of_10'
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 glow-cyan'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-xs">Best of 10</div>
                <div className="text-[10px] text-slate-400 mt-0.5">10 round limit</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  audioSystem.click();
                  onModeChange('practice');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentMode === 'practice'
                    ? 'bg-purple-950/40 border-purple-500 text-purple-300 glow-purple'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-xs">Practice</div>
                <div className="text-[10px] text-slate-400 mt-0.5">No stats impact</div>
              </button>
            </div>
          </div>

          {/* Primary Start CTA Button */}
          <button
            onClick={handleStart}
            data-start="true"
            aria-label="Start Game"
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black font-heading tracking-wider rounded-2xl shadow-xl hover:shadow-cyan-500/25 transition-all text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            ENTER ARENA (START)
          </button>
        </div>
      </main>

      {/* Flat Control Hints Footer */}
      <footer className="w-full pb-2 text-center">
        <p className="text-xs text-slate-400 font-mono-arcade">
          [1] Snake · [2] Water · [3] Gun · [Enter] Start · [M] Mute
        </p>
      </footer>
    </div>
  );
};
