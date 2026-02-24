import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { hapticSuccess, hapticBuzz } from '../utils/haptics';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

interface Card {
  suit: Suit;
  value: CardValue;
}

function createDeck(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values: CardValue[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  return deck.sort(() => Math.random() - 0.5);
}

function getCardDisplay(card: Card): string {
  const values: Record<CardValue, string> = {
    2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
    11: 'J', 12: 'Q', 13: 'K', 14: 'A'
  };
  return values[card.value];
}

function getSuitSymbol(suit: Suit): string {
  const symbols: Record<Suit, string> = {
    hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠',
  };
  return symbols[suit];
}

function isRed(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

type RoundPhase = 'red-or-black' | 'higher-or-lower' | 'inside-or-outside' | 'guess-suit' | 'reveal';

interface RoundState {
  cards: Card[];
  phase: RoundPhase;
  revealed: boolean;
  guess?: string | boolean;
  correct?: boolean;
}

export function RideTheBus() {
  const { intensity, players, getCurrentPlayer, nextTurn, currentRound, updatePlayerScore } = useGame();
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [round, setRound] = useState<RoundState>({
    cards: [],
    phase: 'red-or-black',
    revealed: false,
  });
  const [rideCount, setRideCount] = useState<Map<string, number>>(new Map());
  const [gameStarted, setGameStarted] = useState(false);
  const [showingPass, setShowingPass] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState<string | undefined>(undefined);

  const player = getCurrentPlayer();

  useEffect(() => {
    setRound({ cards: [], phase: 'red-or-black', revealed: false });
    setGameStarted(true);
  }, [intensity]);

  const handleRedOrBlackGuess = (guessColor: 'red' | 'black') => {
    if (!deck.length || round.revealed) return;
    const nextCard = deck[0];
    const cardColor = isRed(nextCard.suit) ? 'red' : 'black';
    const correct = guessColor === cardColor;
    setRound({ cards: [nextCard], phase: correct ? 'higher-or-lower' : 'reveal', revealed: true, guess: guessColor, correct });
    if (!correct && player) { updatePlayerScore(player.id, -1); hapticBuzz(); } else { hapticSuccess(); }
    setDeck(deck.slice(1));
  };

  const handleHigherOrLowerGuess = (guess: 'higher' | 'lower') => {
    if (!deck.length || round.revealed || round.cards.length !== 1) return;
    const firstCard = round.cards[0];
    const nextCard = deck[0];
    const correct = (guess === 'higher' && nextCard.value > firstCard.value) || (guess === 'lower' && nextCard.value < firstCard.value);
    setRound({ cards: [...round.cards, nextCard], phase: correct ? 'inside-or-outside' : 'reveal', revealed: true, guess, correct });
    if (!correct && player) { updatePlayerScore(player.id, -1); hapticBuzz(); } else { hapticSuccess(); }
    setDeck(deck.slice(1));
  };

  const handleInsideOrOutsideGuess = (guess: 'inside' | 'outside') => {
    if (!deck.length || round.revealed || round.cards.length !== 2) return;
    const [card1, card2] = round.cards;
    const min = Math.min(card1.value, card2.value);
    const max = Math.max(card1.value, card2.value);
    const nextCard = deck[0];
    const correct = (guess === 'inside' && nextCard.value > min && nextCard.value < max) || (guess === 'outside' && (nextCard.value <= min || nextCard.value >= max));
    setRound({ cards: [...round.cards, nextCard], phase: correct ? 'guess-suit' : 'reveal', revealed: true, guess, correct });
    if (!correct && player) { updatePlayerScore(player.id, -1); hapticBuzz(); } else { hapticSuccess(); }
    setDeck(deck.slice(1));
  };

  const handleSuitGuess = (guessedSuit: Suit) => {
    if (!deck.length || round.revealed || round.cards.length !== 3) return;
    const nextCard = deck[0];
    const correct = guessedSuit === nextCard.suit;
    setRound({ cards: [...round.cards, nextCard], phase: 'reveal', revealed: true, guess: guessedSuit, correct });
    if (correct && player) {
      updatePlayerScore(player.id, 3);
      setRideCount(new Map(rideCount.set(player.id, (rideCount.get(player.id) || 0) + 1)));
      hapticSuccess();
    } else if (player) { updatePlayerScore(player.id, -1); hapticBuzz(); }
    setDeck(deck.slice(1));
  };

  const handleNext = () => {
    if (round.correct) {
      setRound({ cards: [], phase: 'red-or-black', revealed: false });
      if (players.length > 0) {
        const currentIndex = players.findIndex(p => p.id === player?.id);
        const nextIndex = (currentIndex + 1) % players.length;
        setNextPlayerName(players[nextIndex]?.name);
        setShowingPass(true);
      }
      nextTurn();
    } else {
      setRound({ cards: [], phase: 'red-or-black', revealed: false });
    }
  };

  if (!gameStarted) return null;

  if (showingPass) {
    return (
      <PassPhoneScreen
        playerName={nextPlayerName}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  const isRedBlackPhase   = round.phase === 'red-or-black'     && !round.revealed;
  const isHigherLowerPhase = round.phase === 'higher-or-lower'  && !round.revealed;
  const isInsideOutPhase   = round.phase === 'inside-or-outside' && !round.revealed;
  const isGuessPhase       = round.phase === 'guess-suit'       && !round.revealed;
  const isRevealPhase      = round.phase === 'reveal'           || round.revealed;

  const currentPhaseNum = ['red-or-black', 'higher-or-lower', 'inside-or-outside', 'guess-suit'].indexOf(round.phase) + 1;

  return (
    <GameLayout
      round={currentRound}
      gameMode="ride-the-bus"
      playerName={player?.name}
    >
      <GameCard>
        {/* Phase stepper */}
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className="phase-dot"
              style={
                num < currentPhaseNum
                  ? { backgroundColor: 'rgba(62,207,122,0.18)', color: '#3ecf7a', border: '1.5px solid rgba(62,207,122,0.35)' }
                  : num === currentPhaseNum
                  ? { backgroundColor: 'rgba(245,166,35,0.18)', color: '#f5a623', border: '1.5px solid rgba(245,166,35,0.4)' }
                  : { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1.5px solid var(--border-subtle)' }
              }
            >
              {num < currentPhaseNum ? '✓' : num}
            </div>
          ))}
        </div>

        {/* Card display */}
        <div className="flex gap-2.5 justify-center mb-6 min-h-28">
          {round.cards.map((card, idx) => (
            <div
              key={idx}
              className="w-[4.5rem] h-24 rounded-xl flex flex-col items-center justify-center"
              style={{
                background: '#fff8f0',
                color: isRed(card.suit) ? '#ef4444' : '#1e293b',
                boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
                border: '1.5px solid rgba(200,150,100,0.25)',
              }}
            >
              <div className="text-2xl font-black leading-none">{getCardDisplay(card)}</div>
              <div className="text-2xl leading-none">{getSuitSymbol(card.suit)}</div>
            </div>
          ))}
        </div>

        {/* Prompt */}
        <h2
          className="text-xl font-black text-center mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {isRedBlackPhase && 'Red or Black?'}
          {isHigherLowerPhase && 'Higher or Lower?'}
          {isInsideOutPhase && 'Inside or Outside?'}
          {isGuessPhase && 'Guess the Suit'}
          {isRevealPhase && (
            <span style={{ color: round.correct ? '#3ecf7a' : '#f06040' }}>
              {round.correct ? '✓ Correct!' : '✗ Wrong!'}
            </span>
          )}
        </h2>

        {/* Guess buttons */}
        {isRedBlackPhase && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => handleRedOrBlackGuess('red')}
              className="btn w-full btn-md"
              style={{ background: 'linear-gradient(160deg, #ef4444, #b91c1c)', color: '#fff', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
            >
              Red ♥
            </button>
            <button
              onClick={() => handleRedOrBlackGuess('black')}
              className="btn w-full btn-md"
              style={{ background: 'linear-gradient(160deg, #475569, #1e293b)', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              Black ♠
            </button>
          </div>
        )}

        {isHigherLowerPhase && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button onClick={() => handleHigherOrLowerGuess('higher')} variant="primary" size="md" className="w-full">
              Higher ↑
            </Button>
            <Button onClick={() => handleHigherOrLowerGuess('lower')} variant="secondary" size="md" className="w-full">
              Lower ↓
            </Button>
          </div>
        )}

        {isInsideOutPhase && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Button onClick={() => handleInsideOrOutsideGuess('inside')} variant="primary" size="md" className="w-full">
              Inside
            </Button>
            <Button onClick={() => handleInsideOrOutsideGuess('outside')} variant="secondary" size="md" className="w-full">
              Outside
            </Button>
          </div>
        )}

        {isGuessPhase && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => handleSuitGuess('hearts')}
              className="btn w-full btn-md"
              style={{ background: 'linear-gradient(160deg, #ef4444, #b91c1c)', color: '#fff', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
            >
              ♥ Hearts
            </button>
            <button
              onClick={() => handleSuitGuess('diamonds')}
              className="btn w-full btn-md"
              style={{ background: 'linear-gradient(160deg, #f97316, #c2410c)', color: '#fff', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}
            >
              ♦ Diamonds
            </button>
            <button
              onClick={() => handleSuitGuess('clubs')}
              className="btn w-full btn-md"
              style={{ background: 'linear-gradient(160deg, #475569, #1e293b)', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              ♣ Clubs
            </button>
            <button
              onClick={() => handleSuitGuess('spades')}
              className="btn w-full btn-md"
              style={{ background: 'linear-gradient(160deg, #334155, #0f172a)', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              ♠ Spades
            </button>
          </div>
        )}

        {isRevealPhase && (
          <Button
            onClick={handleNext}
            variant={round.correct ? 'success' : 'danger'}
            size="lg"
            className="w-full"
          >
            {round.correct
              ? `Off the Bus! (${player ? rideCount.get(player.id) || 0 : 0} rides)`
              : 'Start Over'}
          </Button>
        )}

        {/* Ride count tracker */}
        {players.length > 0 && (
          <div
            className="mt-6 pt-5"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <h3
              className="text-xs font-black uppercase tracking-widest text-center mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              Bus Rides Completed
            </h3>
            <div className="space-y-1.5">
              {players.map(p => (
                <div key={p.id} className="flex justify-between items-center">
                  <span
                    className="text-sm font-bold"
                    style={{ color: p.id === player?.id ? 'var(--text-primary)' : 'var(--text-muted)' }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="text-sm font-black"
                    style={{ color: 'var(--amber-bright)' }}
                  >
                    {rideCount.get(p.id) || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </GameCard>
    </GameLayout>
  );
}
