import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { triviaQuestions } from '../data/trivia';
import { hapticSuccess, hapticBuzz } from '../utils/haptics';

export function Trivia() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, updatePlayerScore, players } = useGame();
  const [question, setQuestion] = useState<typeof triviaQuestions[0] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

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
  }, [intensity, currentRound]);

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
    nextTurn();
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  if (!question) return null;

  const isCorrect = selectedAnswer === question.answer;

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
              buttonClasses = isSelected ? 'bg-amber-600' : 'bg-slate-700 hover:bg-slate-600';
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
              Next
            </Button>
          </>
        )}
      </GameCard>
    </GameLayout>
  );
}
