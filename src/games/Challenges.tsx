import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { challengesPrompts } from '../data/challenges';

export function Challenges() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [challenge, setChallenge] = useState<typeof challengesPrompts[0] | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [usedChallengeIds, setUsedChallengeIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter challenges by intensity (<=) and not already used
    let filtered = challengesPrompts.filter((c, idx) => c.intensity <= intensity && !usedChallengeIds.has(idx));

    // If all challenges used, reset and use any available
    if (filtered.length === 0) {
      setUsedChallengeIds(new Set());
      filtered = challengesPrompts.filter(c => c.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = challengesPrompts.findIndex(c => c === random);
    setChallenge(random);
    setUsedChallengeIds(prev => new Set(prev).add(randomIdx));
    setIsRunning(false);
    setTimer(random.timeLimit || null);
  }, [intensity]);

  useEffect(() => {
    if (!isRunning || timer === null || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(t => (t !== null && t > 0 ? t - 1 : t));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleComplete = () => {
    nextRound();
  };

  if (!challenge) return null;

  const hasTimer = challenge.timeLimit !== undefined;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="challenges"
    >
      <GameCard>
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-lg font-bold mb-4">
            🎯 Challenge
          </div>
        </div>

        <p className="text-3xl md:text-4xl font-bold text-center mb-8 leading-relaxed">
          {challenge.challenge}
        </p>

        {hasTimer && timer !== null && (
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold ${timer <= 5 ? 'text-red-400 animate-pulse' : 'text-pink-400'}`}>
              {timer}s
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {hasTimer && !isRunning && (
            <Button onClick={handleStart} variant="success" size="lg" className="w-full">
              Start Timer
            </Button>
          )}

          <Button
            onClick={handleComplete}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={hasTimer && !isRunning}
          >
            {hasTimer ? 'Challenge Complete!' : 'Done'}
          </Button>
        </div>
      </GameCard>
    </GameLayout>
  );
}
