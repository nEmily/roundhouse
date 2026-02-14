import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { wouldYouRatherPrompts } from '../data/would-you-rather';

export function WouldYouRather() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [prompt, setPrompt] = useState<typeof wouldYouRatherPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

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
  }, [intensity]);

  if (!prompt) return null;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="would-you-rather"
    >
      <GameCard>
        <h2 className="text-3xl font-bold text-center mb-10">
          Would You Rather...
        </h2>

        <div className="space-y-4 mb-10">
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-2 border-pink-500/30 rounded-2xl p-6">
            <p className="text-xl md:text-2xl font-bold text-center text-pink-300">
              {prompt.optionA}
            </p>
          </div>

          <div className="text-center text-2xl font-bold text-slate-500">OR</div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/30 rounded-2xl p-6">
            <p className="text-xl md:text-2xl font-bold text-center text-purple-300">
              {prompt.optionB}
            </p>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-2xl p-5 text-center mb-10">
          <p className="text-lg font-bold mb-1">Everyone pick a side!</p>
          <p className="text-base text-slate-300">Minority drinks 🍺</p>
        </div>

        <Button onClick={() => nextRound()} variant="primary" size="lg" className="w-full">
          Next Round
        </Button>
      </GameCard>
    </GameLayout>
  );
}
