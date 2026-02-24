import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { truthOrDarePrompts } from '../data/truth-or-dare';

export function TruthOrDare() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [choice, setChoice] = useState<'truth' | 'dare' | null>(null);
  const [prompt, setPrompt] = useState<typeof truthOrDarePrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

  const player = getCurrentPlayer();

  const handleChoice = (type: 'truth' | 'dare') => {
    setChoice(type);

    let filtered = truthOrDarePrompts.filter(
      (p, idx) => p.intensity <= intensity && p.type === type && !usedPromptIds.has(idx)
    );

    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = truthOrDarePrompts.filter(
        p => p.intensity <= intensity && p.type === type
      );
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = truthOrDarePrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
  };

  const handleNext = () => {
    setChoice(null);
    setPrompt(null);
    nextTurn();
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  if (showingPass) {
    return (
      <PassPhoneScreen
        playerName={player?.name}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  return (
    <GameLayout
      round={currentRound}
      playerName={player?.name}
      gameMode="truth-or-dare"
    >
      {!choice ? (
        <GameCard>
          <h2
            className="text-3xl font-black text-center mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Choose Wisely...
          </h2>
          <p
            className="text-center text-sm font-semibold mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            {player?.name ? `${player.name}, pick one` : 'Pick one'}
          </p>
          <div className="flex flex-col gap-4">
            {/* Truth — violet */}
            <button
              onClick={() => handleChoice('truth')}
              className="btn w-full"
              style={{
                fontSize: '1.5rem',
                padding: '1.2rem',
                borderRadius: '1.1rem',
                background: 'linear-gradient(160deg, #a78bfa 0%, #7c3aed 100%)',
                color: '#f5f3ff',
                boxShadow: '0 4px 16px rgba(124,58,237,0.35), 0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              💬 Truth
            </button>
            {/* Dare — coral */}
            <button
              onClick={() => handleChoice('dare')}
              className="btn w-full"
              style={{
                fontSize: '1.5rem',
                padding: '1.2rem',
                borderRadius: '1.1rem',
                background: 'linear-gradient(160deg, #f06040 0%, #c73e22 100%)',
                color: '#fff5f2',
                boxShadow: '0 4px 16px rgba(240,96,64,0.35), 0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              🔥 Dare
            </button>
          </div>
        </GameCard>
      ) : (
        <GameCard>
          {/* Choice badge */}
          <div className="text-center mb-5">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black"
              style={choice === 'truth' ? {
                backgroundColor: 'rgba(167,139,250,0.18)',
                color: '#a78bfa',
                border: '1.5px solid rgba(167,139,250,0.35)',
              } : {
                backgroundColor: 'rgba(240,96,64,0.18)',
                color: '#f06040',
                border: '1.5px solid rgba(240,96,64,0.35)',
              }}
            >
              {choice === 'truth' ? '💬 Truth' : '🔥 Dare'}
            </div>
          </div>

          <p
            className="text-2xl font-black text-center mb-8 leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {prompt?.text}
          </p>

          <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
            Next →
          </Button>
        </GameCard>
      )}
    </GameLayout>
  );
}
