import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { wildcardPrompts } from '../data/wildcard';

export function Wildcard() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [prompt, setPrompt] = useState<typeof wildcardPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState<string | undefined>(undefined);

  const player = getCurrentPlayer();

  useEffect(() => {
    let filtered = wildcardPrompts.filter((w, idx) => w.intensity <= intensity && !usedPromptIds.has(idx));

    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = wildcardPrompts.filter(w => w.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = wildcardPrompts.findIndex(w => w === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
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

  if (!prompt) return null;

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
      gameMode="wildcard"
    >
      <GameCard>
        {/* Wildcard badge */}
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.12))',
              color: '#fbbf24',
              border: '1.5px solid rgba(251,191,36,0.35)',
            }}
          >
            🃏 Wildcard
          </div>
        </div>

        <p
          className="text-2xl font-black text-center mb-12 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {prompt.prompt}
        </p>

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next →
        </Button>
      </GameCard>
    </GameLayout>
  );
}
