import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { triviaQuestions } from '../data/trivia';
import { hapticSuccess, hapticBuzz } from '../utils/haptics';

export function Trivia() {
  const { intensity, getCurrentPlayer, nextRound, currentRound, updatePlayerScore } = useGame();
  const [question, setQuestion] = useState<typeof triviaQuestions[0] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter questions by intensity (<=) and not already used
    let filtered = triviaQuestions.filter((q, idx) => q.intensity <= intensity && !usedQuestionIds.has(idx));

    // If all questions used, reset and use any available
    if (filtered.length === 0) {
      setUsedQuestionIds(new Set());
      filtered = triviaQuestions.filter(q => q.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = triviaQuestions.findIndex(q => q === random);
    setQuestion(random);
    setUsedQuestionIds(prev => new Set(prev).add(randomIdx));
  }, [intensity]);

  const handleAnswer = (answer: string) => {
    if (revealed) return;
    setSelectedAnswer(answer);
    setRevealed(true);

    if (answer === question?.answer) {
      if (player) updatePlayerScore(player.id, 1);
      hapticSuccess();
    } else {
      hapticBuzz();
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setRevealed(false);
    nextRound();
  };

  if (!question) return null;

  const isCorrect = selectedAnswer === question.answer;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="trivia"
    >
      <GameCard>
        <div className="text-center mb-6">
          <div className="inline-block bg-slate-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
            {question.category.replaceAll('-', ' ')}
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 leading-relaxed">
          {question.question}
        </h3>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.answer;

            let buttonClasses = '';
            if (revealed) {
              if (isCorrectAnswer) {
                buttonClasses = 'bg-green-600 hover:bg-green-600';
              } else if (isSelected && !isCorrectAnswer) {
                buttonClasses = 'bg-red-600 hover:bg-red-600';
              } else {
                buttonClasses = 'bg-slate-700 opacity-50';
              }
            } else {
              buttonClasses = isSelected ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600';
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={revealed}
                className={`${buttonClasses} text-white text-lg px-6 py-4 rounded-xl font-medium transition-all disabled:cursor-default`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {revealed && (
          <>
            <div className={`text-center text-2xl font-bold mb-6 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Correct! +1 point' : '✗ Wrong!'}
            </div>
            <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
              Next Round
            </Button>
          </>
        )}
      </GameCard>
    </GameLayout>
  );
}
