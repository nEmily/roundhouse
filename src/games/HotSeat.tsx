import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { hotSeatPrompts } from '../data/hot-seat';

export function HotSeat() {
  const { intensity, players, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [prompt, setPrompt] = useState<typeof hotSeatPrompts[0] | null>(null);
  const [votes, setVotes] = useState<Map<string, string>>(new Map());
  const [revealed, setRevealed] = useState(false);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter prompts by intensity (<=) and not already used
    let filtered = hotSeatPrompts.filter((p, idx) => p.intensity <= intensity && !usedPromptIds.has(idx));

    // If all prompts used, reset and use any available
    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = hotSeatPrompts.filter(p => p.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = hotSeatPrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
    setVotes(new Map());
    setRevealed(false);
  }, [intensity]);

  const handleVote = (votedPlayerId: string) => {
    if (!player || revealed) return;
    setVotes(new Map(votes.set(player.id, votedPlayerId)));
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    nextRound();
  };

  if (!player || !prompt) return null;

  // Count votes for each player
  const voteCounts = new Map<string, number>();
  players.forEach(p => voteCounts.set(p.id, 0));
  votes.forEach(votedId => {
    voteCounts.set(votedId, (voteCounts.get(votedId) || 0) + 1);
  });

  const hasVoted = votes.has(player.id);
  const allVoted = votes.size === players.length;

  return (
    <GameLayout
      round={currentRound}
      gameMode="hot-seat"
    >
      <GameCard>
        <h2 className="text-3xl font-bold text-center mb-8">
          {prompt.text}
        </h2>

        {!revealed ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {players.map(p => {
                const isSelected = votes.get(player.id) === p.id;
                return (
                  <Button
                    key={p.id}
                    onClick={() => handleVote(p.id)}
                    variant={isSelected ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full py-6"
                  >
                    {p.name}
                  </Button>
                );
              })}
            </div>

            <div className="text-center mb-4">
              <div className="text-sm text-slate-400">
                {votes.size} / {players.length} voted
              </div>
            </div>

            {hasVoted && (
              <Button
                onClick={handleReveal}
                variant={allVoted ? 'primary' : 'secondary'}
                size="lg"
                className="w-full"
              >
                {allVoted ? 'Reveal Results' : 'Reveal Early'}
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {players
                .map(p => ({ player: p, votes: voteCounts.get(p.id) || 0 }))
                .sort((a, b) => b.votes - a.votes)
                .map(({ player: p, votes: voteCount }) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center bg-slate-700 px-6 py-4 rounded-xl"
                  >
                    <span className="text-xl font-medium">
                      {voteCount > 0 && voteCounts.get(p.id) === Math.max(...Array.from(voteCounts.values())) && '👑 '}
                      {p.name}
                    </span>
                    <span className="text-2xl font-bold text-pink-400">
                      {voteCount} vote{voteCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
            </div>

            <Button onClick={handleNext} variant="primary" size="lg" className="w-full">
              Next Round
            </Button>
          </>
        )}
      </GameCard>
    </GameLayout>
  );
}
