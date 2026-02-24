import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button, PassPhoneScreen } from '../components/GameCard';
import { capOrFaxPrompts } from '../data/cap-or-fax';
import { hapticSuccess } from '../utils/haptics';

export function CapOrFax() {
  const { intensity, getCurrentPlayer, nextTurn, currentRound, players } = useGame();
  const [phase, setPhase] = useState<'instruction' | 'reveal'>('instruction');
  const [instruction, setInstruction] = useState<'cap' | 'fax' | null>(null);
  const [prompt, setPrompt] = useState<typeof capOrFaxPrompts[0] | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());
  const [showingPass, setShowingPass] = useState(false);

  const currentPlayer = getCurrentPlayer();

  const startRound = () => {
    const isCapOrFax = Math.random() < 0.5 ? 'cap' : 'fax';
    setInstruction(isCapOrFax);

    let filtered = capOrFaxPrompts.filter((p, idx) => p.intensity <= intensity && !usedPromptIds.has(idx));

    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = capOrFaxPrompts.filter(p => p.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = capOrFaxPrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
    setPhase('instruction');
  };

  const handleReveal = () => {
    hapticSuccess();
    setPhase('reveal');
  };

  const handleNext = () => {
    setPhase('instruction');
    setInstruction(null);
    setPrompt(null);
    nextTurn();
    if (players.length > 0) {
      setShowingPass(true);
    }
  };

  // Initial start
  if (!instruction && phase === 'instruction') {
    startRound();
  }

  if (!prompt || !instruction) return null;

  if (showingPass) {
    return (
      <PassPhoneScreen
        playerName={currentPlayer?.name}
        onReady={() => setShowingPass(false)}
      />
    );
  }

  const isCap = instruction === 'cap';

  return (
    <GameLayout
      round={currentRound}
      playerName={currentPlayer?.name}
      gameMode="cap-or-fax"
    >
      {phase === 'instruction' && (
        <GameCard>
          {/* Secret assignment */}
          <div className="text-center mb-6">
            <div
              className="inline-flex flex-col items-center px-8 py-5 rounded-2xl mb-4"
              style={isCap ? {
                background: 'linear-gradient(135deg, rgba(240,96,64,0.2), rgba(199,62,34,0.15))',
                border: '2px solid rgba(240,96,64,0.4)',
              } : {
                background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(14,165,233,0.15))',
                border: '2px solid rgba(56,189,248,0.4)',
              }}
            >
              <span className="text-4xl mb-1.5">{isCap ? '🧢' : '📠'}</span>
              <span
                className="text-3xl font-black"
                style={{ color: isCap ? '#f06040' : '#38bdf8' }}
              >
                {isCap ? 'CAP' : 'FAX'}
              </span>
            </div>
            <p
              className="text-lg font-black"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isCap ? 'Make it up!' : 'Tell the truth!'}
            </p>
          </div>

          {/* Prompt */}
          <div
            className="rounded-2xl p-5 mb-8"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-mid)',
            }}
          >
            <p
              className="text-xl font-black text-center leading-snug"
              style={{ color: 'var(--text-primary)' }}
            >
              {prompt.text}
            </p>
            {prompt.type === 'list' && isCap && (
              <p
                className="text-sm text-center mt-3"
                style={{ color: 'var(--text-muted)' }}
              >
                (Slip in 1 fake answer)
              </p>
            )}
          </div>

          <p
            className="text-center text-sm font-semibold mb-5"
            style={{ color: 'var(--text-muted)' }}
          >
            Tell your story, then let everyone guess!
          </p>

          <Button onClick={handleReveal} variant="primary" size="lg" className="w-full">
            Reveal Answer
          </Button>
        </GameCard>
      )}

      {phase === 'reveal' && (
        <GameCard>
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-black mb-5"
              style={{ color: 'var(--text-primary)' }}
            >
              It was...
            </h2>
            <div
              className="inline-flex flex-col items-center px-10 py-5 rounded-2xl animate-bounce-in"
              style={isCap ? {
                background: 'linear-gradient(135deg, rgba(240,96,64,0.25), rgba(199,62,34,0.2))',
                border: '2px solid rgba(240,96,64,0.5)',
              } : {
                background: 'linear-gradient(135deg, rgba(56,189,248,0.25), rgba(14,165,233,0.2))',
                border: '2px solid rgba(56,189,248,0.5)',
              }}
            >
              <span className="text-4xl mb-1">{isCap ? '🧢' : '📠'}</span>
              <span
                className="text-4xl font-black"
                style={{ color: isCap ? '#f06040' : '#38bdf8' }}
              >
                {isCap ? 'CAP!' : 'FAX!'}
              </span>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 text-center mb-8"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p
              className="text-base font-bold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isCap
                ? 'Anyone who believed it — drink up! 🍺'
                : 'Anyone who called cap — drink up! 🍺'}
            </p>
          </div>

          <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
            Next →
          </Button>
        </GameCard>
      )}
    </GameLayout>
  );
}
