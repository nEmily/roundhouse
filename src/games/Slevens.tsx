import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { hapticBuzz } from '../utils/haptics';

type GamePhase = 'ready' | 'rolling' | 'result' | 'choose-victim' | 'tap-frenzy' | 'bomb-timer';
type MechanicMode = 'tap-frenzy' | 'bomb-timer';

export function Slevens() {
  const { players, getCurrentPlayer, nextRound, currentRound, nextPlayer } = useGame();
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [victim, setVictim] = useState<typeof players[0] | null>(null);
  const [mechanicMode, setMechanicMode] = useState<MechanicMode>('tap-frenzy');
  const [showSettings, setShowSettings] = useState(false);

  // Tap Frenzy state
  const [rollerTaps, setRollerTaps] = useState(0);
  const [victimTaps, setVictimTaps] = useState(0);
  const TARGET_TAPS = 20;

  // Bomb Timer state
  const [timerDuration, setTimerDuration] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bombExploded, setBombExploded] = useState(false);
  const [victimSafe, setVictimSafe] = useState(false);

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

    if (mechanicMode === 'tap-frenzy') {
      setRollerTaps(0);
      setVictimTaps(0);
      setPhase('tap-frenzy');
    } else {
      const duration = Math.floor(Math.random() * 9000) + 3000; // 3-12 seconds
      setTimerDuration(duration);
      setTimeElapsed(0);
      setBombExploded(false);
      setVictimSafe(false);
      setPhase('bomb-timer');
    }
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

  const handleBombDone = () => {
    if (phase !== 'bomb-timer' || bombExploded) return;
    setVictimSafe(true);
    setTimeout(() => endRound(), 1500);
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

  // Bomb timer effect
  useEffect(() => {
    if (phase !== 'bomb-timer') return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const next = prev + 100;
        if (next >= timerDuration && !bombExploded) {
          setBombExploded(true);
          hapticBuzz();
          setTimeout(() => endRound(), 1500);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [phase, timerDuration, bombExploded]);

  // player may be null when playing without names

  const sum = dice1 + dice2;
  const isDoubles = dice1 === dice2;
  const isHit = sum === 7 || sum === 11 || isDoubles;

  // Bomb timer color based on progress
  const getBombColor = () => {
    const progress = timeElapsed / timerDuration;
    if (progress < 0.25) return 'bg-green-500';
    if (progress < 0.5) return 'bg-yellow-500';
    if (progress < 0.75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="slevens"
    >
      {/* Settings Toggle */}
      {showSettings && (
        <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
      )}
      <div className="absolute top-6 left-6 z-50">
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="secondary"
          size="sm"
          className="!p-3 !rounded-full !text-2xl"
        >
          ⚙️
        </Button>
        {showSettings && (
          <div className="absolute top-14 left-0 bg-slate-800 rounded-xl p-4 shadow-xl min-w-[200px]">
            <div className="text-sm font-bold mb-3">Game Mechanic</div>
            <Button
              onClick={() => {
                setMechanicMode('tap-frenzy');
                setShowSettings(false);
              }}
              variant={mechanicMode === 'tap-frenzy' ? 'primary' : 'secondary'}
              size="sm"
              className="w-full mb-2 !text-left"
            >
              ⚡ Tap Frenzy
            </Button>
            <Button
              onClick={() => {
                setMechanicMode('bomb-timer');
                setShowSettings(false);
              }}
              variant={mechanicMode === 'bomb-timer' ? 'primary' : 'secondary'}
              size="sm"
              className="w-full !text-left"
            >
              💣 Bomb Timer
            </Button>
          </div>
        )}
      </div>

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
          <h2 className="text-3xl font-bold text-center mb-2">Choose Your Victim!</h2>
          <p className="text-center text-slate-400 mb-6">
            Mode: {mechanicMode === 'tap-frenzy' ? '⚡ Tap Frenzy' : '💣 Bomb Timer'}
          </p>
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

      {/* Bomb Timer Phase */}
      {phase === 'bomb-timer' && victim && (
        <GameCard>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">💣 BOMB TIMER 💣</div>
            <div className="text-xl text-slate-400 mb-8">
              {victim.name} — Drink and tap "DONE"!
            </div>

            <div
              className={`${victimSafe ? 'bg-green-500' : bombExploded ? 'bg-red-600 animate-pulse' : getBombColor()} rounded-3xl p-16 mb-8 transition-all duration-300 transition-colors`}
            >
              {victimSafe ? (
                <div className="text-white text-8xl font-bold">✅</div>
              ) : !bombExploded ? (
                <div className="text-white text-8xl font-bold animate-pulse">💣</div>
              ) : (
                <div className="text-white text-8xl font-bold">💥</div>
              )}
            </div>

            {victimSafe ? (
              <div className="text-4xl font-bold text-green-400 mb-4">SAFE! Nice chug!</div>
            ) : !bombExploded ? (
              <Button onClick={handleBombDone} variant="success" size="lg" className="w-full">
                ✓ DONE!
              </Button>
            ) : (
              <div className="text-4xl font-bold text-red-400 mb-4">BOOM! Penalty!</div>
            )}
          </div>
        </GameCard>
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
