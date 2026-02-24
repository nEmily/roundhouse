import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
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
    let filtered = triviaQuestions.filter((q, idx) => q.intensity <= intensity && !usedQuestionIds.has(idx));

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
      <PassPhoneScreen
        playerName={player?.name}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="trivia"
    >
      <GameCard>
        {/* Category pill */}
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
            style={{
              backgroundColor: 'rgba(56,189,248,0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.25)',
            }}
          >
            {question.category.replaceAll('-', ' ')}
          </div>
        </div>

        <h3
          className="text-xl font-black text-center mb-7 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {question.question}
        </h3>

        {/* Answer options */}
        <div className="grid grid-cols-1 gap-2.5 mb-5">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.answer;

            let extraStyle: React.CSSProperties = {};
            if (revealed) {
              if (isCorrectAnswer) {
                extraStyle = {
                  background: 'linear-gradient(160deg, #3ecf7a, #1fad5c)',
                  color: '#051a0e',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(62,207,122,0.3)',
                };
              } else if (isSelected && !isCorrectAnswer) {
                extraStyle = {
                  background: 'linear-gradient(160deg, #f06040, #c73e22)',
                  color: '#200800',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(240,96,64,0.3)',
                };
              } else {
                extraStyle = {
                  opacity: 0.3,
                  backgroundColor: 'var(--bg-elevated)',
                };
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={revealed}
                className="w-full text-left rounded-xl px-5 py-4 font-bold text-base transition-all disabled:cursor-default"
                style={{
                  backgroundColor: revealed ? undefined : 'var(--bg-elevated)',
                  color: revealed ? undefined : 'var(--text-primary)',
                  border: revealed ? undefined : '1px solid var(--border-subtle)',
                  ...extraStyle,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Result feedback */}
        {revealed && (
          <div className="animate-fade-in">
            <div
              className="text-center text-xl font-black mb-5 py-3 rounded-xl"
              style={{
                color: isCorrect ? '#3ecf7a' : '#f06040',
                backgroundColor: isCorrect ? 'rgba(62,207,122,0.08)' : 'rgba(240,96,64,0.08)',
                border: `1px solid ${isCorrect ? 'rgba(62,207,122,0.2)' : 'rgba(240,96,64,0.2)'}`,
              }}
            >
              {isCorrect ? '✓ Correct! +1 point' : '✗ Wrong! Drink up 🍺'}
            </div>
            <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
              Next →
            </Button>
          </div>
        )}
      </GameCard>
    </GameLayout>
  );
}
