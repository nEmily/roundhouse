import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { truthOrDarePrompts } from '../data/truth-or-dare';

export function TruthOrDare() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [choice, setChoice] = useState<'truth' | 'dare' | null>(null);
  const [prompt, setPrompt] = useState<typeof truthOrDarePrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

  const player = getCurrentPlayer();

  const handleChoice = (type: 'truth' | 'dare') => {
    setChoice(type);

    // Filter prompts by intensity (<=), type, and not already used
    let filtered = truthOrDarePrompts.filter(
      (p, idx) => p.intensity <= intensity && p.type === type && !usedPromptIds.has(idx)
    );

    // If all prompts used, reset and use any available
    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = truthOrDarePrompts.filter(
        p => p.intensity <= intensity && p.type === type
      );
    }

    // Pick random prompt
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = truthOrDarePrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
  };

  const handleNext = () => {
    setChoice(null);
    setPrompt(null);
    // Rotate player + bump round, stay in this game
    nextTurn();
    // Show pass screen if there are players, otherwise go straight to next pick
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  // Inline pass-phone screen between rounds
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
      gameMode="truth-or-dare"
    >
      {!choice ? (
        <GameCard>
          <h2 className="text-4xl font-bold text-center mb-8">
            Choose Wisely...
          </h2>
          <div className="flex flex-col gap-4">
            <Button onClick={() => handleChoice('truth')} variant="primary" size="lg">
              Truth
            </Button>
            <Button onClick={() => handleChoice('dare')} variant="danger" size="lg">
              Dare
            </Button>
          </div>
        </GameCard>
      ) : (
        <GameCard>
          <div className="text-center mb-6">
            <div className="inline-block bg-slate-700 px-6 py-2 rounded-full text-lg font-bold mb-4">
              {choice === 'truth' ? '💬 Truth' : '🔥 Dare'}
            </div>
          </div>

          <p className="text-2xl md:text-3xl text-center mb-8 leading-relaxed">
            {prompt?.text}
          </p>

          <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
            Next
          </Button>
        </GameCard>
      )}
    </GameLayout>
  );
}
