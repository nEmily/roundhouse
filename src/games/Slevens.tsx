import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';

type GamePhase = 'ready' | 'rolling' | 'result' | 'choose-victim' | 'tap-frenzy';

const DICE_DOTS: Record<number, string> = {
  1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
};

export function Slevens() {
  const { players, getCurrentPlayer, nextRound, currentRound, nextPlayer } = useGame();
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [victim, setVictim] = useState<typeof players[0] | null>(null);

  const [rollerTaps, setRollerTaps] = useState(0);
  const [victimTaps, setVictimTaps] = useState(0);
  const TARGET_TAPS = 20;

  const player = getCurrentPlayer();

  const rollDice = () => {
    setIsRolling(true);
    setPhase('rolling');

    let rolls = 0;
    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rolls++;

      if (rolls >= 10) {
        clearInterval(interval);
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
    if (newTaps >= TARGET_TAPS) setTimeout(() => endRound(), 800);
  };

  const handleVictimTap = () => {
    if (phase !== 'tap-frenzy') return;
    const newTaps = victimTaps + 1;
    setVictimTaps(newTaps);
    if (newTaps >= TARGET_TAPS) setTimeout(() => endRound(), 800);
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
          <h2
            className="text-3xl font-black text-center mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Slevens
          </h2>
          <p
            className="text-center font-semibold mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Roll for 7, 11, or doubles!
          </p>
          <Button onClick={rollDice} variant="primary" size="lg" className="w-full">
            🎲 Roll Dice
          </Button>
        </GameCard>
      )}

      {/* Rolling / Result Phase */}
      {(phase === 'rolling' || phase === 'result') && (
        <GameCard>
          <div className="flex justify-center gap-6 mb-7">
            {[dice1, dice2].map((d, i) => (
              <div
                key={i}
                className="dice-face flex items-center justify-center"
                style={{
                  width: '7rem',
                  height: '7rem',
                  fontSize: '4.5rem',
                  animation: isRolling ? 'pop 0.15s ease-out infinite alternate' : 'none',
                }}
              >
                {DICE_DOTS[d]}
              </div>
            ))}
          </div>

          {!isRolling && (
            <>
              <div className="text-center mb-6">
                <div
                  className="text-5xl font-black mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {sum}
                </div>
                <div
                  className="text-xl font-black"
                  style={{ color: isHit ? '#3ecf7a' : '#f06040' }}
                >
                  {isHit
                    ? `✓ ${isDoubles ? 'Doubles!' : sum === 7 ? 'Seven!' : 'Eleven!'}`
                    : '✗ Drink & Pass'}
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

      {/* Choose Victim */}
      {phase === 'choose-victim' && (
        <GameCard>
          <h2
            className="text-2xl font-black text-center mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Choose Your Victim!
          </h2>
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
                    className="py-5"
                  >
                    {p.name}
                  </Button>
                ))}
            </div>
          ) : (
            <>
              <p
                className="text-center text-lg font-bold mb-8"
                style={{ color: 'var(--text-secondary)' }}
              >
                Point at someone — they're your opponent!
              </p>
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

      {/* Tap Frenzy */}
      {phase === 'tap-frenzy' && victim && (
        <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 120px)' }}>
          <div className="text-center mb-4 px-4">
            <div
              className="text-2xl font-black"
              style={{ color: '#f5a623' }}
            >
              TAP FRENZY!
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: 'var(--text-muted)' }}
            >
              First to {TARGET_TAPS} wins!
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-2.5 touch-none select-none px-1 pb-2">
            {/* Roller side */}
            <div
              onPointerDown={(e) => {
                e.preventDefault();
                if (rollerTaps < TARGET_TAPS && victimTaps < TARGET_TAPS) handleRollerTap();
              }}
              className="rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all"
              style={{
                background: 'linear-gradient(160deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                opacity: rollerTaps >= TARGET_TAPS || victimTaps >= TARGET_TAPS ? 0.65 : 1,
              }}
            >
              <div
                className="text-2xl font-black mb-3 text-center leading-tight"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {player?.name || 'Roller'}
              </div>
              <div
                className="text-6xl font-black mb-4"
                style={{ color: '#fff' }}
              >
                {rollerTaps}
              </div>
              <div className="tap-bar w-full">
                <div
                  className="tap-bar-fill"
                  style={{ width: `${Math.min((rollerTaps / TARGET_TAPS) * 100, 100)}%` }}
                />
              </div>
              {rollerTaps >= TARGET_TAPS && (
                <div className="text-2xl mt-3">🏆 WIN!</div>
              )}
            </div>

            {/* Victim side */}
            <div
              onPointerDown={(e) => {
                e.preventDefault();
                if (rollerTaps < TARGET_TAPS && victimTaps < TARGET_TAPS) handleVictimTap();
              }}
              className="rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all"
              style={{
                background: 'linear-gradient(160deg, #f06040 0%, #c73e22 100%)',
                boxShadow: '0 4px 16px rgba(240,96,64,0.35)',
                opacity: rollerTaps >= TARGET_TAPS || victimTaps >= TARGET_TAPS ? 0.65 : 1,
              }}
            >
              <div
                className="text-2xl font-black mb-3 text-center leading-tight"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                {victim.name}
              </div>
              <div
                className="text-6xl font-black mb-4"
                style={{ color: '#fff' }}
              >
                {victimTaps}
              </div>
              <div className="tap-bar w-full">
                <div
                  className="tap-bar-fill"
                  style={{ width: `${Math.min((victimTaps / TARGET_TAPS) * 100, 100)}%` }}
                />
              </div>
              {victimTaps >= TARGET_TAPS && (
                <div className="text-2xl mt-3">🏆 WIN!</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next Round button — always visible */}
      <div className="mt-4 px-1">
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
