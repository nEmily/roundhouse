import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { hotSeatPrompts } from '../data/hot-seat';

export function HotSeat() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [prompt, setPrompt] = useState<typeof hotSeatPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

  const player = getCurrentPlayer();

  useEffect(() => {
    let filtered = hotSeatPrompts.filter((p, idx) => p.intensity <= intensity && !usedPromptIds.has(idx));

    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = hotSeatPrompts.filter(p => p.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = hotSeatPrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
  }, [intensity, currentRound]);

  const handleNext = () => {
    nextTurn();
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  if (!prompt) return null;

  if (showingPass) {
    return (
      <PassPhoneScreen
        playerName={player?.name}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="hot-seat"
    >
      <GameCard>
        {/* Hot seat badge */}
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(240,96,64,0.18), rgba(245,140,20,0.12))',
              color: '#f06040',
              border: '1.5px solid rgba(240,96,64,0.3)',
            }}
          >
            🔥 Hot Seat
          </div>
        </div>

        {/* Player spotlight */}
        {player?.name && (
          <p
            className="text-center text-base font-black mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            {player.name} is on the spot!
          </p>
        )}

        <h2
          className="text-2xl font-black text-center mb-8 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {prompt.text}
        </h2>

        {/* Instructions */}
        <div
          className="rounded-2xl p-5 text-center mb-8"
          style={{
            background: 'rgba(240,96,64,0.08)',
            border: '1px solid rgba(240,96,64,0.18)',
          }}
        >
          <p
            className="text-lg font-black mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Point at someone!
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            On three — 1, 2, 3, POINT! 👉
          </p>
        </div>

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next →
        </Button>
      </GameCard>
    </GameLayout>
  );
}
