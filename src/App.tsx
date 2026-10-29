/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Choice, GameMode, Difficulty, RoundResult, RoundRecord, PlayerStats, 
  DEFAULT_STATS, determineWinner, getComputerChoice, checkMatchStatus, 
  calculateWinPercentage 
} from './game/rules';
import { audioSystem } from './utils/audio';
import { TitleScreen } from './components/TitleScreen';
import { ClashArena } from './components/ClashArena';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsDrawer } from './components/StatsDrawer';
import { MatchEndModal } from './components/MatchEndModal';

export default function App() {
  // Screen state
  const [gameState, setGameState] = useState<'title' | 'playing' | 'gameover'>('title');

  // Player configuration
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('swg_player_name') || 'Player 1';
  });
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem('swg_avatar') || 'viper';
  });
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    return (localStorage.getItem('swg_mode') as GameMode) || 'best_of_5';
  });
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    return (localStorage.getItem('swg_difficulty') as Difficulty) || 'medium';
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => audioSystem.isMuted());
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('swg_reduced_motion') === 'true';
  });

  // Persistent Statistics
  const [stats, setStats] = useState<PlayerStats>(() => {
    const raw = localStorage.getItem('swg_stats');
    if (raw) {
      try {
        return { ...DEFAULT_STATS, ...JSON.parse(raw) };
      } catch {
        return DEFAULT_STATS;
      }
    }
    return DEFAULT_STATS;
  });

  // Active Match State
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [matchHistory, setMatchHistory] = useState<RoundRecord[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  // Active Round Clash State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [playerSelection, setPlayerSelection] = useState<Choice | null>(null);
  const [computerSelection, setComputerSelection] = useState<Choice | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const [outcomeReason, setOutcomeReason] = useState<string | null>(null);

  // Match Over State
  const [matchWinner, setMatchWinner] = useState<'player' | 'computer' | 'draw' | null>(null);

  // Modals
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);

  // Keep ref for keydown listener without stale closures
  const stateRef = useRef({
    gameState,
    isProcessing,
    isHowToPlayOpen,
    isSettingsOpen,
    isStatsOpen,
    matchWinner,
    gameMode,
    playerName,
    avatar,
  });
  useEffect(() => {
    stateRef.current = {
      gameState,
      isProcessing,
      isHowToPlayOpen,
      isSettingsOpen,
      isStatsOpen,
      matchWinner,
      gameMode,
      playerName,
      avatar,
    };
  });

  // Sync body dataset state
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Support ?autostart=1 parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startNewMatch(playerName, gameMode, avatar);
    }
  }, []);

  // Save persistent stats
  const saveStats = (newStats: PlayerStats) => {
    setStats(newStats);
    localStorage.setItem('swg_stats', JSON.stringify(newStats));
  };

  // Start new match
  const startNewMatch = (pName: string, mode: GameMode, av: string) => {
    setPlayerName(pName);
    setGameMode(mode);
    setAvatar(av);
    localStorage.setItem('swg_player_name', pName);
    localStorage.setItem('swg_mode', mode);
    localStorage.setItem('swg_avatar', av);

    // Reset match variables
    setPlayerScore(0);
    setComputerScore(0);
    setCurrentRound(1);
    setPlayerSelection(null);
    setComputerSelection(null);
    setRoundResult(null);
    setOutcomeReason(null);
    setCountdown(null);
    setIsProcessing(false);
    setMatchWinner(null);
    setGameState('playing');
  };

  // Restart current match with same settings
  const handleRestartMatch = () => {
    audioSystem.click();
    startNewMatch(playerName, gameMode, avatar);
  };

  // Reset career statistics
  const handleResetStats = () => {
    setStats(DEFAULT_STATS);
    setMatchHistory([]);
    setCurrentStreak(0);
    localStorage.removeItem('swg_stats');
  };

  // Handle player choice action
  const handleChoice = useCallback((choice: Choice) => {
    if (isProcessing || gameState !== 'playing') return;

    setIsProcessing(true);
    setPlayerSelection(choice);
    setComputerSelection(null);
    setRoundResult(null);
    setOutcomeReason(null);

    audioSystem.choiceSound(choice);

    // Dramatic Countdown: 3, 2, 1, Clash!
    let currentCount = 3;
    setCountdown(3);
    audioSystem.tick(1);

    const timer = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCountdown(currentCount);
        audioSystem.tick(1 + (3 - currentCount) * 0.25);
      } else {
        clearInterval(timer);
        setCountdown(null);

        // Generate computer pick
        const compChoice = getComputerChoice(difficulty, matchHistory);
        setComputerSelection(compChoice);

        // Clash impact
        audioSystem.clash();

        // Determine outcome
        const outcome = determineWinner(choice, compChoice);
        setRoundResult(outcome.result);
        setOutcomeReason(outcome.reason);

        // Calculate score deltas
        let newPlayerScore = playerScore;
        let newComputerScore = computerScore;
        let newStreak = currentStreak;

        if (outcome.result === 'win') {
          newPlayerScore += 1;
          newStreak += 1;
          audioSystem.win();
        } else if (outcome.result === 'lose') {
          newComputerScore += 1;
          newStreak = 0;
          audioSystem.lose();
        } else {
          audioSystem.draw();
        }

        setPlayerScore(newPlayerScore);
        setComputerScore(newComputerScore);
        setCurrentStreak(newStreak);

        // Record round
        const newRecord: RoundRecord = {
          roundNumber: currentRound,
          playerChoice: choice,
          computerChoice: compChoice,
          result: outcome.result,
          reason: outcome.reason,
          timestamp: Date.now(),
        };
        const updatedHistory = [...matchHistory, newRecord];
        setMatchHistory(updatedHistory);

        // Update persistent stats (if not practice mode)
        if (gameMode !== 'practice') {
          const updatedStats: PlayerStats = {
            ...stats,
            totalRounds: stats.totalRounds + 1,
            roundsWon: stats.roundsWon + (outcome.result === 'win' ? 1 : 0),
            roundsLost: stats.roundsLost + (outcome.result === 'lose' ? 1 : 0),
            roundsDrawn: stats.roundsDrawn + (outcome.result === 'draw' ? 1 : 0),
            currentStreak: newStreak,
            bestStreak: Math.max(stats.bestStreak, newStreak),
            choiceCounts: {
              ...stats.choiceCounts,
              [choice]: stats.choiceCounts[choice] + 1,
            },
          };
          saveStats(updatedStats);
        }

        // Check if overall match is over
        const status = checkMatchStatus(gameMode, newPlayerScore, newComputerScore, currentRound);

        if (status.isOver && status.winner) {
          // Update match-level career stats
          if (gameMode !== 'practice') {
            const updatedStats: PlayerStats = {
              ...stats,
              totalMatches: stats.totalMatches + 1,
              matchesWon: stats.matchesWon + (status.winner === 'player' ? 1 : 0),
              matchesLost: stats.matchesLost + (status.winner === 'computer' ? 1 : 0),
              matchesDrawn: stats.matchesDrawn + (status.winner === 'draw' ? 1 : 0),
              totalRounds: stats.totalRounds + 1,
              roundsWon: stats.roundsWon + (outcome.result === 'win' ? 1 : 0),
              roundsLost: stats.roundsLost + (outcome.result === 'lose' ? 1 : 0),
              roundsDrawn: stats.roundsDrawn + (outcome.result === 'draw' ? 1 : 0),
              currentStreak: newStreak,
              bestStreak: Math.max(stats.bestStreak, newStreak),
              choiceCounts: {
                ...stats.choiceCounts,
                [choice]: stats.choiceCounts[choice] + 1,
              },
            };
            saveStats(updatedStats);
          }

          setTimeout(() => {
            setMatchWinner(status.winner);
            setGameState('gameover');
            setIsProcessing(false);
          }, 1200);
        } else {
          // Advance to next round after short delay
          setTimeout(() => {
            setCurrentRound((prev) => prev + 1);
            setIsProcessing(false);
          }, 1100);
        }
      }
    }, 450);
  }, [
    isProcessing, gameState, difficulty, matchHistory, playerScore, computerScore, 
    currentStreak, currentRound, gameMode, stats
  ]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const key = e.key.toLowerCase();
      const s = stateRef.current;

      // Title screen quick-start on Enter or Space
      if (s.gameState === 'title' && (key === 'enter' || key === ' ')) {
        e.preventDefault();
        startNewMatch(s.playerName, s.gameMode, s.avatar);
        return;
      }

      // Mute toggle
      if (key === 'm') {
        const nextMuted = audioSystem.toggleMute();
        setIsMuted(nextMuted);
        return;
      }

      // In game keyboard controls
      if (s.gameState === 'playing' && !s.isProcessing) {
        if (key === '1' || key === 's') {
          handleChoice('snake');
        } else if (key === '2' || key === 'w') {
          handleChoice('water');
        } else if (key === '3' || key === 'g') {
          handleChoice('gun');
        } else if (key === 'r') {
          handleRestartMatch();
        }
      }

      // Close modal on Escape
      if (key === 'escape') {
        setIsHowToPlayOpen(false);
        setIsSettingsOpen(false);
        setIsStatsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleChoice]);

  return (
    <div className="relative min-h-screen bg-[#08090f] text-slate-100 font-sans-main overflow-x-hidden">
      {/* Background Ambient Cyber Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
      </div>

      {/* Screen Views */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={(pName, mode, av) => startNewMatch(pName, mode, av)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          currentMode={gameMode}
          onModeChange={(m) => {
            setGameMode(m);
            localStorage.setItem('swg_mode', m);
          }}
          currentDifficulty={difficulty}
          savedNickname={playerName}
          savedAvatar={avatar}
        />
      )}

      {(gameState === 'playing' || gameState === 'gameover') && (
        <ClashArena
          playerName={playerName}
          avatar={avatar}
          gameMode={gameMode}
          difficulty={difficulty}
          playerScore={playerScore}
          computerScore={computerScore}
          currentRound={currentRound}
          isProcessing={isProcessing}
          countdown={countdown}
          playerSelection={playerSelection}
          computerSelection={computerSelection}
          roundResult={roundResult}
          outcomeReason={outcomeReason}
          onSelectChoice={handleChoice}
          onRestartMatch={handleRestartMatch}
          onReturnToTitle={() => {
            audioSystem.click();
            setGameState('title');
          }}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(audioSystem.toggleMute())}
          streak={currentStreak}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Match End Modal */}
      <MatchEndModal
        isOpen={gameState === 'gameover'}
        winner={matchWinner}
        mode={gameMode}
        playerScore={playerScore}
        computerScore={computerScore}
        totalRounds={currentRound}
        playerName={playerName}
        onPlayAgain={handleRestartMatch}
        onReturnToTitle={() => {
          audioSystem.click();
          setGameState('title');
        }}
      />

      {/* How To Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        difficulty={difficulty}
        onDifficultyChange={(d) => {
          setDifficulty(d);
          localStorage.setItem('swg_difficulty', d);
        }}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(audioSystem.toggleMute())}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => {
          const next = !reducedMotion;
          setReducedMotion(next);
          localStorage.setItem('swg_reduced_motion', String(next));
        }}
        onResetStats={handleResetStats}
      />

      {/* Career Stats Drawer */}
      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        history={matchHistory}
        playerName={playerName}
      />
    </div>
  );
}
