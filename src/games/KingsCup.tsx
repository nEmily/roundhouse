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

  // Initialize deck on mount
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

    // Animate flip
    setTimeout(() => {
      setIsFlipped(true);
    }, 100);

    // Check if it's a King
    if (drawnCard.value === 'K') {
      const newKingsCount = kingsDrawn + 1;
      setKingsDrawn(newKingsCount);

      // 4th King ends the game
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

  // Get color based on suit
  const getSuitColor = (suit: Suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-gray-900';
  };

  // currentPlayer may be null when playing without names

  return (
    <GameLayout
      round={currentRound}
      playerName={currentPlayer?.name}
      gameMode="kings-cup"
    >
      <GameCard>
        {!currentCard ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Kings Cup</h2>
              <p className="text-lg text-slate-400 mb-2">
                Cards remaining: {deck.length}
              </p>
              <p className="text-lg text-slate-400">
                Kings drawn: {kingsDrawn}/4
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <button
                onClick={drawCard}
                className="relative w-48 h-64 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-2xl border-4 border-blue-400 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white">
                    <div className="text-6xl mb-2">🃏</div>
                    <div className="text-lg font-bold">Tap to Draw</div>
                  </div>
                </div>
                {/* Card back pattern */}
                <div className="absolute inset-4 border-2 border-blue-300 rounded-lg opacity-50"></div>
                <div className="absolute inset-8 border-2 border-blue-300 rounded-lg opacity-30"></div>
              </button>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg text-center text-sm text-slate-400">
              <p className="mb-2">
                Draw a card to reveal your rule!
              </p>
              {kingsDrawn === 3 && (
                <p className="text-yellow-400 font-semibold">
                  ⚠️ Warning: Next King drinks the Kings Cup!
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div
                className={`relative w-48 h-64 transition-all duration-500 ${
                  isFlipped ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Card front */}
                <div
                  className="absolute inset-0 bg-white rounded-xl shadow-2xl border-4 border-gray-300 flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Top corner */}
                  <div className={`absolute top-4 left-4 text-center ${getSuitColor(currentCard.suit)}`}>
                    <div className="text-2xl font-bold leading-none">{currentCard.value}</div>
                    <div className="text-3xl leading-none">{currentCard.suit}</div>
                  </div>

                  {/* Center */}
                  <div className={`text-center ${getSuitColor(currentCard.suit)}`}>
                    <div className="text-7xl mb-2">{currentCard.suit}</div>
                    <div className="text-4xl font-bold">{currentCard.value}</div>
                  </div>

                  {/* Bottom corner (rotated) */}
                  <div
                    className={`absolute bottom-4 right-4 text-center ${getSuitColor(currentCard.suit)}`}
                    style={{ transform: 'rotate(180deg)' }}
                  >
                    <div className="text-2xl font-bold leading-none">{currentCard.value}</div>
                    <div className="text-3xl leading-none">{currentCard.suit}</div>
                  </div>
                </div>
              </div>
            </div>

            {isFlipped && rule && (
              <div className="animate-fade-in">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl mb-6">
                  <h3 className="text-3xl font-bold text-center mb-2">
                    {rule.name}
                  </h3>
                  <p className="text-xl text-center font-semibold">
                    {rule.rule}
                  </p>
                </div>

                <div className="bg-slate-700 p-5 rounded-lg mb-6">
                  <p className="text-lg leading-relaxed">
                    {rule.explanation}
                  </p>
                </div>

                {currentCard.value === 'K' && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    kingsDrawn === 4
                      ? 'bg-red-600 animate-pulse'
                      : 'bg-yellow-600'
                  }`}>
                    {kingsDrawn === 4 ? (
                      <p className="text-xl font-bold text-center">
                        🍺 4th KING! Drink the Kings Cup! 🍺
                      </p>
                    ) : (
                      <p className="text-lg text-center">
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
                  {gameEnded ? 'Next Round' : 'Next Draw'}
                </Button>
              </div>
            )}
          </>
        )}
      </GameCard>
    </GameLayout>
  );
}
