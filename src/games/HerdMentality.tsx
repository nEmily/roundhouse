import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { herdMentalityQuestions } from '../data/herd-mentality';

export function HerdMentality() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [question, setQuestion] = useState<typeof herdMentalityQuestions[0] | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

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

  const handleNext = () => {
    nextTurn();
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  if (!question) return null;

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
      gameMode="herd-mentality"
    >
      <GameCard>
        {/* Badge */}
        <div className="text-center mb-5">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(245,166,35,0.18), rgba(217,119,6,0.12))',
              color: '#f5a623',
              border: '1.5px solid rgba(245,166,35,0.3)',
            }}
          >
            🐑 Herd Mentality
          </div>
        </div>

        <p
          className="text-2xl font-black text-center mb-8 leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {question.text}
        </p>

        {/* Instructions */}
        <div
          className="rounded-2xl p-5 text-center mb-8"
          style={{
            background: 'rgba(245,166,35,0.08)',
            border: '1px solid rgba(245,166,35,0.18)',
          }}
        >
          <p
            className="text-lg font-black mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            On 3, everyone shout your answer!
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            Match the majority or drink 🍺
          </p>
        </div>

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next →
        </Button>
      </GameCard>
    </GameLayout>
  );
}
