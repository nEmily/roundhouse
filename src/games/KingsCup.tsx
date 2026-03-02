import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, Button, PassPhoneScreen } from '../components/GameCard';
import { generateDeck, getRuleForCard, type Suit } from '../data/kings-cup';

interface DeckCard {
  value: string;
  suit: Suit;
  id: string;
  drawn: boolean;
  drawOrder: number;
}

export function KingsCup() {
  const { nextRound, currentRound, nextPlayer, getCurrentPlayer, players } = useGame();
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [currentCard, setCurrentCard] = useState<DeckCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [kingsDrawn, setKingsDrawn] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showingPass, setShowingPass] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState<string | undefined>(undefined);
  const [drawCount, setDrawCount] = useState(0);
  const [animatingCardIndex, setAnimatingCardIndex] = useState<number | null>(null);

  const currentPlayer = getCurrentPlayer();

  useEffect(() => {
    if (cards.length === 0) {
      const deck = generateDeck();
      setCards(deck.map(c => ({ ...c, drawn: false, drawOrder: 0 })));
    }
  }, []);

  const nextUndrawnIndex = cards.findIndex(c => !c.drawn);

  const drawCard = useCallback((index: number) => {
    const card = cards[index];
    if (!card || card.drawn || currentCard) return;

    setAnimatingCardIndex(index);

    const newDrawCount = drawCount + 1;

    setTimeout(() => {
      setCards(prev => prev.map((c, i) =>
        i === index ? { ...c, drawn: true, drawOrder: newDrawCount } : c
      ));
      setCurrentCard(card);
      setDrawCount(newDrawCount);
      setAnimatingCardIndex(null);

      setTimeout(() => {
        setIsFlipped(true);
      }, 100);

      if (card.value === 'K') {
        const newKingsCount = kingsDrawn + 1;
        setKingsDrawn(newKingsCount);
        if (newKingsCount === 4) {
          setGameEnded(true);
        }
      }
    }, 300);
  }, [cards, currentCard, drawCount, kingsDrawn]);

  const handleNext = () => {
    setCurrentCard(null);
    setIsFlipped(false);

    if (gameEnded) {
      nextRound();
    } else {
      if (players.length > 0) {
        const currentIndex = players.findIndex(p => p.id === currentPlayer?.id);
        const nextIndex = (currentIndex + 1) % players.length;
        setNextPlayerName(players[nextIndex]?.name);
        setShowingPass(true);
      }
      nextPlayer();
    }
  };

  const rule = currentCard ? getRuleForCard(currentCard.value) : null;
  const isRed = (suit: Suit) => suit === '\u2665' || suit === '\u2666';
  const cardsRemaining = cards.filter(c => !c.drawn).length;

  if (showingPass) {
    return (
      <PassPhoneScreen
        playerName={nextPlayerName}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  return (
    <GameLayout
      round={currentRound}
      playerName={currentPlayer?.name}
      gameMode="kings-cup"
    >
      <div className="kc-container">
        {/* Card Ring + Center */}
        <div className={`kc-ring-area ${currentCard ? 'kc-ring-area--shrunk' : ''}`}>
          <div className="kc-ring">
            {cards.map((card, i) => {
              const angle = (360 / 52) * i;
              const isNext = i === nextUndrawnIndex && !currentCard;
              const isAnimating = i === animatingCardIndex;

              return (
                <div
                  key={card.id}
                  className={`kc-ring-card ${card.drawn ? 'kc-ring-card--drawn' : ''} ${isNext ? 'kc-ring-card--next' : ''} ${isAnimating ? 'kc-ring-card--animating' : ''}`}
                  style={{
                    transform: isAnimating
                      ? 'translate(-50%, -50%) scale(0.3)'
                      : `rotate(${angle}deg) translateY(calc(var(--kc-ring-radius) * -1)) rotate(${-angle}deg)`,
                  } as React.CSSProperties}
                  onClick={() => {
                    if (!card.drawn && !currentCard) {
                      drawCard(i);
                    }
                  }}
                >
                  {card.drawn ? (
                    <div
                      className="kc-mini-card kc-mini-card--face"
                      style={{ color: isRed(card.suit) ? '#ef4444' : '#1e293b' }}
                    >
                      <span className="kc-mini-value">{card.value}</span>
                      <span className="kc-mini-suit">{card.suit}</span>
                    </div>
                  ) : (
                    <div className="kc-mini-card kc-mini-card--back" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Center of the ring */}
          <div className="kc-center">
            {!currentCard ? (
              <div className="kc-center-idle">
                <div className="kc-crowns">
                  {[1, 2, 3, 4].map(n => (
                    <span
                      key={n}
                      className={`kc-crown ${n <= kingsDrawn ? 'kc-crown--lit' : ''}`}
                    >
                      {'\u265A'}
                    </span>
                  ))}
                </div>
                <div className="kc-cup">{'\uD83C\uDFC6'}</div>
                <div className="kc-center-label">Tap a card to draw</div>
                <div className="kc-cards-count">{cardsRemaining} cards left</div>
                {kingsDrawn === 3 && (
                  <div className="kc-warning animate-fade-in">
                    Next King drinks the Cup!
                  </div>
                )}
              </div>
            ) : (
              <div className="kc-center-reveal">
                <div className="kc-flip-area" style={{ perspective: '800px' }}>
                  <div
                    className="kc-flip-card"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div
                      className="kc-flip-face kc-flip-back"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    />
                    <div
                      className="kc-flip-face kc-flip-front"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        color: isRed(currentCard.suit) ? '#ef4444' : '#1e293b',
                      }}
                    >
                      <div className="kc-flip-corner-top">
                        <div className="kc-flip-val">{currentCard.value}</div>
                        <div className="kc-flip-suit-small">{currentCard.suit}</div>
                      </div>
                      <div className="kc-flip-center">
                        <div className="kc-flip-suit-big">{currentCard.suit}</div>
                        <div className="kc-flip-val-big">{currentCard.value}</div>
                      </div>
                      <div className="kc-flip-corner-bottom">
                        <div className="kc-flip-val">{currentCard.value}</div>
                        <div className="kc-flip-suit-small">{currentCard.suit}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rule area — flows below the ring */}
        {isFlipped && rule && (
          <div className="kc-rule-area animate-slide-up">
            <div className="kc-rule-box">
              <h3 className="kc-rule-name">{rule.name}</h3>
              <p className="kc-rule-text">{rule.rule}</p>
            </div>

            <div className="kc-rule-explain">
              <p>{rule.explanation}</p>
            </div>

            {currentCard?.value === 'K' && (
              <div className={`kc-king-alert ${kingsDrawn === 4 ? 'kc-king-alert--final animate-pulse' : ''}`}>
                {kingsDrawn === 4 ? (
                  <p className="kc-king-alert-text kc-king-alert-text--final">
                    4th KING! Drink the Kings Cup!
                  </p>
                ) : (
                  <p className="kc-king-alert-text">
                    {'\u265A'} King #{kingsDrawn} drawn
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
              {gameEnded ? 'Next Round \u2192' : 'Next Draw \u2192'}
            </Button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
