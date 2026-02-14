import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { herdMentalityQuestions } from '../data/herd-mentality';

export function HerdMentality() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [question, setQuestion] = useState<typeof herdMentalityQuestions[0] | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter questions by intensity (<=) and not already used
    let filtered = herdMentalityQuestions.filter((q, idx) => q.intensity <= intensity && !usedQuestionIds.has(idx));

    // If all questions used, reset and use any available
    if (filtered.length === 0) {
      setUsedQuestionIds(new Set());
      filtered = herdMentalityQuestions.filter(q => q.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = herdMentalityQuestions.findIndex(q => q === random);
    setQuestion(random);
    setUsedQuestionIds(prev => new Set(prev).add(randomIdx));
    setShowInstructions(true);
  }, [intensity, currentRound]);

  const handleStart = () => {
    setShowInstructions(false);
  };

  const handleNext = () => {
    nextRound();
  };

  if (!question) return null;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="herd-mentality"
    >
      <GameCard>
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-2 rounded-full text-lg font-bold mb-4">
            🐑 Herd Mentality
          </div>
        </div>

        {showInstructions ? (
          <>
            <div className="bg-slate-700 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">How to Play:</h3>
              <ol className="text-left text-lg space-y-3 text-slate-200">
                <li>1. {player?.name || 'Someone'} reads the question aloud</li>
                <li>2. Everyone shouts their answer at the same time</li>
                <li>3. The majority wins</li>
                <li>4. Minorities drink!</li>
              </ol>
            </div>

            <Button onClick={handleStart} variant="primary" size="lg" className="w-full">
              Show Question
            </Button>
          </>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-4xl md:text-5xl font-bold text-center mb-8 leading-tight text-yellow-400">
                {question.text}
              </p>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-6 text-center">
                <p className="text-2xl font-bold mb-2">Everyone shout your answer!</p>
                <p className="text-lg text-slate-300">Majority rules — minorities drink! 🍺</p>
              </div>
            </div>

            <Button onClick={handleNext} variant="success" size="lg" className="w-full">
              Next Round
            </Button>
          </>
        )}
      </GameCard>
    </GameLayout>
  );
}
