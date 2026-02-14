import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { hapticBuzz } from '../utils/haptics';

type GamePhase = 'setup' | 'view-dice' | 'bidding' | 'reveal' | 'result';

interface PlayerDice {
  playerId: string;
  dice: number[];
  hasViewed: boolean;
}

interface Bid {
  playerId: string;
  playerName: string;
  quantity: number;
  value: number; // 1-6
}

const DIE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export function LiarsDice() {
  const { players, getCurrentPlayer, currentRound } = useGame();
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [playerDice, setPlayerDice] = useState<PlayerDice[]>([]);
  const [currentViewerIndex, setCurrentViewerIndex] = useState(0);
  const [currentBidderIndex, setCurrentBidderIndex] = useState(0);
  const [bids, setBids] = useState<Bid[]>([]);
  const [draftQuantity, setDraftQuantity] = useState(1);
  const [draftValue, setDraftValue] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [bidError, setBidError] = useState(false);

  const player = getCurrentPlayer();

  // Initialize game
  useEffect(() => {
    if (phase === 'setup') {
      const newPlayerDice: PlayerDice[] = players.map(p => ({
        playerId: p.id,
        dice: Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1),
        hasViewed: false,
      }));
      setPlayerDice(newPlayerDice);
      setCurrentViewerIndex(0);
      setCurrentBidderIndex(0);
      setBids([]);
      setRevealed(false);
      setWinner('');
      setPhase('view-dice');
    }
  }, [phase, players]);

  const currentViewer = players[currentViewerIndex];
  const currentViewerDice = playerDice.find(pd => pd.playerId === currentViewer?.id);

  const currentBidder = players[currentBidderIndex];
  const lastBid = bids[bids.length - 1];

  const handleViewDice = () => {
    // Mark as viewed
    setPlayerDice(prev =>
      prev.map(pd =>
        pd.playerId === currentViewer.id ? { ...pd, hasViewed: true } : pd
      )
    );

    // Move to next player
    if (currentViewerIndex < players.length - 1) {
      setCurrentViewerIndex(prev => prev + 1);
    } else {
      // All players have viewed, start bidding
      setPhase('bidding');
    }
  };

  const handleMakeBid = () => {
    if (!currentBidder) return;

    // Validate bid is higher than last bid
    if (lastBid) {
      const isHigher = draftQuantity > lastBid.quantity ||
        (draftQuantity === lastBid.quantity && draftValue > lastBid.value);
      if (!isHigher) {
        setBidError(true);
        setTimeout(() => setBidError(false), 2000);
        return;
      }
    }

    setBidError(false);
    setBids(prev => [...prev, {
      playerId: currentBidder.id,
      playerName: currentBidder.name,
      quantity: draftQuantity,
      value: draftValue,
    }]);

    // Move to next bidder
    setCurrentBidderIndex((prev) => (prev + 1) % players.length);

    // Reset draft for next player
    setDraftQuantity(lastBid ? lastBid.quantity : 1);
    setDraftValue(lastBid ? lastBid.value : 1);
  };

  const handleCallLiar = () => {
    setPhase('reveal');
    setRevealed(true);
    hapticBuzz();

    // Count all dice matching the bid value
    const totalCount = playerDice.reduce((sum, pd) => {
      return sum + pd.dice.filter(d => d === lastBid.value).length;
    }, 0);

    // Check if bid was accurate
    if (totalCount >= lastBid.quantity) {
      // Bid was correct, caller loses
      setWinner(`${lastBid.playerName} was telling the truth! Caller drinks!`);
    } else {
      // Bid was wrong, bidder loses
      setWinner(`${lastBid.playerName} was lying! ${lastBid.playerName} drinks!`);
    }

    setTimeout(() => {
      setPhase('result');
    }, 3000);
  };

  const handleNextRound = () => {
    setPhase('setup');
  };

  if (!player) return null;

  return (
    <GameLayout
      round={currentRound}
      gameMode="liars-dice"
    >
      {/* View Dice Phase */}
      {phase === 'view-dice' && currentViewerDice && (
        <GameCard>
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              🤫 SECRET VIEWING 🤫
            </div>
            <div className="text-3xl font-bold mb-2">{currentViewer.name}'s Dice</div>
            <div className="text-lg text-red-400 font-bold">
              ⚠️ Show only to {currentViewer.name} — NO PEEKING! ⚠️
            </div>
          </div>

          {!currentViewerDice.hasViewed ? (
            <>
              <div className="flex justify-center gap-3 mb-8">
                {currentViewerDice.dice.map((die, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-6xl shadow-2xl"
                  >
                    {DIE_FACES[die - 1]}
                  </div>
                ))}
              </div>

              <Button onClick={handleViewDice} variant="primary" size="lg" className="w-full">
                ✓ I've Seen My Dice
              </Button>

              <div className="mt-4 text-center text-slate-400 text-sm">
                {currentViewerIndex + 1} / {players.length} players
              </div>
            </>
          ) : (
            <div className="text-center text-green-400 text-2xl font-bold">
              ✓ Dice viewed! Passing to next player...
            </div>
          )}
        </GameCard>
      )}

      {/* Bidding Phase */}
      {phase === 'bidding' && (
        <GameCard>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold mb-2">🎲 Liar's Dice 🎲</div>
            <div className="text-xl text-pink-400 font-bold">{currentBidder.name}'s Turn</div>
          </div>

          {lastBid && (
            <div className="bg-slate-700 rounded-xl p-4 mb-6">
              <div className="text-sm text-slate-400 mb-1">Current Bid:</div>
              <div className="text-2xl font-bold">
                {lastBid.playerName}: At least {lastBid.quantity} × {DIE_FACES[lastBid.value - 1]}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="text-lg font-bold mb-3 text-center">Make Your Bid:</div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <div className="text-sm text-slate-400 mb-2 text-center">How many dice?</div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setDraftQuantity(Math.max(1, draftQuantity - 1))}
                  variant="secondary"
                  size="sm"
                  className="w-14 h-14 !text-3xl !p-0"
                >
                  -
                </Button>
                <div className="text-5xl font-bold w-20 text-center">{draftQuantity}</div>
                <Button
                  onClick={() => setDraftQuantity(Math.min(players.length * 5, draftQuantity + 1))}
                  variant="secondary"
                  size="sm"
                  className="w-14 h-14 !text-3xl !p-0"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Die Value Selector */}
            <div className="mb-4">
              <div className="text-sm text-slate-400 mb-2 text-center">Which die face?</div>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map(value => (
                  <Button
                    key={value}
                    onClick={() => setDraftValue(value)}
                    variant={draftValue === value ? 'primary' : 'secondary'}
                    size="sm"
                    className={`!text-5xl !p-4 ${draftValue === value ? 'scale-110' : ''}`}
                  >
                    {DIE_FACES[value - 1]}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {bidError && (
            <div className="text-red-400 text-center font-bold mb-4 animate-pop">
              ⬆ Bid must be higher! Increase quantity or value.
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={handleMakeBid} variant="primary" size="lg" className="w-full">
              Bid: {draftQuantity} × {DIE_FACES[draftValue - 1]}
            </Button>

            {lastBid && (
              <Button onClick={handleCallLiar} variant="danger" size="lg" className="w-full">
                🚨 Call LIAR! 🚨
              </Button>
            )}
          </div>

          <div className="mt-6 text-center text-slate-400 text-sm">
            Total dice in play: {players.length * 5}
          </div>
        </GameCard>
      )}

      {/* Reveal Phase */}
      {phase === 'reveal' && revealed && lastBid && (
        <GameCard>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold mb-4">🔍 REVEAL ALL DICE! 🔍</div>
            <div className="bg-slate-700 rounded-xl p-4 mb-6">
              <div className="text-sm text-slate-400 mb-1">The Bid Was:</div>
              <div className="text-2xl font-bold">
                At least {lastBid.quantity} × {DIE_FACES[lastBid.value - 1]}
              </div>
            </div>
          </div>

          {playerDice.map((pd, idx) => {
            const p = players.find(player => player.id === pd.playerId);
            const matchingCount = pd.dice.filter(d => d === lastBid.value).length;

            return (
              <div key={idx} className="mb-4">
                <div className="text-lg font-bold mb-2">
                  {p?.name} - {matchingCount} × {DIE_FACES[lastBid.value - 1]}
                </div>
                <div className="flex gap-2">
                  {pd.dice.map((die, dieIdx) => (
                    <div
                      key={dieIdx}
                      className={`w-16 h-16 ${
                        die === lastBid.value ? 'bg-green-500' : 'bg-white'
                      } rounded-xl flex items-center justify-center text-4xl shadow-lg`}
                    >
                      {DIE_FACES[die - 1]}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-6 text-center">
            <div className="text-2xl font-bold mb-2">
              Total: {playerDice.reduce((sum, pd) => sum + pd.dice.filter(d => d === lastBid.value).length, 0)} × {DIE_FACES[lastBid.value - 1]}
            </div>
          </div>
        </GameCard>
      )}

      {/* Result Phase */}
      {phase === 'result' && (
        <GameCard>
          <div className="text-center">
            <div className="text-5xl font-bold mb-6 text-pink-400">
              {winner}
            </div>

            <Button onClick={handleNextRound} variant="primary" size="lg" className="w-full">
              Next Round
            </Button>
          </div>
        </GameCard>
      )}
    </GameLayout>
  );
}
