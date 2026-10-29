import React from 'react';
import { X, Trophy, TrendingUp, BarChart2, Flame, RotateCcw, History } from 'lucide-react';
import { PlayerStats, RoundRecord, calculateWinPercentage, CHOICE_MAP } from '../game/rules';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  history: RoundRecord[];
  playerName: string;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  playerName,
}) => {
  if (!isOpen) return null;

  const winRate = calculateWinPercentage(stats.roundsWon, stats.roundsLost);
  const totalDecisiveRounds = stats.roundsWon + stats.roundsLost;

  // Choice proportions
  const totalChoices = stats.choiceCounts.snake + stats.choiceCounts.water + stats.choiceCounts.gun || 1;
  const snakePct = Math.round((stats.choiceCounts.snake / totalChoices) * 100);
  const waterPct = Math.round((stats.choiceCounts.water / totalChoices) * 100);
  const gunPct = Math.round((stats.choiceCounts.gun / totalChoices) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-drawer-title"
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
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 id="stats-drawer-title" className="text-xl sm:text-2xl font-bold font-heading text-white">
                Career Performance: {playerName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Stored locally in your browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close stats dialog"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-level KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Win Rate</span>
            <div className="text-2xl font-bold font-heading text-emerald-400 mt-1 tabular-nums">
              {winRate}%
            </div>
            <span className="text-[10px] text-slate-400">Excl. draws</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Matches Played</span>
            <div className="text-2xl font-bold font-heading text-cyan-400 mt-1 tabular-nums">
              {stats.totalMatches}
            </div>
            <span className="text-[10px] text-slate-400">{stats.matchesWon}W · {stats.matchesLost}L · {stats.matchesDrawn}D</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Rounds Won</span>
            <div className="text-2xl font-bold font-heading text-purple-400 mt-1 tabular-nums">
              {stats.roundsWon}
            </div>
            <span className="text-[10px] text-slate-400">of {stats.totalRounds} total</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Streak</span>
            <div className="text-2xl font-bold font-heading text-amber-400 mt-1 tabular-nums flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-500 inline" /> {stats.currentStreak}
            </div>
            <span className="text-[10px] text-slate-400">Best: {stats.bestStreak}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-6 bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" /> Weapon Choice Tendency
          </h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400 font-bold">🐍 Snake ({stats.choiceCounts.snake})</span>
                <span className="tabular-nums font-mono-arcade">{snakePct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${snakePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-cyan-400 font-bold">💧 Water ({stats.choiceCounts.water})</span>
                <span className="tabular-nums font-mono-arcade">{waterPct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${waterPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-purple-400 font-bold">🔫 Gun ({stats.choiceCounts.gun})</span>
                <span className="tabular-nums font-mono-arcade">{gunPct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${gunPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Match History Table */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" /> Recent Rounds Log ({history.length})
            </span>
          </h3>

          {history.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl text-slate-500 text-sm">
              No rounds recorded yet in this session. Start a duel!
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-mono-arcade">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Player</th>
                    <th className="p-2.5">Opponent</th>
                    <th className="p-2.5">Result</th>
                    <th className="p-2.5 hidden sm:table-cell">Outcome Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 font-mono-arcade">
                  {[...history].reverse().map((round, idx) => {
                    const playerMeta = CHOICE_MAP[round.playerChoice];
                    const compMeta = CHOICE_MAP[round.computerChoice];
                    return (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-2.5 text-slate-400 font-bold">R{round.roundNumber}</td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-200">
                            <span>{playerMeta.emoji}</span> {playerMeta.name}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-400">
                            <span>{compMeta.emoji}</span> {compMeta.name}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {round.result === 'win' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              WIN
                            </span>
                          )}
                          {round.result === 'lose' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              LOSE
                            </span>
                          )}
                          {round.result === 'draw' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              DRAW
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-400 hidden sm:table-cell text-[11px] truncate max-w-xs font-sans-main">
                          {round.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold font-heading rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
