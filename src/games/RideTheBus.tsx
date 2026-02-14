import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { hapticSuccess, hapticBuzz } from '../utils/haptics';

// Card types and utilities
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // 11=J, 12=Q, 13=K, 14=A

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

function getSuitEmoji(suit: Suit): string {
  const emojis: Record<Suit, string> = {
    hearts: '♥️',
    diamonds: '♦️',
    clubs: '♣️',
    spades: '♠️',
  };
  return emojis[suit];
}

function getSuitColor(suit: Suit): string {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-slate-200';
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
  const { intensity, players, getCurrentPlayer, nextRound, currentRound, updatePlayerScore } = useGame();
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [round, setRound] = useState<RoundState>({
    cards: [],
    phase: 'red-or-black',
    revealed: false,
  });
  const [rideCount, setRideCount] = useState<Map<string, number>>(new Map());
  const [gameStarted, setGameStarted] = useState(false);

  const player = getCurrentPlayer();

  useEffect(() => {
    // Start fresh ride
    setRound({
      cards: [],
      phase: 'red-or-black',
      revealed: false,
    });
    setGameStarted(true);
  }, [intensity]);

  const handleRedOrBlackGuess = (guessColor: 'red' | 'black') => {
    if (!deck.length || round.revealed) return;

    const nextCard = deck[0];
    const cardColor = isRed(nextCard.suit) ? 'red' : 'black';
    const correct = guessColor === cardColor;

    setRound({
      cards: [nextCard],
      phase: correct ? 'higher-or-lower' : 'reveal',
      revealed: true,
      guess: guessColor,
      correct,
    });

    if (!correct && player) {
      updatePlayerScore(player.id, -1); // Drink penalty
      hapticBuzz();
    } else {
      hapticSuccess();
    }

    setDeck(deck.slice(1));
  };

  const handleHigherOrLowerGuess = (guess: 'higher' | 'lower') => {
    if (!deck.length || round.revealed || round.cards.length !== 1) return;

    const firstCard = round.cards[0];
    const nextCard = deck[0];
    const correct =
      (guess === 'higher' && nextCard.value > firstCard.value) ||
      (guess === 'lower' && nextCard.value < firstCard.value);

    setRound({
      cards: [...round.cards, nextCard],
      phase: correct ? 'inside-or-outside' : 'reveal',
      revealed: true,
      guess,
      correct,
    });

    if (!correct && player) {
      updatePlayerScore(player.id, -1);
      hapticBuzz();
    } else {
      hapticSuccess();
    }

    setDeck(deck.slice(1));
  };

  const handleInsideOrOutsideGuess = (guess: 'inside' | 'outside') => {
    if (!deck.length || round.revealed || round.cards.length !== 2) return;

    const [card1, card2] = round.cards;
    const min = Math.min(card1.value, card2.value);
    const max = Math.max(card1.value, card2.value);
    const nextCard = deck[0];

    const correct =
      (guess === 'inside' && nextCard.value > min && nextCard.value < max) ||
      (guess === 'outside' && (nextCard.value <= min || nextCard.value >= max));

    setRound({
      cards: [...round.cards, nextCard],
      phase: correct ? 'guess-suit' : 'reveal',
      revealed: true,
      guess,
      correct,
    });

    if (!correct && player) {
      updatePlayerScore(player.id, -1);
      hapticBuzz();
    } else {
      hapticSuccess();
    }

    setDeck(deck.slice(1));
  };

  const handleSuitGuess = (guessedSuit: Suit) => {
    if (!deck.length || round.revealed || round.cards.length !== 3) return;

    const nextCard = deck[0];
    const correct = guessedSuit === nextCard.suit;

    setRound({
      cards: [...round.cards, nextCard],
      phase: 'reveal',
      revealed: true,
      guess: guessedSuit,
      correct,
    });

    if (correct && player) {
      updatePlayerScore(player.id, 3); // Bonus for completing the bus
      setRideCount(new Map(rideCount.set(player.id, (rideCount.get(player.id) || 0) + 1)));
      hapticSuccess();
    } else if (player) {
      updatePlayerScore(player.id, -1);
      hapticBuzz();
    }

    setDeck(deck.slice(1));
  };

  const handleNext = () => {
    if (round.correct) {
      // Successfully got off the bus
      nextRound();
    } else {
      // Failed, reset round
      setRound({
        cards: [],
        phase: 'red-or-black',
        revealed: false,
      });
    }
  };

  if (!gameStarted) return null;

  const isRedBlackPhase = round.phase === 'red-or-black' && !round.revealed;
  const isHigherLowerPhase = round.phase === 'higher-or-lower' && !round.revealed;
  const isInsideOutsidePhase = round.phase === 'inside-or-outside' && !round.revealed;
  const isGuessPhase = round.phase === 'guess-suit' && !round.revealed;
  const isRevealPhase = round.phase === 'reveal' || round.revealed;

  const currentPhaseNum = ['red-or-black', 'higher-or-lower', 'inside-or-outside', 'guess-suit'].indexOf(round.phase) + 1;

  return (
    <GameLayout
      round={currentRound}
      gameMode="ride-the-bus"
      playerName={player?.name}
    >
      <GameCard>
        {/* Phase indicator */}
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                num < currentPhaseNum
                  ? 'bg-green-600 text-white'
                  : num === currentPhaseNum
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Cards display */}
        <div className="flex gap-3 justify-center mb-8 min-h-32">
          {round.cards.map((card, idx) => (
            <div
              key={idx}
              className={`w-20 h-28 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                getSuitColor(card.suit)
              } ${
                isRed(card.suit) ? 'border-red-500 bg-red-950' : 'border-slate-400 bg-slate-900'
              }`}
            >
              <div className="text-3xl font-bold">{getCardDisplay(card)}</div>
              <div className="text-2xl">{getSuitEmoji(card.suit)}</div>
            </div>
          ))}
        </div>

        {/* Round prompt */}
        <h2 className="text-2xl font-bold text-center mb-8">
          {isRedBlackPhase && "Red or Black?"}
          {isHigherLowerPhase && "Higher or Lower?"}
          {isInsideOutsidePhase && "Inside or Outside?"}
          {isGuessPhase && "Guess the Suit"}
          {isRevealPhase && (round.correct ? "✅ Correct!" : "❌ Wrong!")}
        </h2>

        {/* Buttons for guesses */}
        {isRedBlackPhase && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button onClick={() => handleRedOrBlackGuess('red')} variant="primary" className="w-full">
              Red ♥️
            </Button>
            <Button onClick={() => handleRedOrBlackGuess('black')} variant="primary" className="w-full">
              Black ♠️
            </Button>
          </div>
        )}

        {isHigherLowerPhase && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button onClick={() => handleHigherOrLowerGuess('higher')} variant="primary" className="w-full">
              Higher ⬆️
            </Button>
            <Button onClick={() => handleHigherOrLowerGuess('lower')} variant="primary" className="w-full">
              Lower ⬇️
            </Button>
          </div>
        )}

        {isInsideOutsidePhase && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button onClick={() => handleInsideOrOutsideGuess('inside')} variant="primary" className="w-full">
              Inside 📏
            </Button>
            <Button onClick={() => handleInsideOrOutsideGuess('outside')} variant="primary" className="w-full">
              Outside 🚫
            </Button>
          </div>
        )}

        {isGuessPhase && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button onClick={() => handleSuitGuess('hearts')} variant="primary" className="w-full text-red-400">
              Hearts ♥️
            </Button>
            <Button onClick={() => handleSuitGuess('diamonds')} variant="primary" className="w-full text-red-400">
              Diamonds ♦️
            </Button>
            <Button onClick={() => handleSuitGuess('clubs')} variant="primary" className="w-full">
              Clubs ♣️
            </Button>
            <Button onClick={() => handleSuitGuess('spades')} variant="primary" className="w-full">
              Spades ♠️
            </Button>
          </div>
        )}

        {isRevealPhase && (
          <Button
            onClick={handleNext}
            variant={round.correct ? 'success' : 'danger'}
            size="lg"
            className="w-full"
          >
            {round.correct ? `You're Off the Bus! (${player ? rideCount.get(player.id) || 0 : 0} rides)` : 'Start Over (or drink & quit)'}
          </Button>
        )}

        {/* Ride count tracker — only show when tracking players */}
        {players.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-600">
            <h3 className="text-sm text-slate-400 text-center mb-3">Bus Rides Completed</h3>
            <div className="space-y-2">
              {players.map(p => (
                <div key={p.id} className="flex justify-between items-center text-sm">
                  <span className={p.id === player?.id ? 'text-white font-bold' : 'text-slate-400'}>
                    {p.name}
                  </span>
                  <span className="text-pink-400 font-bold">
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
