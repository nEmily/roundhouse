import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { generateDeck, getRuleForCard, type Suit } from '../data/kings-cup';

interface DrawnCard {
  value: string;
  suit: Suit;
  id: string;
}

export function KingsCup() {
  const { nextRound, currentRound, nextPlayer, getCurrentPlayer } = useGame();
  const [deck, setDeck] = useState<Array<{ value: string; suit: Suit; id: string }>>([]);
  const [currentCard, setCurrentCard] = useState<DrawnCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [kingsDrawn, setKingsDrawn] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  const currentPlayer = getCurrentPlayer();

  useEffect(() => {
    if (deck.length === 0) {
      setDeck(generateDeck());
    }
  }, []);

  const drawCard = () => {
    if (deck.length === 0) return;

    const [drawnCard, ...remainingDeck] = deck;
    setCurrentCard(drawnCard);
    setDeck(remainingDeck);

    setTimeout(() => {
      setIsFlipped(true);
    }, 100);

    if (drawnCard.value === 'K') {
      const newKingsCount = kingsDrawn + 1;
      setKingsDrawn(newKingsCount);
      if (newKingsCount === 4) {
        setGameEnded(true);
      }
    }
  };

  const handleNext = () => {
    setCurrentCard(null);
    setIsFlipped(false);

    if (gameEnded) {
      nextRound();
    } else {
      nextPlayer();
    }
  };

  const rule = currentCard ? getRuleForCard(currentCard.value) : null;

  const isRed = (suit: Suit) => suit === '♥' || suit === '♦';
  const suitColor = currentCard ? (isRed(currentCard.suit) ? '#ef4444' : '#1e293b') : '#1e293b';

  return (
    <GameLayout
      round={currentRound}
      playerName={currentPlayer?.name}
      gameMode="kings-cup"
    >
      <GameCard>
        {!currentCard ? (
          <>
            {/* Draw phase */}
            <div className="text-center mb-6">
              <h2
                className="text-2xl font-black mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Kings Cup
              </h2>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div
                    className="text-2xl font-black"
                    style={{ color: 'var(--amber-bright)' }}
                  >
                    {deck.length}
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    cards left
                  </div>
                </div>
                <div
                  className="w-px"
                  style={{ backgroundColor: 'var(--border-subtle)' }}
                />
                <div className="text-center">
                  <div
                    className="text-2xl font-black"
                    style={{ color: kingsDrawn >= 3 ? '#f06040' : 'var(--text-primary)' }}
                  >
                    {kingsDrawn}/4
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    kings drawn
                  </div>
                </div>
              </div>
            </div>

            {/* Draw card */}
            <div className="flex justify-center mb-7">
              <button
                onClick={drawCard}
                className="relative w-44 h-60 rounded-2xl cursor-pointer transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(145deg, #7c3aed 0%, #4c1d95 100%)',
                  boxShadow: '0 8px 28px rgba(124,58,237,0.45), 0 2px 6px rgba(0,0,0,0.4)',
                  border: '2px solid rgba(167,139,250,0.3)',
                }}
              >
                {/* Inner border decorations */}
                <div
                  className="absolute inset-3 rounded-xl"
                  style={{ border: '1.5px solid rgba(167,139,250,0.3)' }}
                />
                <div
                  className="absolute inset-6 rounded-lg"
                  style={{ border: '1px solid rgba(167,139,250,0.18)' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl mb-2">🃏</div>
                  <div
                    className="text-base font-black"
                    style={{ color: 'rgba(221,214,254,0.9)' }}
                  >
                    Tap to Draw
                  </div>
                </div>
              </button>
            </div>

            {/* Warning */}
            {kingsDrawn === 3 && (
              <div
                className="rounded-xl p-4 text-center animate-fade-in"
                style={{
                  background: 'rgba(240,96,64,0.12)',
                  border: '1px solid rgba(240,96,64,0.3)',
                }}
              >
                <p
                  className="font-black text-sm"
                  style={{ color: '#f06040' }}
                >
                  Next King drinks the Kings Cup!
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Card flip animation */}
            <div className="flex justify-center mb-5" style={{ perspective: '1000px' }}>
              <div
                className="relative w-44 h-60"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Card back */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: 'linear-gradient(145deg, #7c3aed 0%, #4c1d95 100%)',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
                    border: '2px solid rgba(167,139,250,0.3)',
                  }}
                />
                {/* Card face */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: '#fff8f0',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
                    border: '2px solid rgba(200,150,100,0.3)',
                    color: suitColor,
                    padding: '0.875rem',
                  }}
                >
                  {/* Top corner */}
                  <div className="text-left">
                    <div className="text-xl font-black leading-none">{currentCard?.value}</div>
                    <div className="text-2xl leading-none">{currentCard?.suit}</div>
                  </div>
                  {/* Center */}
                  <div className="flex-1 flex items-center justify-center flex-col">
                    <div className="text-6xl mb-1">{currentCard?.suit}</div>
                    <div className="text-3xl font-black">{currentCard?.value}</div>
                  </div>
                  {/* Bottom corner rotated */}
                  <div className="text-right" style={{ transform: 'rotate(180deg)' }}>
                    <div className="text-xl font-black leading-none">{currentCard?.value}</div>
                    <div className="text-2xl leading-none">{currentCard?.suit}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule reveal */}
            {isFlipped && rule && (
              <div className="animate-slide-up">
                {/* Rule name & description */}
                <div
                  className="rounded-2xl p-5 mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,166,35,0.18), rgba(224,122,16,0.12))',
                    border: '1.5px solid rgba(245,166,35,0.3)',
                  }}
                >
                  <h3
                    className="text-2xl font-black text-center mb-2"
                    style={{ color: '#f5a623' }}
                  >
                    {rule.name}
                  </h3>
                  <p
                    className="text-base font-bold text-center"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {rule.rule}
                  </p>
                </div>

                {/* Explanation */}
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <p
                    className="text-sm font-semibold leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {rule.explanation}
                  </p>
                </div>

                {/* King alert */}
                {currentCard?.value === 'K' && (
                  <div
                    className={`rounded-xl p-4 mb-4 text-center ${kingsDrawn === 4 ? 'animate-pulse' : ''}`}
                    style={{
                      backgroundColor: kingsDrawn === 4 ? 'rgba(240,96,64,0.2)' : 'rgba(251,191,36,0.15)',
                      border: `1px solid ${kingsDrawn === 4 ? 'rgba(240,96,64,0.4)' : 'rgba(251,191,36,0.3)'}`,
                    }}
                  >
                    {kingsDrawn === 4 ? (
                      <p
                        className="text-xl font-black"
                        style={{ color: '#f06040' }}
                      >
                        🍺 4th KING! Drink the Kings Cup! 🍺
                      </p>
                    ) : (
                      <p
                        className="text-base font-black"
                        style={{ color: '#fbbf24' }}
                      >
                        👑 King #{kingsDrawn} drawn
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleNext}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {gameEnded ? 'Next Round →' : 'Next Draw →'}
                </Button>
              </div>
            )}
          </>
        )}
      </GameCard>
    </GameLayout>
  );
}
