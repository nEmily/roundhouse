import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { capOrFaxPrompts } from '../data/cap-or-fax';
import { hapticSuccess } from '../utils/haptics';

export function CapOrFax() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [phase, setPhase] = useState<'instruction' | 'reveal'>('instruction');
  const [instruction, setInstruction] = useState<'cap' | 'fax' | null>(null);
  const [prompt, setPrompt] = useState<typeof capOrFaxPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

  const currentPlayer = getCurrentPlayer();

  const startRound = () => {
    const isCapOrFax = Math.random() < 0.5 ? 'cap' : 'fax';
    setInstruction(isCapOrFax);

    let filtered = capOrFaxPrompts.filter((p, idx) => p.intensity <= intensity && !usedPromptIds.has(idx));

    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = capOrFaxPrompts.filter(p => p.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = capOrFaxPrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));

    setPhase('instruction');
  };

  const handleReveal = () => {
    hapticSuccess();
    setPhase('reveal');
  };

  const handleNext = () => {
    setPhase('instruction');
    setInstruction(null);
    setPrompt(null);
    nextRound();
  };

  // Initial start
  if (!instruction && phase === 'instruction') {
    startRound();
  }

  if (!prompt || !instruction) return null;

  return (
    <GameLayout
      round={currentRound}
      playerName={currentPlayer?.name}
      gameMode="cap-or-fax"
    >
      {phase === 'instruction' && (
        <GameCard>
          <div className="text-center mb-8">
            <div className={`inline-block px-8 py-4 rounded-2xl text-3xl font-bold mb-6 ${
              instruction === 'cap' ? 'bg-orange-600' : 'bg-blue-600'
            }`}>
              {instruction === 'cap' ? '🧢 CAP' : '📠 FAX'}
            </div>
            <p className="text-xl mb-2">
              {instruction === 'cap' ? 'Make it up!' : 'Tell the truth!'}
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl mb-10">
            <p className="text-2xl md:text-3xl text-center leading-relaxed">
              {prompt.text}
            </p>
            {prompt.type === 'list' && instruction === 'cap' && (
              <p className="text-sm text-slate-400 text-center mt-4">
                (Slip in 1 fake answer)
              </p>
            )}
          </div>

          <p className="text-center text-slate-400 mb-6">
            Tell your story, then let everyone guess!
          </p>

          <Button onClick={handleReveal} variant="primary" size="lg" className="w-full">
            Reveal Answer
          </Button>
        </GameCard>
      )}

      {phase === 'reveal' && (
        <GameCard>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-6">
              It was...
            </h2>
            <div className={`inline-block px-10 py-5 rounded-2xl text-5xl font-bold ${
              instruction === 'cap' ? 'bg-orange-600' : 'bg-blue-600'
            }`}>
              {instruction === 'cap' ? '🧢 CAP!' : '📠 FAX!'}
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-2xl p-5 text-center mb-10">
            <p className="text-lg text-slate-300">
              {instruction === 'cap'
                ? 'Anyone who believed it — drink up! 🍺'
                : 'Anyone who called cap — drink up! 🍺'}
            </p>
          </div>

          <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
            Next Round
          </Button>
        </GameCard>
      )}
    </GameLayout>
  );
}
