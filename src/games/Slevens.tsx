import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';

type GamePhase = 'ready' | 'rolling' | 'result' | 'choose-victim' | 'tap-frenzy';

export function Slevens() {
  const { players, getCurrentPlayer, nextRound, currentRound, nextPlayer } = useGame();
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [victim, setVictim] = useState<typeof players[0] | null>(null);

  // Tap Frenzy state
  const [rollerTaps, setRollerTaps] = useState(0);
  const [victimTaps, setVictimTaps] = useState(0);
  const TARGET_TAPS = 20;

  const player = getCurrentPlayer();

  const rollDice = () => {
    setIsRolling(true);
    setPhase('rolling');

    // Animate dice rolling
    let rolls = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= 10) {
        clearInterval(interval);
        // Final roll
        const final1 = Math.floor(Math.random() * 6) + 1;
        const final2 = Math.floor(Math.random() * 6) + 1;
        setDice1(final1);
        setDice2(final2);
        setIsRolling(false);

        setTimeout(() => {
          checkResult(final1, final2);
        }, 500);
      }
    }, 100);
  };

  const checkResult = (d1: number, d2: number) => {
    const sum = d1 + d2;
    const isDoubles = d1 === d2;

    if (sum === 7 || sum === 11 || isDoubles) {
      setPhase('choose-victim');
    } else {
      setPhase('result');
    }
  };

  const selectVictim = (selectedPlayer: typeof players[0]) => {
    setVictim(selectedPlayer);
    setRollerTaps(0);
    setVictimTaps(0);
    setPhase('tap-frenzy');
  };

  const handleRollerTap = () => {
    if (phase !== 'tap-frenzy') return;
    const newTaps = rollerTaps + 1;
    setRollerTaps(newTaps);
    if (newTaps >= TARGET_TAPS) {
      setTimeout(() => endRound(), 1000);
    }
  };

  const handleVictimTap = () => {
    if (phase !== 'tap-frenzy') return;
    const newTaps = victimTaps + 1;
    setVictimTaps(newTaps);
    if (newTaps >= TARGET_TAPS) {
      setTimeout(() => endRound(), 1000);
    }
  };

  const endRound = () => {
    setPhase('ready');
    setVictim(null);
    nextPlayer();
  };

  const skipToNextRound = () => {
    setPhase('ready');
    setVictim(null);
    nextRound();
  };

  // player may be null when playing without names

  const sum = dice1 + dice2;
  const isDoubles = dice1 === dice2;
  const isHit = sum === 7 || sum === 11 || isDoubles;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="slevens"
    >
      {/* Ready Phase */}
      {phase === 'ready' && (
        <GameCard>
          <h2 className="text-4xl font-bold text-center mb-6">Slevens</h2>
          <p className="text-lg text-center text-slate-300 mb-8">
            Roll for 7, 11, or doubles!
          </p>
          <Button onClick={rollDice} variant="primary" size="lg" className="w-full">
            🎲 Roll Dice
          </Button>
        </GameCard>
      )}

      {/* Rolling/Result Phase */}
      {(phase === 'rolling' || phase === 'result') && (
        <GameCard>
          <div className="flex justify-center gap-8 mb-8">
            <div
              className={`w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-7xl font-bold text-slate-900 shadow-2xl ${
                isRolling ? 'animate-bounce' : ''
              }`}
            >
              {dice1}
            </div>
            <div
              className={`w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-7xl font-bold text-slate-900 shadow-2xl ${
                isRolling ? 'animate-bounce' : ''
              }`}
            >
              {dice2}
            </div>
          </div>

          {!isRolling && (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2">{sum}</div>
                <div className={`text-2xl font-bold ${isHit ? 'text-green-400' : 'text-red-400'}`}>
                  {isHit ? (
                    <>✓ {isDoubles ? 'Doubles!' : sum === 7 ? 'Seven!' : 'Eleven!'}</>
                  ) : (
                    '✗ Drink & Pass'
                  )}
                </div>
              </div>

              {!isHit && (
                <Button onClick={endRound} variant="danger" size="lg" className="w-full">
                  Drink & Pass Left
                </Button>
              )}
            </>
          )}
        </GameCard>
      )}

      {/* Choose Victim Phase */}
      {phase === 'choose-victim' && (
        <GameCard>
          <h2 className="text-3xl font-bold text-center mb-6">Choose Your Victim!</h2>
          {players.length > 1 ? (
            <div className="grid grid-cols-2 gap-3">
              {players
                .filter(p => p.id !== player?.id)
                .map(p => (
                  <Button
                    key={p.id}
                    onClick={() => selectVictim(p)}
                    variant="danger"
                    size="md"
                    className="py-6"
                  >
                    {p.name}
                  </Button>
                ))}
            </div>
          ) : (
            <>
              <p className="text-center text-xl mb-8">Point at someone — they're your opponent!</p>
              <Button
                onClick={() => selectVictim({ id: 'victim', name: 'Victim', score: 0 })}
                variant="danger"
                size="lg"
                className="w-full"
              >
                Let's Go!
              </Button>
            </>
          )}
        </GameCard>
      )}

      {/* Tap Frenzy Phase */}
      {phase === 'tap-frenzy' && victim && (
        <div className="h-full flex flex-col">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold">⚡ TAP FRENZY! ⚡</div>
            <div className="text-lg text-slate-400">First to {TARGET_TAPS} wins!</div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-2 touch-none select-none">
            {/* Roller Side — use onPointerDown for simultaneous two-thumb tapping */}
            <div
              onPointerDown={(e) => {
                e.preventDefault();
                if (rollerTaps < TARGET_TAPS && victimTaps < TARGET_TAPS) handleRollerTap();
              }}
              className={`bg-gradient-to-br from-blue-500 to-blue-600 active:from-blue-700 active:to-blue-800 rounded-2xl p-8 flex flex-col items-center justify-center active:scale-[0.97] cursor-pointer ${
                rollerTaps >= TARGET_TAPS || victimTaps >= TARGET_TAPS ? 'opacity-60' : ''
              }`}
            >
              <div className="text-4xl font-bold mb-4">{player?.name || 'Roller'}</div>
              <div className="text-7xl font-bold mb-4">{rollerTaps}</div>
              <div className="w-full bg-slate-900 rounded-full h-4">
                <div
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: `${(rollerTaps / TARGET_TAPS) * 100}%` }}
                />
              </div>
              {rollerTaps >= TARGET_TAPS && (
                <div className="text-3xl mt-4">🏆 WINNER!</div>
              )}
            </div>

            {/* Victim Side */}
            <div
              onPointerDown={(e) => {
                e.preventDefault();
                if (rollerTaps < TARGET_TAPS && victimTaps < TARGET_TAPS) handleVictimTap();
              }}
              className={`bg-gradient-to-br from-red-500 to-red-600 active:from-red-700 active:to-red-800 rounded-2xl p-8 flex flex-col items-center justify-center active:scale-[0.97] cursor-pointer ${
                rollerTaps >= TARGET_TAPS || victimTaps >= TARGET_TAPS ? 'opacity-60' : ''
              }`}
            >
              <div className="text-4xl font-bold mb-4">{victim.name}</div>
              <div className="text-7xl font-bold mb-4">{victimTaps}</div>
              <div className="w-full bg-slate-900 rounded-full h-4">
                <div
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: `${(victimTaps / TARGET_TAPS) * 100}%` }}
                />
              </div>
              {victimTaps >= TARGET_TAPS && (
                <div className="text-3xl mt-4">🏆 WINNER!</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next Round Button (always available) */}
      <div className="mt-6">
        <Button
          onClick={skipToNextRound}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          Next Round →
        </Button>
      </div>
    </GameLayout>
  );
}
