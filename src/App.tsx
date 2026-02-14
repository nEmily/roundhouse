import './App.css'
import { useState } from 'react'
import { useGame } from './hooks/useGame'
import { useWakeLock } from './hooks/useWakeLock'
import type { GameMode } from './types'
import { TruthOrDare } from './games/TruthOrDare'
import { HotSeat } from './games/HotSeat'
import { Trivia } from './games/Trivia'
import { WouldYouRather } from './games/WouldYouRather'
import { Challenges } from './games/Challenges'
import { HotTakes } from './games/HotTakes'
import { Wildcard } from './games/Wildcard'
import { Wavelength } from './games/Wavelength'
import { HerdMentality } from './games/HerdMentality'
import { CapOrFax } from './games/CapOrFax'
import { KingsCup } from './games/KingsCup'
import { RideTheBus } from './games/RideTheBus'
import { Slevens } from './games/Slevens'
import { GAME_NAMES } from './components/GameCard'

const ALL_GAME_MODES: GameMode[] = [
  'truth-or-dare',
  'hot-seat',
  'trivia',
  'would-you-rather',
  'challenges',
  'hot-takes',
  'wildcard',
  'wavelength',
  'herd-mentality',
  'cap-or-fax',
  'kings-cup',
  'ride-the-bus',
  'slevens',
];


const GAME_INFO: Record<GameMode, { emoji: string; description: string }> = {
  'truth-or-dare': { emoji: '🤫', description: 'Pick truth or dare — answer honestly or complete a challenge.' },
  'hot-seat': { emoji: '🔥', description: 'One player in the spotlight. Group votes on "most likely to" and "who would" questions.' },
  'trivia': { emoji: '🧠', description: 'Quick-fire questions. Wrong answer = drink.' },
  'would-you-rather': { emoji: '🤔', description: 'Spicy hypotheticals. Debate it out — minority drinks.' },
  'challenges': { emoji: '💪', description: 'Physical dares, social missions, and creative tasks. Complete it or drink.' },
  'hot-takes': { emoji: '🌶️', description: 'Controversial opinions. Vote agree or disagree — minority drinks.' },
  'wildcard': { emoji: '🃏', description: 'Weird, chaotic, one-off prompts that defy categorization.' },
  'wavelength': { emoji: '📡', description: 'Rate something on a spectrum. Try to match the group — closest wins.' },
  'herd-mentality': { emoji: '🐑', description: 'Everyone shouts an answer. Match the majority or drink.' },
  'cap-or-fax': { emoji: '🧢', description: 'One player tells a story. Was it real (fax) or made up (cap)? Everyone votes.' },
  'kings-cup': { emoji: '👑', description: 'Draw cards, follow the rules. Classic drinking card game.' },
  'ride-the-bus': { emoji: '🚌', description: 'Guess the card — higher/lower, red/black, in/out. Wrong = drink.' },
  'slevens': { emoji: '⚡', description: 'Roll dice — hit 7, 11, or doubles and race your opponent. Loser drinks.' },
};

function App() {
  const {
    screen,
    players,
    currentRound,
    intensity,
    currentGameMode,
    addPlayer,
    removePlayer,
    startGame,
    getCurrentPlayer,
    selectGameMode,
    switchGame,
    endGame,
    setScreen,
  } = useGame();

  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  // Keep screen awake during gameplay
  useWakeLock();

  // Welcome screen
  if (screen === 'welcome') {
    return (
      <div className="min-h-dvh bg-slate-900 text-slate-50 flex items-center justify-center p-8 safe-area-padding animate-fade-in">
        <div className="text-center max-w-2xl w-full">
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Roundhouse
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            One-phone party game for groups
          </p>
          <button
            onClick={() => setScreen('setup')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-2xl px-14 py-5 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg active:scale-95"
          >
            Let's Go
          </button>
        </div>
      </div>
    );
  }

  // Setup screen - add players + round count
  if (screen === 'setup') {
    return (
      <div className="min-h-dvh bg-slate-900 text-slate-50 px-6 pt-8 pb-12 safe-area-padding animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setScreen('welcome')}
            className="text-slate-400 hover:text-white text-lg mb-6 active:scale-95 transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-4xl font-bold mb-3 text-center">Who's Playing?</h2>
          <p className="text-slate-400 text-center mb-10">Add names or skip — just pass the phone in a circle</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('playerName') as HTMLInputElement;
              if (input.value.trim()) {
                addPlayer(input.value);
                input.value = '';
              }
            }}
            className="mb-8"
          >
            <input
              type="text"
              name="playerName"
              placeholder="Enter name"
              className="w-full bg-slate-800 text-white text-xl px-6 py-4 rounded-xl border-2 border-slate-700 focus:border-pink-500 focus:outline-none mb-3"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold text-xl px-6 py-4 rounded-xl transition-colors active:scale-95"
            >
              + Add Player
            </button>
          </form>

          {players.length > 0 && (
            <div className="space-y-3 mb-10">
              {players.map(player => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-slate-800 px-6 py-4 rounded-xl"
                >
                  <span className="text-xl font-medium">{player.name}</span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-red-400 hover:text-red-300 font-bold text-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => startGame()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-2xl px-12 py-5 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg active:scale-95"
          >
            {players.length > 0 ? `Start Game (${players.length} players)` : 'Start Game'}
          </button>
        </div>
      </div>
    );
  }

  const availableModes = ALL_GAME_MODES;

  // Round intro - pick a game
  if (screen === 'round-intro') {
    const handleConfirm = (mode?: GameMode) => {
      setSelectedMode(null);
      selectGameMode(mode, availableModes);
      if (players.length > 0) {
        setScreen('pass-phone');
      } else {
        setScreen('game');
      }
    };

    const selected = selectedMode ? GAME_INFO[selectedMode] : null;

    return (
      <div className="min-h-dvh bg-slate-900 text-slate-50 px-6 pt-10 pb-8 safe-area-padding animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-3">Pick a Game</div>
            <div className="inline-block bg-slate-800 px-5 py-2 rounded-full text-base">
              {intensity === 1 ? '🟢 Chill' : intensity === 2 ? '🟡 Medium' : '🔴 Wild'}
            </div>
          </div>

          <button
            onClick={() => handleConfirm()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-2xl px-12 py-5 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg active:scale-95 mb-4"
          >
            🎲 Random Game
          </button>

          {/* Game description dropdown */}
          {selectedMode && selected && (
            <div className="bg-slate-800 rounded-2xl p-5 mb-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{selected.emoji} {GAME_NAMES[selectedMode]}</h3>
                <button
                  onClick={() => setSelectedMode(null)}
                  className="text-slate-500 hover:text-white text-lg px-2"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-300 mb-4">{selected.description}</p>
              <button
                onClick={() => handleConfirm(selectedMode)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all active:scale-95"
              >
                Play {GAME_NAMES[selectedMode]}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 scroll-fade max-h-[55vh] overflow-y-auto">
            {availableModes.map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`${
                  selectedMode === mode ? 'bg-pink-600 ring-2 ring-pink-400' : 'bg-slate-800 hover:bg-slate-700'
                } text-white text-sm font-medium px-4 py-3 rounded-xl transition-all active:scale-95`}
              >
                {GAME_INFO[mode].emoji} {GAME_NAMES[mode]}
              </button>
            ))}
          </div>

          {/* End Game button — only show when tracking scores */}
          {currentRound > 1 && players.length > 0 && (
            <button
              onClick={() => endGame()}
              className="w-full mt-4 bg-slate-800 text-slate-400 hover:text-white font-medium text-base py-3 rounded-xl transition-all active:scale-95"
            >
              End Game & See Scores
            </button>
          )}
        </div>
      </div>
    );
  }

  // Pass-phone screen - prevents seeing next player's content
  if (screen === 'pass-phone') {
    const nextPlayer = getCurrentPlayer();

    return (
      <div className="min-h-dvh bg-slate-900 text-slate-50 flex items-center justify-center p-6 safe-area-padding animate-fade-in">
        <div className="text-center max-w-2xl w-full">
          <div className="text-5xl mb-6">📱</div>
          <div className="text-4xl font-bold mb-8">
            Pass the phone to
          </div>
          <div className="text-6xl font-bold mb-12 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-glow">
            {nextPlayer?.name}!
          </div>
          <button
            onClick={() => setScreen('game')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-3xl px-16 py-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg active:scale-95"
          >
            Ready
          </button>
        </div>
      </div>
    );
  }

  // Game screen - actual gameplay
  if (screen === 'game') {
    const gameComponent = (() => {
      switch (currentGameMode) {
        case 'truth-or-dare': return <TruthOrDare />;
        case 'hot-seat': return <HotSeat />;
        case 'trivia': return <Trivia />;
        case 'would-you-rather': return <WouldYouRather />;
        case 'challenges': return <Challenges />;
        case 'hot-takes': return <HotTakes />;
        case 'wildcard': return <Wildcard />;
        case 'wavelength': return <Wavelength />;
        case 'herd-mentality': return <HerdMentality />;
        case 'cap-or-fax': return <CapOrFax />;
        case 'kings-cup': return <KingsCup />;
        case 'ride-the-bus': return <RideTheBus />;
        case 'slevens': return <Slevens />;
        default: return null;
      }
    })();

    return (
      <div className="relative">
        {/* Quit / Switch Game button */}
        <button
          onClick={switchGame}
          className="fixed right-4 z-50 bg-slate-800/90 backdrop-blur text-slate-400 hover:text-white text-sm font-medium px-4 py-2 rounded-full transition-all active:scale-95"
          style={{ top: 'max(1rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
        >
          ✕ Quit
        </button>
        {gameComponent}
      </div>
    );
  }

  // Game over screen
  if (screen === 'game-over') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
      <div className="min-h-dvh bg-slate-900 text-slate-50 flex items-center justify-center p-8 safe-area-padding animate-fade-in">
        <div className="text-center max-w-2xl w-full">
          <h2 className="text-5xl font-bold mb-10">Game Over!</h2>
          <div className="bg-slate-800 p-8 rounded-2xl mb-10">
            <h3 className="text-2xl font-bold mb-6">Final Scores</h3>
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="flex justify-between items-center">
                  <span className="text-xl">
                    {index === 0 && sortedPlayers[0].score > 0 && '🏆 '}
                    {player.name}
                  </span>
                  <span className="text-2xl font-bold text-pink-400">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setScreen('welcome')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-2xl px-14 py-5 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg active:scale-95"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App
