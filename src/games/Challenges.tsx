import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { challengesPrompts } from '../data/challenges';

export function Challenges() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [challenge, setChallenge] = useState<typeof challengesPrompts[0] | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [usedChallengeIds, setUsedChallengeIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

  const player = getCurrentPlayer();

  useEffect(() => {
    let filtered = challengesPrompts.filter((c, idx) => c.intensity <= intensity && !usedChallengeIds.has(idx));

    if (filtered.length === 0) {
      setUsedChallengeIds(new Set());
      filtered = challengesPrompts.filter(c => c.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = challengesPrompts.findIndex(c => c === random);
    setChallenge(random);
    setUsedChallengeIds(prev => new Set(prev).add(randomIdx));
    setTimer(random.timeLimit || null);
  }, [intensity, currentRound]);

  // Auto-start timer
  useEffect(() => {
    if (timer === null || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(t => (t !== null && t > 0 ? t - 1 : t));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleNext = () => {
    nextTurn();
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  if (!challenge) return null;

  if (showingPass) {
    return (
      <PassPhoneScreen
        playerName={player?.name}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  const isUrgent = timer !== null && timer <= 5;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="challenges"
    >
      <GameCard>
        {/* Challenge badge */}
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(240,96,64,0.18), rgba(199,62,34,0.12))',
              color: '#f06040',
              border: '1.5px solid rgba(240,96,64,0.3)',
            }}
          >
            🎯 Challenge
          </div>
        </div>

        <p
          className="text-2xl font-black text-center mb-7 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {challenge.challenge}
        </p>

        {/* Timer */}
        {timer !== null && (
          <div className="text-center mb-7">
            <div
              className="text-6xl font-black inline-block"
              style={{
                color: isUrgent ? '#f06040' : 'var(--amber-bright)',
                animation: isUrgent ? 'pop 0.5s ease-out infinite alternate' : undefined,
                filter: isUrgent ? 'drop-shadow(0 0 12px rgba(240,96,64,0.6))' : 'none',
              }}
            >
              {timer}
            </div>
            <div
              className="text-sm font-bold mt-1"
              style={{ color: 'var(--text-muted)' }}
            >
              seconds
            </div>
          </div>
        )}

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next →
        </Button>
      </GameCard>
    </GameLayout>
  );
}
