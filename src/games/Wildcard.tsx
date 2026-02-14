import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { wildcardPrompts } from '../data/wildcard';

export function Wildcard() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [prompt, setPrompt] = useState<typeof wildcardPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

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
    nextTurn();
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  if (!prompt) return null;

  if (showingPass) {
    return (
      <div className="min-h-dvh bg-slate-900 text-slate-50 flex items-center justify-center p-6 safe-area-padding animate-fade-in">
        <div className="text-center max-w-2xl w-full">
          <div className="text-5xl mb-6">📱</div>
          <div className="text-4xl font-bold mb-8">Pass the phone to</div>
          <div className="text-6xl font-bold mb-12 bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent animate-glow">
            {player?.name}!
          </div>
          <button
            onClick={() => setShowingPass(false)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-3xl px-16 py-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg active:scale-95"
          >
            Ready
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
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
          Next
        </Button>
      </GameCard>
    </GameLayout>
  );
}
