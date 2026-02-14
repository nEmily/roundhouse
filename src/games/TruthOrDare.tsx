import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { truthOrDarePrompts } from '../data/truth-or-dare';

export function TruthOrDare() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [choice, setChoice] = useState<'truth' | 'dare' | null>(null);
  const [prompt, setPrompt] = useState<typeof truthOrDarePrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

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
    nextRound();
  };

  if (!player) return null;

  return (
    <GameLayout
      round={currentRound}
      playerName={player.name}
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
            Next Round
          </Button>
        </GameCard>
      )}
    </GameLayout>
  );
}
