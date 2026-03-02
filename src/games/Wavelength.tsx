import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { wavelengthRounds } from '../data/wavelength';
import { hapticSuccess, hapticBuzz, hapticTap } from '../utils/haptics';

type Phase = 'psychic' | 'guessing' | 'reveal';

function getResultMessage(distance: number): { label: string; emoji: string; points: number } {
  if (distance <= 5) return { label: 'Bullseye!', emoji: '🎯', points: 3 };
  if (distance <= 15) return { label: 'So close!', emoji: '🔥', points: 2 };
  if (distance <= 25) return { label: 'Not bad!', emoji: '👍', points: 1 };
  return { label: 'Way off!', emoji: '😬', points: 0 };
}

export function Wavelength() {
  const { intensity, getCurrentPlayer, nextRound, nextTurn, currentRound, players } = useGame();
  const [spectrum, setSpectrum] = useState<typeof wavelengthRounds[0] | null>(null);
  const [usedSpectrumIds, setUsedSpectrumIds] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<Phase>('psychic');
  const [targetPosition, setTargetPosition] = useState(50);
  const [guessPosition, setGuessPosition] = useState(50);
  const [showingPass, setShowingPass] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState<string | undefined>(undefined);
  const [revealAnimated, setRevealAnimated] = useState(false);

  const spectrumBarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const player = getCurrentPlayer();

  // Pick a new spectrum on mount / intensity change
  useEffect(() => {
    pickNewSpectrum();
  }, [intensity]);

  function pickNewSpectrum() {
    let filtered = wavelengthRounds.filter((s, idx) => s.intensity <= intensity && !usedSpectrumIds.has(idx));

    if (filtered.length === 0) {
      setUsedSpectrumIds(new Set());
      filtered = wavelengthRounds.filter(s => s.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = wavelengthRounds.findIndex(s => s === random);
    setSpectrum(random);
    setUsedSpectrumIds(prev => new Set(prev).add(randomIdx));

    // Random target position between 10 and 90 (avoid extremes)
    setTargetPosition(Math.floor(Math.random() * 81) + 10);
    setGuessPosition(50);
    setPhase('psychic');
    setRevealAnimated(false);
  }

  // Touch handling for the guess slider
  const getPositionFromTouch = useCallback((clientX: number) => {
    if (!spectrumBarRef.current) return guessPosition;
    const rect = spectrumBarRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    return Math.round(pct);
  }, [guessPosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (phase !== 'guessing') return;
    isDragging.current = true;
    const touch = e.touches[0];
    setGuessPosition(getPositionFromTouch(touch.clientX));
    hapticTap();
  }, [phase, getPositionFromTouch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || phase !== 'guessing') return;
    e.preventDefault();
    const touch = e.touches[0];
    setGuessPosition(getPositionFromTouch(touch.clientX));
  }, [phase, getPositionFromTouch]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Mouse handling for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (phase !== 'guessing') return;
    isDragging.current = true;
    setGuessPosition(getPositionFromTouch(e.clientX));
    hapticTap();
  }, [phase, getPositionFromTouch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || phase !== 'guessing') return;
    setGuessPosition(getPositionFromTouch(e.clientX));
  }, [phase, getPositionFromTouch]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleClueGiven = () => {
    setPhase('guessing');
    hapticTap();
  };

  const handleLockIn = () => {
    setPhase('reveal');
    hapticTap();
    // Animate reveal after a short delay
    setTimeout(() => {
      setRevealAnimated(true);
      const distance = Math.abs(guessPosition - targetPosition);
      if (distance <= 15) {
        hapticSuccess();
      } else {
        hapticBuzz();
      }
    }, 300);
  };

  const handleNextRound = () => {
    if (players.length > 0) {
      // Show pass screen for next player
      const nextIdx = (players.findIndex(p => p.id === player?.id) + 1) % players.length;
      setNextPlayerName(players[nextIdx]?.name);
      setShowingPass(true);
    } else {
      nextRound();
    }
  };

  const handlePassReady = () => {
    setShowingPass(false);
    nextTurn();
    pickNewSpectrum();
  };

  if (showingPass) {
    return <PassPhoneScreen playerName={nextPlayerName} onReady={handlePassReady} />;
  }

  if (!spectrum) return null;

  const distance = Math.abs(guessPosition - targetPosition);
  const result = getResultMessage(distance);

  // Target zone width (12% of spectrum)
  const targetWidth = 12;
  const targetLeft = targetPosition - targetWidth / 2;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="wavelength"
    >
      <GameCard>
        {/* Phase indicator */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            {(['psychic', 'guessing', 'reveal'] as Phase[]).map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                <div
                  className="wavelength-phase-dot"
                  style={{
                    backgroundColor: phase === p
                      ? 'rgba(56,189,248,0.25)'
                      : p === 'psychic' && phase !== 'psychic'
                        ? 'rgba(62,207,122,0.2)'
                        : p === 'guessing' && phase === 'reveal'
                          ? 'rgba(62,207,122,0.2)'
                          : 'var(--bg-elevated)',
                    color: phase === p
                      ? '#38bdf8'
                      : p === 'psychic' && phase !== 'psychic'
                        ? '#3ecf7a'
                        : p === 'guessing' && phase === 'reveal'
                          ? '#3ecf7a'
                          : 'var(--text-muted)',
                    border: phase === p
                      ? '1.5px solid rgba(56,189,248,0.5)'
                      : '1.5px solid rgba(255,180,80,0.12)',
                  }}
                >
                  {p === 'psychic' && phase !== 'psychic' ? '✓' :
                   p === 'guessing' && phase === 'reveal' ? '✓' :
                   i + 1}
                </div>
                {i < 2 && (
                  <div
                    className="w-6 h-0.5 rounded-full"
                    style={{
                      backgroundColor: (i === 0 && phase !== 'psychic') || (i === 1 && phase === 'reveal')
                        ? 'rgba(62,207,122,0.4)'
                        : 'rgba(255,180,80,0.12)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            {phase === 'psychic' && `${player?.name || 'Psychic'} is the Psychic`}
            {phase === 'guessing' && 'Group Guess'}
            {phase === 'reveal' && 'Reveal'}
          </p>
        </div>

        {/* Spectrum labels */}
        <div className="flex items-stretch gap-3 mb-4">
          <div
            className="flex-1 rounded-xl px-4 py-3 text-center font-black text-base"
            style={{
              backgroundColor: 'rgba(56,189,248,0.1)',
              color: '#38bdf8',
              border: '1.5px solid rgba(56,189,248,0.25)',
            }}
          >
            {spectrum.leftLabel}
          </div>
          <div
            className="flex items-center font-black text-xl"
            style={{ color: 'var(--text-muted)' }}
          >
            ↔
          </div>
          <div
            className="flex-1 rounded-xl px-4 py-3 text-center font-black text-base"
            style={{
              backgroundColor: 'rgba(167,139,250,0.1)',
              color: '#a78bfa',
              border: '1.5px solid rgba(167,139,250,0.25)',
            }}
          >
            {spectrum.rightLabel}
          </div>
        </div>

        {/* Spectrum bar with target and/or needle */}
        <div className="mb-6">
          <div
            ref={spectrumBarRef}
            className="wavelength-spectrum"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ touchAction: phase === 'guessing' ? 'none' : 'auto' }}
          >
            {/* Target zone — visible during psychic and reveal phases */}
            {(phase === 'psychic' || (phase === 'reveal' && revealAnimated)) && (
              <div
                className={`wavelength-target ${phase === 'reveal' ? 'wavelength-target-reveal' : ''}`}
                style={{
                  left: `${targetLeft}%`,
                  width: `${targetWidth}%`,
                }}
              />
            )}

            {/* Guess needle — visible during guessing and reveal */}
            {(phase === 'guessing' || phase === 'reveal') && (
              <div
                className={`wavelength-needle ${phase === 'guessing' ? 'wavelength-needle-active' : ''}`}
                style={{ left: `${guessPosition}%` }}
              />
            )}
          </div>

          {/* Percentage hint during guessing */}
          {phase === 'guessing' && (
            <p
              className="text-center text-xs font-bold mt-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Drag to guess where the target is
            </p>
          )}
        </div>

        {/* Phase-specific content */}
        {phase === 'psychic' && (
          <>
            <div
              className="rounded-2xl p-5 text-center mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(167,139,250,0.08))',
                border: '1px solid rgba(56,189,248,0.18)',
              }}
            >
              <p
                className="text-lg font-black mb-1.5"
                style={{ color: 'var(--text-primary)' }}
              >
                You see the target zone!
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                Give a verbal clue — something that lives at that spot on the spectrum. Then pass the phone.
              </p>
            </div>
            <Button onClick={handleClueGiven} variant="primary" size="lg" className="w-full">
              Clue Given! Pass the Phone
            </Button>
          </>
        )}

        {phase === 'guessing' && (
          <>
            <div
              className="rounded-2xl p-5 text-center mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(167,139,250,0.08))',
                border: '1px solid rgba(56,189,248,0.18)',
              }}
            >
              <p
                className="text-lg font-black mb-1.5"
                style={{ color: 'var(--text-primary)' }}
              >
                Where's the target?
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                Discuss the psychic's clue and drag the needle to your guess.
              </p>
            </div>
            <Button onClick={handleLockIn} variant="success" size="lg" className="w-full">
              Lock In Guess
            </Button>
          </>
        )}

        {phase === 'reveal' && (
          <>
            <div
              className={`rounded-2xl p-5 text-center mb-6 ${revealAnimated ? 'animate-fade-in' : ''}`}
              style={{
                background: result.points >= 2
                  ? 'linear-gradient(135deg, rgba(62,207,122,0.12), rgba(56,189,248,0.08))'
                  : 'linear-gradient(135deg, rgba(240,96,64,0.08), rgba(167,139,250,0.08))',
                border: result.points >= 2
                  ? '1px solid rgba(62,207,122,0.25)'
                  : '1px solid rgba(240,96,64,0.2)',
              }}
            >
              {revealAnimated ? (
                <>
                  <div className="text-4xl mb-2">{result.emoji}</div>
                  <p
                    className="text-2xl font-black mb-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {result.label}
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {distance <= 5 && 'Perfect read! The group nailed it.'}
                    {distance > 5 && distance <= 15 && 'Almost there! Great teamwork.'}
                    {distance > 15 && distance <= 25 && 'Decent guess, could be closer.'}
                    {distance > 25 && 'The psychic needs to work on their clues!'}
                  </p>
                  {result.points > 0 && (
                    <p
                      className="text-xs font-bold mt-2"
                      style={{ color: result.points >= 2 ? '#3ecf7a' : 'var(--text-muted)' }}
                    >
                      +{result.points} point{result.points !== 1 ? 's' : ''}
                    </p>
                  )}
                </>
              ) : (
                <p
                  className="text-lg font-black"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Revealing...
                </p>
              )}
            </div>
            {revealAnimated && (
              <Button onClick={handleNextRound} variant="primary" size="lg" className="w-full">
                Next Round →
              </Button>
            )}
          </>
        )}
      </GameCard>
    </GameLayout>
  );
}
