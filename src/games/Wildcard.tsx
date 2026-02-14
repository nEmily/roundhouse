import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { wildcardPrompts } from '../data/wildcard';

export function Wildcard() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [prompt, setPrompt] = useState<typeof wildcardPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter wildcards by intensity (<=) and not already used
    let filtered = wildcardPrompts.filter((w, idx) => w.intensity <= intensity && !usedPromptIds.has(idx));

    // If all wildcards used, reset and use any available
    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = wildcardPrompts.filter(w => w.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = wildcardPrompts.findIndex(w => w === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
  }, [intensity]);

  const handleNext = () => {
    nextRound();
  };

  if (!player || !prompt) return null;

  return (
    <GameLayout
      round={currentRound}
      gameMode="wildcard"
    >
      <GameCard>
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2 rounded-full text-lg font-bold mb-4">
            🎲 Wildcard
          </div>
        </div>

        <p className="text-3xl md:text-4xl font-bold text-center mb-12 leading-relaxed">
          {prompt.prompt}
        </p>

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next Round
        </Button>
      </GameCard>
    </GameLayout>
  );
}
