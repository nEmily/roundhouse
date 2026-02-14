import { useState, useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { wavelengthRounds } from '../data/wavelength';

export function Wavelength() {
  const { intensity, players, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [spectrum, setSpectrum] = useState<typeof wavelengthRounds[0] | null>(null);
  const [clueGiverPlacement, setClueGiverPlacement] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<Map<string, number>>(new Map());
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<'clue' | 'guess' | 'reveal'>('clue');
  const [clueGiverName, setClueGiverName] = useState<string>('');
  const sliderRef = useRef<HTMLInputElement>(null);
  const [usedSpectrumIds, setUsedSpectrumIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter spectrums by intensity (<=) and not already used
    let filtered = wavelengthRounds.filter((s, idx) => s.intensity <= intensity && !usedSpectrumIds.has(idx));

    // If all spectrums used, reset and use any available
    if (filtered.length === 0) {
      setUsedSpectrumIds(new Set());
      filtered = wavelengthRounds.filter(s => s.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = wavelengthRounds.findIndex(s => s === random);
    setSpectrum(random);
    setUsedSpectrumIds(prev => new Set(prev).add(randomIdx));
    setClueGiverPlacement(null);
    setGuesses(new Map());
    setRevealed(false);
    setPhase('clue');
  }, [intensity]);

  const handleClueGiverPlace = (value: number) => {
    setClueGiverPlacement(value);
  };

  const handleClueGiverSubmit = () => {
    setClueGiverName(player?.name || 'Clue Giver');
    setPhase('guess');
  };

  const handleGuess = (value: number) => {
    if (phase !== 'guess' || revealed) return;
    const id = player?.id || 'anonymous';
    setGuesses(new Map(guesses.set(id, value)));
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    nextRound();
  };

  if (!spectrum) return null;

  const allGuessed = players.length > 0 ? guesses.size === players.length : guesses.size > 0;

  // Clue giving phase
  if (phase === 'clue') {
    return (
      <GameLayout
        round={currentRound}
        gameMode="wavelength"
      >
        <GameCard>
          <h2 className="text-2xl font-bold text-center mb-4 text-slate-300">
            {spectrum.leftLabel}
            <span className="mx-4 text-slate-500">↔</span>
            {spectrum.rightLabel}
          </h2>

          <div className="bg-slate-800 rounded-xl p-8 mb-8">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-400 mb-2">Ready to give your clue?</p>
              <p className="text-2xl font-bold">(Look away, group!)</p>
            </div>

            <div className="relative pt-8">
              <input
                ref={sliderRef}
                type="range"
                min="0"
                max="100"
                value={clueGiverPlacement ?? 50}
                onChange={(e) => handleClueGiverPlace(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="text-center mt-8 mb-6">
              <div className="text-4xl font-bold text-pink-400">
                {clueGiverPlacement ?? 50}%
              </div>
              <p className="text-xs text-slate-400 mt-2">
                (Toward: {clueGiverPlacement! > 50 ? spectrum.rightLabel : spectrum.leftLabel})
              </p>
            </div>
          </div>

          <Button onClick={handleClueGiverSubmit} variant="primary" size="lg" className="w-full">
            My Placement Set → Pass Phone
          </Button>
        </GameCard>
      </GameLayout>
    );
  }

  // Group guessing phase
  if (phase === 'guess' && !revealed) {
    return (
      <GameLayout
        round={currentRound}
        gameMode="wavelength"
      >
        <GameCard>
          <h2 className="text-2xl font-bold text-center mb-4 text-slate-300">
            {spectrum.leftLabel}
            <span className="mx-4 text-slate-500">↔</span>
            {spectrum.rightLabel}
          </h2>

          <div className="bg-slate-800 rounded-xl p-8 mb-8">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-400 mb-2">{clueGiverName} placed it at:</p>
              <p className="text-sm text-slate-500">(Clue was one word, shouted aloud)</p>
            </div>

            <div className="relative pt-8">
              <input
                type="range"
                min="0"
                max="100"
                value={guesses.get(player?.id || 'anonymous') ?? 50}
                onChange={(e) => handleGuess(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="text-center mt-8 mb-6">
              <div className="text-4xl font-bold text-blue-400">
                {guesses.get(player?.id || 'anonymous') ?? 50}%
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Your guess
              </p>
            </div>
          </div>

          {guesses.has(player?.id || 'anonymous') && (
            <Button
              onClick={handleReveal}
              variant={allGuessed ? 'primary' : 'secondary'}
              size="lg"
              className="w-full"
            >
              {allGuessed ? 'Reveal' : 'Skip (Others Still Guessing)'}
            </Button>
          )}
        </GameCard>
      </GameLayout>
    );
  }

  // Reveal phase
  return (
    <GameLayout
      round={currentRound}
      gameMode="wavelength"
    >
      <GameCard>
        <h2 className="text-2xl font-bold text-center mb-4 text-slate-300">
          {spectrum.leftLabel}
          <span className="mx-4 text-slate-500">↔</span>
          {spectrum.rightLabel}
        </h2>

        <div className="bg-slate-800 rounded-xl p-8 mb-8">
          <div className="relative pt-8 pb-12">
            <input
              type="range"
              min="0"
              max="100"
              disabled
              value={clueGiverPlacement ?? 50}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-default accent-pink-500"
            />
            <div className="absolute top-0 left-0 right-0 flex justify-between pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-slate-600"
                  style={{
                    left: `${i * 25}%`,
                    position: 'absolute',
                    transform: 'translateX(-50%)',
                  }}
                />
              ))}
            </div>

            {/* Target placement indicator */}
            <div
              className="absolute -top-12 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-pink-500"
              style={{
                left: `calc(${clueGiverPlacement}% - 8px)`,
              }}
            />

            {/* All guesses */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-end" style={{ height: '40px' }}>
              {players.map((p) => {
                const guess = guesses.get(p.id) ?? 50;
                return (
                  <div
                    key={p.id}
                    className="flex-1 flex flex-col items-center"
                    style={{
                      position: 'relative',
                      left: `${guess}%`,
                    }}
                  >
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-blue-400" />
                    <p className="text-xs text-slate-400 mt-8 whitespace-nowrap">{p.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-20 pt-8 space-y-4">
            <div className="flex justify-between items-center bg-slate-700 px-6 py-3 rounded-lg">
              <span className="text-sm font-medium">{clueGiverName} (Clue Giver)</span>
              <span className="text-pink-400 font-bold">{clueGiverPlacement}%</span>
            </div>

            {players.map((p) => {
              const guess = guesses.get(p.id) ?? null;
              if (guess === null) return null;

              const diff = Math.abs(guess - (clueGiverPlacement ?? 50));
              const score = Math.max(0, 100 - diff * 2);

              return (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-slate-700 px-6 py-3 rounded-lg"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <div className="text-right">
                    <span className="text-blue-400 font-bold">{guess}%</span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({diff > 0 ? '+' : ''}{diff} off) → {Math.round(score)} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
          Next Round
        </Button>
      </GameCard>
    </GameLayout>
  );
}
