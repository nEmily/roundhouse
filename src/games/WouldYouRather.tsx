import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { wouldYouRatherPrompts } from '../data/would-you-rather';

export function WouldYouRather() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [prompt, setPrompt] = useState<typeof wouldYouRatherPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState<string | undefined>(undefined);

  const player = getCurrentPlayer();

  useEffect(() => {
    let filtered = wouldYouRatherPrompts.filter((p, idx) => p.intensity <= intensity && !usedPromptIds.has(idx));

    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = wouldYouRatherPrompts.filter(p => p.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = wouldYouRatherPrompts.findIndex(p => p === random);
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
      gameMode="would-you-rather"
    >
      <GameCard>
        <h2
          className="text-2xl font-black text-center mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Would You Rather...
        </h2>

        <div className="space-y-3 mb-6">
          {/* Option A — amber */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(245,166,35,0.14), rgba(224,122,16,0.1))',
              border: '1.5px solid rgba(245,166,35,0.3)',
            }}
          >
            <p
              className="text-lg font-black text-center leading-snug"
              style={{ color: '#fde68a' }}
            >
              {prompt.optionA}
            </p>
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <span
              className="text-sm font-black tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              OR
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>

          {/* Option B — coral */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(240,96,64,0.14), rgba(199,62,34,0.1))',
              border: '1.5px solid rgba(240,96,64,0.3)',
            }}
          >
            <p
              className="text-lg font-black text-center leading-snug"
              style={{ color: '#fca5a5' }}
            >
              {prompt.optionB}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="rounded-2xl p-4 text-center mb-6"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p
            className="text-base font-black mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Everyone pick a side!
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
