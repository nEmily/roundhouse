import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { hotTakesPrompts } from '../data/hot-takes';

export function HotTakes() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [hotTake, setHotTake] = useState<typeof hotTakesPrompts[0] | null>(null);
  const [usedHotTakeIds, setUsedHotTakeIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState<string | undefined>(undefined);

  const player = getCurrentPlayer();

  useEffect(() => {
    let filtered = hotTakesPrompts.filter((h, idx) => h.intensity <= intensity && !usedHotTakeIds.has(idx));

    if (filtered.length === 0) {
      setUsedHotTakeIds(new Set());
      filtered = hotTakesPrompts.filter(h => h.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = hotTakesPrompts.findIndex(h => h === random);
    setHotTake(random);
    setUsedHotTakeIds(prev => new Set(prev).add(randomIdx));
  }, [intensity, currentRound]);

  const handleNext = () => {
    if (players.length > 0) {
      const currentIndex = players.findIndex(p => p.id === player?.id);
      const nextIndex = (currentIndex + 1) % players.length;
      setNextPlayerName(players[nextIndex]?.name);
      setShowingPass(true);
    }
    nextTurn();
  };

  if (!hotTake) return null;

  if (showingPass) {
    return (
      <PassPhoneScreen
        playerName={nextPlayerName}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="hot-takes"
    >
      <GameCard>
        {/* Flame header */}
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(240,96,64,0.2), rgba(245,120,20,0.2))',
              color: '#f06040',
              border: '1.5px solid rgba(240,96,64,0.35)',
            }}
          >
            🌶️ Hot Take
          </div>
        </div>

        <h2
          className="text-2xl font-black text-center mb-8 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          "{hotTake.opinion}"
        </h2>

        {/* Debate call-to-action */}
        <div
          className="rounded-2xl p-5 text-center mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(240,96,64,0.1), rgba(245,120,20,0.08))',
            border: '1px solid rgba(240,96,64,0.2)',
          }}
        >
          <p
            className="text-lg font-black mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Debate it out!
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            Minority drinks 🍺
          </p>
        </div>

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next →
        </Button>
      </GameCard>
    </GameLayout>
  );
}
