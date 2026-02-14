import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameLayout, GameCard, Button } from '../components/GameCard';
import { hotTakesPrompts } from '../data/hot-takes';

export function HotTakes() {
  const { intensity, getCurrentPlayer, nextRound, currentRound } = useGame();
  const [hotTake, setHotTake] = useState<typeof hotTakesPrompts[0] | null>(null);
  const [votes, setVotes] = useState<Map<string, 'agree' | 'disagree'>>(new Map());
  const [revealed, setRevealed] = useState(false);
  const [usedHotTakeIds, setUsedHotTakeIds] = useState<Set<number>>(new Set());

  const player = getCurrentPlayer();

  useEffect(() => {
    // Filter hot takes by intensity (<=) and not already used
    let filtered = hotTakesPrompts.filter((h, idx) => h.intensity <= intensity && !usedHotTakeIds.has(idx));

    // If all hot takes used, reset and use any available
    if (filtered.length === 0) {
      setUsedHotTakeIds(new Set());
      filtered = hotTakesPrompts.filter(h => h.intensity <= intensity);
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    const randomIdx = hotTakesPrompts.findIndex(h => h === random);
    setHotTake(random);
    setUsedHotTakeIds(prev => new Set(prev).add(randomIdx));
    setVotes(new Map());
    setRevealed(false);
  }, [intensity]);

  const handleVote = (choice: 'agree' | 'disagree') => {
    if (!player || revealed) return;
    setVotes(new Map(votes.set(player.id, choice)));
    setRevealed(true);
  };

  const handleNext = () => {
    nextRound();
  };

  if (!player || !hotTake) return null;

  const agreeVotes = Array.from(votes.values()).filter(v => v === 'agree').length;
  const disagreeVotes = Array.from(votes.values()).filter(v => v === 'disagree').length;
  const totalVotes = agreeVotes + disagreeVotes;
  const agreePercent = totalVotes > 0 ? Math.round((agreeVotes / totalVotes) * 100) : 50;
  const disagreePercent = 100 - agreePercent;

  return (
    <GameLayout
      round={currentRound}
      playerName={player.name}
      gameMode="hot-takes"
    >
      <GameCard>
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full text-lg font-bold mb-4">
            🔥 Hot Take
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 leading-relaxed">
          {hotTake.opinion}
        </h2>

        {!revealed ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleVote('agree')}
              className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl font-bold p-8 rounded-2xl transition-all shadow-lg min-h-[150px] flex items-center justify-center"
            >
              ✓ Agree
            </button>
            <button
              onClick={() => handleVote('disagree')}
              className="bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-2xl font-bold p-8 rounded-2xl transition-all shadow-lg min-h-[150px] flex items-center justify-center"
            >
              ✗ Disagree
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-green-400">✓ Agree</span>
                  <span className="text-3xl font-bold text-green-400">{agreePercent}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all duration-500"
                    style={{ width: `${agreePercent}%` }}
                  />
                </div>
                <div className="text-center text-sm text-slate-400 mt-1">
                  {agreeVotes} vote{agreeVotes !== 1 ? 's' : ''}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-red-400">✗ Disagree</span>
                  <span className="text-3xl font-bold text-red-400">{disagreePercent}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-rose-600 h-full transition-all duration-500"
                    style={{ width: `${disagreePercent}%` }}
                  />
                </div>
                <div className="text-center text-sm text-slate-400 mt-1">
                  {disagreeVotes} vote{disagreeVotes !== 1 ? 's' : ''}
                </div>
              </div>
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
