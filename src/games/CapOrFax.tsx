import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { capOrFaxPrompts } from '../data/cap-or-fax';
import { hapticSuccess } from '../utils/haptics';

type VoteState = {
  playerId: string;
  vote: 'cap' | 'fax';
};

export function CapOrFax() {
  const { intensity, getCurrentPlayer, players, updatePlayerScore, nextRound, currentRound } = useGame();
  const [phase, setPhase] = useState<'instruction' | 'telling' | 'voting' | 'reveal'>('instruction');
  const [instruction, setInstruction] = useState<'cap' | 'fax' | null>(null);
  const [prompt, setPrompt] = useState<typeof capOrFaxPrompts[0] | null>(null);
  const [votes, setVotes] = useState<VoteState[]>([]);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

  const currentPlayer = getCurrentPlayer();
  const otherPlayers = players.filter(p => p.id !== currentPlayer?.id);

  const startRound = () => {
    // Randomly assign cap or fax
    const isCapOrFax = Math.random() < 0.5 ? 'cap' : 'fax';
    setInstruction(isCapOrFax);

    // Filter prompts by intensity and not already used
    let filtered = capOrFaxPrompts.filter((p, idx) => p.intensity <= intensity && !usedPromptIds.has(idx));

    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = capOrFaxPrompts.filter(p => p.intensity <= intensity);
    }

    // Pick random prompt
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = capOrFaxPrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));

    setPhase('instruction');
  };

  const handleDoneTelling = () => {
    setPhase('voting');
    setVotes([]);
  };

  const handleVote = (playerId: string, vote: 'cap' | 'fax') => {
    setVotes(prev => {
      const existing = prev.find(v => v.playerId === playerId);
      if (existing) {
        return prev.map(v => v.playerId === playerId ? { playerId, vote } : v);
      }
      return [...prev, { playerId, vote }];
    });
  };

  const handleReveal = () => {
    // Award points to players who guessed correctly
    votes.forEach(({ playerId, vote }) => {
      if (vote === instruction) {
        updatePlayerScore(playerId, 1);
      }
    });
    hapticSuccess();
    setPhase('reveal');
  };

  const handleNext = () => {
    setPhase('instruction');
    setInstruction(null);
    setPrompt(null);
    setVotes([]);
    nextRound();
  };

  // Initial start
  if (!instruction && phase === 'instruction') {
    startRound();
  }

  if (!currentPlayer || !prompt || !instruction) return null;

  return (
    <GameLayout
      round={currentRound}
      playerName={currentPlayer.name}
      gameMode="cap-or-fax"
    >
      {phase === 'instruction' && (
        <GameCard>
          <div className="text-center mb-8">
            <div className={`inline-block px-8 py-4 rounded-2xl text-3xl font-bold mb-6 ${
              instruction === 'cap' ? 'bg-orange-600' : 'bg-blue-600'
            }`}>
              {instruction === 'cap' ? '🧢 CAP' : '📠 FAX'}
            </div>
            <p className="text-xl mb-2">
              {instruction === 'cap' ? 'Make it up!' : 'Tell the truth!'}
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl mb-8">
            <p className="text-2xl md:text-3xl text-center leading-relaxed">
              {prompt.text}
            </p>
            {prompt.type === 'list' && instruction === 'cap' && (
              <p className="text-sm text-slate-400 text-center mt-4">
                (Slip in 1 fake answer)
              </p>
            )}
          </div>

          <Button onClick={handleDoneTelling} variant="primary" size="lg" className="w-full">
            Done Telling
          </Button>
        </GameCard>
      )}

      {phase === 'telling' && (
        <GameCard>
          <h2 className="text-3xl font-bold text-center mb-6">
            {currentPlayer.name} is telling their story...
          </h2>
          <p className="text-xl text-center text-slate-400 mb-8">
            Listen carefully!
          </p>
          <Button onClick={handleDoneTelling} variant="primary" size="lg" className="w-full">
            Ready to Vote
          </Button>
        </GameCard>
      )}

      {phase === 'voting' && (
        <GameCard>
          <h2 className="text-3xl font-bold text-center mb-6">
            Was it Cap or Fax?
          </h2>
          <p className="text-lg text-center text-slate-400 mb-8">
            Everyone votes!
          </p>

          <div className="space-y-4 mb-8">
            {otherPlayers.map(player => {
              const vote = votes.find(v => v.playerId === player.id);
              return (
                <div key={player.id} className="bg-slate-700 p-4 rounded-lg">
                  <p className="text-lg font-semibold mb-3">{player.name}</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleVote(player.id, 'cap')}
                      variant={vote?.vote === 'cap' ? 'danger' : 'secondary'}
                      size="sm"
                      className="flex-1"
                    >
                      🧢 Cap
                    </Button>
                    <Button
                      onClick={() => handleVote(player.id, 'fax')}
                      variant={vote?.vote === 'fax' ? 'primary' : 'secondary'}
                      size="sm"
                      className="flex-1"
                    >
                      📠 Fax
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {votes.length === otherPlayers.length && (
            <Button onClick={handleReveal} variant="success" size="lg" className="w-full">
              Reveal Answer
            </Button>
          )}
        </GameCard>
      )}

      {phase === 'reveal' && (
        <GameCard>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              It was...
            </h2>
            <div className={`inline-block px-8 py-4 rounded-2xl text-4xl font-bold ${
              instruction === 'cap' ? 'bg-orange-600' : 'bg-blue-600'
            }`}>
              {instruction === 'cap' ? '🧢 CAP!' : '📠 FAX!'}
            </div>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-semibold mb-4">Results:</h3>
            <div className="space-y-2">
              {otherPlayers.map(player => {
                const vote = votes.find(v => v.playerId === player.id);
                const correct = vote?.vote === instruction;
                return (
                  <div key={player.id} className="flex justify-between items-center">
                    <span>{player.name}</span>
                    <span className={`font-semibold ${correct ? 'text-green-400' : 'text-red-400'}`}>
                      {vote?.vote === 'cap' ? '🧢' : '📠'} {correct ? '+1' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
            Next Round
          </Button>
        </GameCard>
      )}
    </GameLayout>
  );
}
