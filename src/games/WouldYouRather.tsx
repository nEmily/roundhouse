import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { wouldYouRatherPrompts } from '../data/would-you-rather';

export function WouldYouRather() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [prompt, setPrompt] = useState<typeof wouldYouRatherPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

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
      gameMode="would-you-rather"
    >
      <GameCard>
        <h2 className="text-3xl font-bold text-center mb-10">
          Would You Rather...
        </h2>

        <div className="space-y-4 mb-10">
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border-2 border-amber-500/30 rounded-2xl p-6">
            <p className="text-xl md:text-2xl font-bold text-center text-amber-300">
              {prompt.optionA}
            </p>
          </div>

          <div className="text-center text-2xl font-bold text-slate-500">OR</div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/30 rounded-2xl p-6">
            <p className="text-xl md:text-2xl font-bold text-center text-orange-300">
              {prompt.optionB}
            </p>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-2xl p-5 text-center mb-10">
          <p className="text-lg font-bold mb-1">Everyone pick a side!</p>
          <p className="text-base text-slate-300">Minority drinks 🍺</p>
        </div>

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next
        </Button>
      </GameCard>
    </GameLayout>
  );
}
