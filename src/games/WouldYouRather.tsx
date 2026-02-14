import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { wouldYouRatherPrompts } from '../data/would-you-rather';

export function WouldYouRather() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [prompt, setPrompt] = useState<typeof wouldYouRatherPrompts[0] | null>(null);
  const [votes, setVotes] = useState<Map<string, 'A' | 'B'>>(new Map());
  const [revealed, setRevealed] = useState(false);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter prompts by intensity (<=) and not already used
    let filtered = wouldYouRatherPrompts.filter((p, idx) => p.intensity <= intensity && !usedPromptIds.has(idx));

    // If all prompts used, reset and use any available
    if (filtered.length === 0) {
      setUsedPromptIds(new Set());
      filtered = wouldYouRatherPrompts.filter(p => p.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = wouldYouRatherPrompts.findIndex(p => p === random);
    setPrompt(random);
    setUsedPromptIds(prev => new Set(prev).add(randomIdx));
    setVotes(new Map());
    setRevealed(false);
  }, [intensity]);

  const handleVote = (choice: 'A' | 'B') => {
    if (!player || revealed) return;
    setVotes(new Map(votes.set(player.id, choice)));
    setRevealed(true);
  };

  const handleNext = () => {
    nextRound();
  };

  if (!player || !prompt) return null;

  const votesA = Array.from(votes.values()).filter(v => v === 'A').length;
  const votesB = Array.from(votes.values()).filter(v => v === 'B').length;
  const totalVotes = votesA + votesB;
  const percentA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const percentB = 100 - percentA;

  return (
    <GameLayout
      round={currentRound}
      playerName={player.name}
      gameMode="would-you-rather"
    >
      <GameCard>
        <h2 className="text-3xl font-bold text-center mb-8">
          Would You Rather...
        </h2>

        {!revealed ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleVote('A')}
              className="bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-xl font-bold p-8 rounded-2xl transition-all shadow-lg min-h-[200px] flex items-center justify-center text-center"
            >
              {prompt.optionA}
            </button>
            <button
              onClick={() => handleVote('B')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xl font-bold p-8 rounded-2xl transition-all shadow-lg min-h-[200px] flex items-center justify-center text-center"
            >
              {prompt.optionB}
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium">{prompt.optionA}</span>
                  <span className="text-2xl font-bold text-pink-400">{percentA}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-pink-600 h-full transition-all duration-500"
                    style={{ width: `${percentA}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium">{prompt.optionB}</span>
                  <span className="text-2xl font-bold text-purple-400">{percentB}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-500"
                    style={{ width: `${percentB}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center text-slate-400 mb-6">
              {votesA} vote{votesA !== 1 ? 's' : ''} vs {votesB} vote{votesB !== 1 ? 's' : ''}
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
