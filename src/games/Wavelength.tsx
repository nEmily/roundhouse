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
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-full text-lg font-bold mb-4">
            📡 Wavelength
          </div>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-slate-700 px-5 py-3 rounded-xl text-lg font-bold text-center flex-1 mr-2">
              {spectrum.leftLabel}
            </div>
            <div className="text-slate-500 text-2xl font-bold mx-2">↔</div>
            <div className="bg-slate-700 px-5 py-3 rounded-xl text-lg font-bold text-center flex-1 ml-2">
              {spectrum.rightLabel}
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-600 via-slate-600 to-blue-600 h-4 rounded-full" />
        </div>

        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 rounded-2xl p-6 text-center mb-10">
          <p className="text-xl font-bold mb-2">Name something on this spectrum!</p>
          <p className="text-base text-slate-300">Everyone debates where it falls. Outliers drink 🍺</p>
        </div>

        <Button onClick={() => nextRound()} variant="primary" size="lg" className="w-full">
          Next Round
        </Button>
      </GameCard>
    </GameLayout>
  );
}
