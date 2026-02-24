import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { wavelengthRounds } from '../data/wavelength';

export function Wavelength() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [spectrum, setSpectrum] = useState<typeof wavelengthRounds[0] | null>(null);
  const [usedSpectrumIds, setUsedSpectrumIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    let filtered = wavelengthRounds.filter((s, idx) => s.intensity <= intensity && !usedSpectrumIds.has(idx));

    if (filtered.length === 0) {
      setUsedSpectrumIds(new Set());
      filtered = wavelengthRounds.filter(s => s.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = wavelengthRounds.findIndex(s => s === random);
    setSpectrum(random);
    setUsedSpectrumIds(prev => new Set(prev).add(randomIdx));
  }, [intensity]);

  if (!spectrum) return null;

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="wavelength"
    >
      <GameCard>
        {/* Wavelength badge */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black"
            style={{
              backgroundColor: 'rgba(56,189,248,0.14)',
              color: '#38bdf8',
              border: '1.5px solid rgba(56,189,248,0.3)',
            }}
          >
            📡 Wavelength
          </div>
        </div>

        {/* Spectrum display */}
        <div className="mb-8">
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

          {/* Spectrum gradient bar */}
          <div className="spectrum-bar" />
        </div>

        {/* Instructions */}
        <div
          className="rounded-2xl p-5 text-center mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(167,139,250,0.08))',
            border: '1px solid rgba(56,189,248,0.18)',
          }}
        >
          <p
            className="text-lg font-black mb-1.5"
            style={{ color: 'var(--text-primary)' }}
          >
            Name something on this spectrum!
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            Everyone debates where it falls. Outliers drink 🍺
          </p>
        </div>

        <Button onClick={() => nextRound()} variant="primary" size="lg" className="w-full">
          Next Round →
        </Button>
      </GameCard>
    </GameLayout>
  );
}
