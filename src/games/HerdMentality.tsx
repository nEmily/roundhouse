import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { herdMentalityQuestions } from '../data/herd-mentality';

export function HerdMentality() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [question, setQuestion] = useState<typeof herdMentalityQuestions[0] | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    let filtered = herdMentalityQuestions.filter((q, idx) => q.intensity <= intensity && !usedQuestionIds.has(idx));

    if (filtered.length === 0) {
      setUsedQuestionIds(new Set());
      filtered = herdMentalityQuestions.filter(q => q.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = herdMentalityQuestions.findIndex(q => q === random);
    setQuestion(random);
    setUsedQuestionIds(prev => new Set(prev).add(randomIdx));
  }, [intensity, currentRound]);

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

        <p className="text-3xl md:text-4xl font-bold text-center mb-10 leading-tight">
          {question.text}
        </p>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 rounded-2xl p-6 text-center mb-10">
          <p className="text-xl font-bold mb-2">On 3, everyone shout your answer!</p>
          <p className="text-base text-slate-300">Match the majority or drink 🍺</p>
        </div>

        <Button onClick={() => nextRound()} variant="primary" size="lg" className="w-full">
          Next Round
        </Button>
      </GameCard>
    </GameLayout>
  );
}
