import test from 'node:test';
import assert from 'node:assert/strict';
import {
  determineWinner,
  calculateWinPercentage,
  checkMatchStatus,
  getCounterChoice,
  getLosingChoice,
  getComputerChoice,
  ALL_CHOICES,
  RoundRecord,
} from './rules.ts';

test('Rule 1: Snake defeats Water', () => {
  const result = determineWinner('snake', 'water');
  assert.equal(result.result, 'win');
  assert.match(result.reason, /Snake drinks Water/);
});

test('Rule 2: Water defeats Gun', () => {
  const result = determineWinner('water', 'gun');
  assert.equal(result.result, 'win');
  assert.match(result.reason, /Water douses/);
});

test('Rule 3: Gun defeats Snake', () => {
  const result = determineWinner('gun', 'snake');
  assert.equal(result.result, 'win');
  assert.match(result.reason, /Gun shoots/);
});

test('Rule 4: Identical choices result in draw', () => {
  for (const choice of ALL_CHOICES) {
    const outcome = determineWinner(choice, choice);
    assert.equal(outcome.result, 'draw');
    assert.match(outcome.reason, /Stand-off/);
  }
});

test('Rule 5: Inverse matchups lose correctly', () => {
  assert.equal(determineWinner('water', 'snake').result, 'lose');
  assert.equal(determineWinner('gun', 'water').result, 'lose');
  assert.equal(determineWinner('snake', 'gun').result, 'lose');
});

test('Counters & Losing mappings are consistent', () => {
  assert.equal(getCounterChoice('water'), 'snake');
  assert.equal(getCounterChoice('gun'), 'water');
  assert.equal(getCounterChoice('snake'), 'gun');

  assert.equal(getLosingChoice('snake'), 'water');
  assert.equal(getLosingChoice('water'), 'gun');
  assert.equal(getLosingChoice('gun'), 'snake');
});

test('Win rate calculation excludes draws', () => {
  assert.equal(calculateWinPercentage(0, 0), 0);
  assert.equal(calculateWinPercentage(5, 5), 50);
  assert.equal(calculateWinPercentage(3, 1), 75);
  assert.equal(calculateWinPercentage(10, 0), 100);
  assert.equal(calculateWinPercentage(0, 4), 0);
});

test('Best of 5 mode ends at 3 wins', () => {
  assert.deepEqual(checkMatchStatus('best_of_5', 2, 2, 6), { isOver: false, winner: null });
  assert.deepEqual(checkMatchStatus('best_of_5', 3, 1, 5), { isOver: true, winner: 'player' });
  assert.deepEqual(checkMatchStatus('best_of_5', 0, 3, 3), { isOver: true, winner: 'computer' });
});

test('Best of 10 mode limits to 10 rounds and detects clinch', () => {
  // Clinch when impossible to catch up: Player 6, Computer 0 with 4 rounds left
  assert.deepEqual(checkMatchStatus('best_of_10', 6, 0, 6), { isOver: true, winner: 'player' });

  // Finished 10 rounds: 5-3
  assert.deepEqual(checkMatchStatus('best_of_10', 5, 3, 10), { isOver: true, winner: 'player' });

  // Finished 10 rounds tie: 4-4
  assert.deepEqual(checkMatchStatus('best_of_10', 4, 4, 10), { isOver: true, winner: 'draw' });
});

test('Computer choice returns valid choice across difficulties', () => {
  const dummyHistory: RoundRecord[] = [
    { roundNumber: 1, playerChoice: 'snake', computerChoice: 'water', result: 'win', reason: '', timestamp: 1 },
    { roundNumber: 2, playerChoice: 'snake', computerChoice: 'gun', result: 'lose', reason: '', timestamp: 2 },
    { roundNumber: 3, playerChoice: 'water', computerChoice: 'snake', result: 'lose', reason: '', timestamp: 3 },
  ];

  for (const diff of ['easy', 'medium', 'hard'] as const) {
    for (let i = 0; i < 20; i++) {
      const choice = getComputerChoice(diff, dummyHistory);
      assert.ok(ALL_CHOICES.includes(choice));
    }
  }
});
