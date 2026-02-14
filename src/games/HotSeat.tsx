import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { hotSeatPrompts } from '../data/hot-seat';

export function HotSeat() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [prompt, setPrompt] = useState<typeof hotSeatPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

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
  }, [intensity]);

  if (!prompt) return null;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="hot-seat"
    >
      <GameCard>
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-2 rounded-full text-lg font-bold mb-4">
            🔥 Hot Seat
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 leading-relaxed">
          {prompt.text}
        </h2>

        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/30 rounded-2xl p-6 text-center mb-10">
          <p className="text-xl font-bold mb-2">Point at someone!</p>
          <p className="text-base text-slate-300">On three — 1, 2, 3, POINT! 👉</p>
        </div>

        <Button onClick={() => nextRound()} variant="primary" size="lg" className="w-full">
          Next Round
        </Button>
      </GameCard>
    </GameLayout>
  );
}
