/**
 * Snake, Water, Gun — Pure Game Rules & AI Engine
 */

export type Choice = 'snake' | 'water' | 'gun';
export type GameMode = 'quick' | 'best_of_5' | 'best_of_10' | 'practice';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type RoundResult = 'win' | 'lose' | 'draw';

export interface ChoiceMetadata {
  id: Choice;
  name: string;
  emoji: string;
  color: string;
  glowClass: string;
  textGlowClass: string;
  borderClass: string;
  beats: Choice;
  beatenBy: Choice;
  verb: string;
  actionExplanation: string;
}

export const CHOICE_MAP: Record<Choice, ChoiceMetadata> = {
  snake: {
    id: 'snake',
    name: 'Snake',
    emoji: '🐍',
    color: '#10b981', // Emerald
    glowClass: 'glow-emerald',
    textGlowClass: 'text-glow-emerald',
    borderClass: 'border-emerald-500',
    beats: 'water',
    beatenBy: 'gun',
    verb: 'drinks',
    actionExplanation: 'Snake effortlessly consumes water to survive!',
  },
  water: {
    id: 'water',
    name: 'Water',
    emoji: '💧',
    color: '#06b6d4', // Cyan
    glowClass: 'glow-cyan',
    textGlowClass: 'text-glow-cyan',
    borderClass: 'border-cyan-500',
    beats: 'gun',
    beatenBy: 'snake',
    verb: 'douses',
    actionExplanation: 'Water douses gunpowder and floods the barrel!',
  },
  gun: {
    id: 'gun',
    name: 'Gun',
    emoji: '🔫',
    color: '#a855f7', // Purple
    glowClass: 'glow-purple',
    textGlowClass: 'text-glow-purple',
    borderClass: 'border-purple-500',
    beats: 'snake',
    beatenBy: 'water',
    verb: 'shoots',
    actionExplanation: 'Gun fires a precise projectile, eliminating the snake!',
  },
};

export const ALL_CHOICES: Choice[] = ['snake', 'water', 'gun'];

export interface RoundRecord {
  roundNumber: number;
  playerChoice: Choice;
  computerChoice: Choice;
  result: RoundResult;
  reason: string;
  timestamp: number;
}

export interface PlayerStats {
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  matchesDrawn: number;
  totalRounds: number;
  roundsWon: number;
  roundsLost: number;
  roundsDrawn: number;
  currentStreak: number;
  bestStreak: number;
  choiceCounts: Record<Choice, number>;
}

export const DEFAULT_STATS: PlayerStats = {
  totalMatches: 0,
  matchesWon: 0,
  matchesLost: 0,
  matchesDrawn: 0,
  totalRounds: 0,
  roundsWon: 0,
  roundsLost: 0,
  roundsDrawn: 0,
  currentStreak: 0,
  bestStreak: 0,
  choiceCounts: {
    snake: 0,
    water: 0,
    gun: 0,
  },
};

/**
 * Determines winner of a single round and explains the outcome.
 */
export function determineWinner(player: Choice, computer: Choice): { result: RoundResult; reason: string } {
  if (player === computer) {
    const meta = CHOICE_MAP[player];
    return {
      result: 'draw',
      reason: `Both chose ${meta.name}! Stand-off with zero damage dealt.`,
    };
  }

  const playerMeta = CHOICE_MAP[player];
  if (playerMeta.beats === computer) {
    const computerMeta = CHOICE_MAP[computer];
    return {
      result: 'win',
      reason: `${playerMeta.name} ${playerMeta.verb} ${computerMeta.name}! You score a point.`,
    };
  }

  const computerMeta = CHOICE_MAP[computer];
  return {
    result: 'lose',
    reason: `${computerMeta.name} ${computerMeta.verb} ${playerMeta.name}! Opponent scores a point.`,
  };
}

/**
 * Returns which choice beats a given choice.
 */
export function getCounterChoice(choice: Choice): Choice {
  return CHOICE_MAP[choice].beatenBy;
}

/**
 * Returns what the given choice beats.
 */
export function getLosingChoice(choice: Choice): Choice {
  return CHOICE_MAP[choice].beats;
}

/**
 * Calculates win percentage excluding draws.
 */
export function calculateWinPercentage(wins: number, losses: number): number {
  const decisiveRounds = wins + losses;
  if (decisiveRounds === 0) return 0;
  return Math.round((wins / decisiveRounds) * 100);
}

/**
 * Generates computer choice based on selected AI difficulty.
 */
export function getComputerChoice(
  difficulty: Difficulty,
  recentHistory: RoundRecord[] = []
): Choice {
  const getRandom = (): Choice => ALL_CHOICES[Math.floor(Math.random() * ALL_CHOICES.length)];

  if (difficulty === 'easy' || recentHistory.length === 0) {
    return getRandom();
  }

  const lastRound = recentHistory[recentHistory.length - 1];

  if (difficulty === 'medium') {
    // 45% of the time, counters what player played in the previous round
    // 55% uniform random
    if (Math.random() < 0.45 && lastRound) {
      return getCounterChoice(lastRound.playerChoice);
    }
    return getRandom();
  }

  // Hard Mode: Markov Chain pattern prediction
  // Builds transition model: Given last player choice, what did player pick next?
  if (difficulty === 'hard') {
    if (recentHistory.length >= 3) {
      const transitions: Record<Choice, Record<Choice, number>> = {
        snake: { snake: 0, water: 0, gun: 0 },
        water: { snake: 0, water: 0, gun: 0 },
        gun: { snake: 0, water: 0, gun: 0 },
      };

      for (let i = 0; i < recentHistory.length - 1; i++) {
        const from = recentHistory[i].playerChoice;
        const to = recentHistory[i + 1].playerChoice;
        transitions[from][to] += 1;
      }

      const nextTransitions = transitions[lastRound.playerChoice];
      const maxCount = Math.max(nextTransitions.snake, nextTransitions.water, nextTransitions.gun);

      if (maxCount > 0) {
        // Find most likely player choice
        const predictedPlayerMoves = ALL_CHOICES.filter(
          (c) => nextTransitions[c] === maxCount
        );
        const predictedChoice = predictedPlayerMoves[Math.floor(Math.random() * predictedPlayerMoves.length)];
        // Counter the predicted choice 75% of the time
        if (Math.random() < 0.75) {
          return getCounterChoice(predictedChoice);
        }
      }
    }

    // Secondary heuristic: Counter player's most frequent overall choice or last pick
    const choiceCounts: Record<Choice, number> = { snake: 0, water: 0, gun: 0 };
    for (const rec of recentHistory) {
      choiceCounts[rec.playerChoice]++;
    }
    const maxFreq = Math.max(choiceCounts.snake, choiceCounts.water, choiceCounts.gun);
    const mostFrequent = ALL_CHOICES.find((c) => choiceCounts[c] === maxFreq) || lastRound.playerChoice;

    if (Math.random() < 0.6) {
      return getCounterChoice(mostFrequent);
    }

    return getRandom();
  }

  return getRandom();
}

/**
 * Checks match completion status based on game mode.
 */
export function checkMatchStatus(
  mode: GameMode,
  playerScore: number,
  computerScore: number,
  totalRounds: number
): { isOver: boolean; winner: 'player' | 'computer' | 'draw' | null } {
  if (mode === 'quick' || mode === 'practice') {
    return { isOver: false, winner: null };
  }

  if (mode === 'best_of_5') {
    // First to 3 wins
    if (playerScore >= 3) {
      return { isOver: true, winner: 'player' };
    }
    if (computerScore >= 3) {
      return { isOver: true, winner: 'computer' };
    }
    return { isOver: false, winner: null };
  }

  if (mode === 'best_of_10') {
    // Up to 10 rounds limit (draws count toward the 10 round cap)
    if (totalRounds >= 10) {
      if (playerScore > computerScore) {
        return { isOver: true, winner: 'player' };
      } else if (computerScore > playerScore) {
        return { isOver: true, winner: 'computer' };
      } else {
        return { isOver: true, winner: 'draw' };
      }
    }
    // Early clinch check: if remaining rounds cannot change outcome
    const remainingRounds = 10 - totalRounds;
    if (playerScore > computerScore + remainingRounds) {
      return { isOver: true, winner: 'player' };
    }
    if (computerScore > playerScore + remainingRounds) {
      return { isOver: true, winner: 'computer' };
    }
    return { isOver: false, winner: null };
  }

  return { isOver: false, winner: null };
}
