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

const GAME_INFO: Record<GameMode, { emoji: string; description: string; color: string }> = {
  'truth-or-dare':    { emoji: '🤫', description: 'Pick truth or dare — answer honestly or complete a challenge.', color: 'rgba(167,139,250,0.15)' },
  'hot-seat':         { emoji: '🔥', description: 'One player in the spotlight. Group votes on "most likely to" questions.', color: 'rgba(240,96,64,0.15)' },
  'trivia':           { emoji: '🧠', description: 'Quick-fire questions. Wrong answer = drink.', color: 'rgba(56,189,248,0.15)' },
  'would-you-rather': { emoji: '🤔', description: 'Spicy hypotheticals. Debate it out — minority drinks.', color: 'rgba(245,166,35,0.15)' },
  'challenges':       { emoji: '💪', description: 'Physical dares, social missions, creative tasks. Complete it or drink.', color: 'rgba(240,96,64,0.15)' },
  'hot-takes':        { emoji: '🌶️', description: 'Controversial opinions. Vote agree or disagree — minority drinks.', color: 'rgba(240,96,64,0.15)' },
  'wildcard':         { emoji: '🃏', description: 'Weird, chaotic, one-off prompts that defy categorization.', color: 'rgba(251,191,36,0.15)' },
  'wavelength':       { emoji: '📡', description: 'Rate something on a spectrum. Try to match the group — closest wins.', color: 'rgba(56,189,248,0.15)' },
  'herd-mentality':   { emoji: '🐑', description: 'Everyone shouts an answer. Match the majority or drink.', color: 'rgba(245,166,35,0.15)' },
  'cap-or-fax':       { emoji: '🧢', description: 'One player tells a story. Cap or fax? Everyone votes.', color: 'rgba(167,139,250,0.15)' },
  'kings-cup':        { emoji: '👑', description: 'Draw cards, follow the rules. Classic drinking card game.', color: 'rgba(251,191,36,0.15)' },
  'ride-the-bus':     { emoji: '🚌', description: 'Guess the card — higher/lower, red/black, in/out. Wrong = drink.', color: 'rgba(56,189,248,0.15)' },
  'slevens':          { emoji: '⚡', description: 'Roll dice — hit 7, 11, or doubles and race your opponent. Loser drinks.', color: 'rgba(62,207,122,0.15)' },
};

// Player avatar colors — warm, vibrant, distinct
const PLAYER_COLORS = [
  '#f5a623', '#f06040', '#3ecf7a', '#38bdf8', '#a78bfa',
  '#fbbf24', '#fb7185', '#34d399', '#60a5fa', '#c084fc',
];

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

  useWakeLock();

  // ── Welcome screen ──────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <div
        className="min-h-dvh flex items-center justify-center p-6 safe-area-padding animate-fade-in"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {/* Ambient glow behind logo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 35%, rgba(245,140,20,0.14) 0%, transparent 60%)',
          }}
        />

        <div className="text-center max-w-sm w-full relative z-10">
          {/* Logo */}
          <div className="mb-2">
            <span
              className="text-8xl font-black leading-none block"
              style={{
                background: 'linear-gradient(150deg, #fde68a 0%, #f5a623 40%, #e07a10 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 4px 12px rgba(245,140,20,0.4))',
              }}
            >
              Roundhouse
            </span>
          </div>

          <p
            className="text-base font-semibold mb-14 tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            one phone · endless chaos
          </p>

          <button
            onClick={() => setScreen('setup')}
            className="btn btn-primary btn-lg w-full"
            style={{ fontSize: '1.5rem', padding: '1.2rem', borderRadius: '1.25rem' }}
          >
            Let's Go 🎉
          </button>

          <p
            className="mt-5 text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Pass-and-play · No installs · Works offline
          </p>
        </div>
      </div>
    );
  }

  // ── Setup screen ────────────────────────────────────────────
  if (screen === 'setup') {
    return (
      <div
        className="min-h-dvh px-5 pt-4 pb-10 safe-area-padding animate-fade-in"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setScreen('welcome')}
            className="mb-5 flex items-center gap-1.5 text-sm font-bold transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back
          </button>

          <h2
            className="text-4xl font-black mb-1 text-center"
            style={{ color: 'var(--text-primary)' }}
          >
            Who's Playing?
          </h2>
          <p
            className="text-center text-sm font-semibold mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            Add names or skip — just pass the phone in a circle
          </p>

          {/* Add player form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem('playerName') as HTMLInputElement;
              if (input.value.trim()) {
                addPlayer(input.value.trim());
                input.value = '';
              }
            }}
            className="mb-6"
          >
            <input
              type="text"
              name="playerName"
              placeholder="Enter a name..."
              className="warm-input mb-3"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
            />
            <button
              type="submit"
              className="btn btn-secondary btn-md w-full"
              style={{ borderRadius: '0.875rem' }}
            >
              + Add Player
            </button>
          </form>

          {/* Player list */}
          {players.length > 0 && (
            <div className="space-y-2 mb-8">
              {players.map((player, idx) => (
                <div key={player.id} className="player-chip">
                  {/* Colored avatar dot */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{
                      backgroundColor: PLAYER_COLORS[idx % PLAYER_COLORS.length] + '25',
                      color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
                      border: `1.5px solid ${PLAYER_COLORS[idx % PLAYER_COLORS.length]}40`,
                    }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className="flex-1 text-base font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {player.name}
                  </span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-sm font-bold transition-colors px-2 py-1 rounded-lg"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => startGame()}
            className="btn btn-primary w-full"
            style={{ fontSize: '1.4rem', padding: '1.1rem', borderRadius: '1.25rem' }}
          >
            {players.length > 0
              ? `Start Game  (${players.length} players)`
              : 'Start Game'}
          </button>
        </div>
      </div>
    );
  }

  const availableModes = ALL_GAME_MODES;

  // ── Round intro ─────────────────────────────────────────────
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

    const intensityLabel = intensity === 1 ? 'Chill' : intensity === 2 ? 'Medium' : 'Wild';
    const intensityClass = `intensity-${intensity}`;

    return (
      <div
        className="min-h-dvh px-5 pt-4 pb-8 safe-area-padding animate-fade-in"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2
              className="text-3xl font-black mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Pick a Game
            </h2>
            <div className={`intensity-badge ${intensityClass}`}>
              {intensity === 1 ? '●' : intensity === 2 ? '●●' : '●●●'} {intensityLabel}
            </div>
          </div>

          {/* Random button */}
          <button
            onClick={() => handleConfirm()}
            className="btn btn-primary w-full mb-4"
            style={{ fontSize: '1.35rem', padding: '1.1rem', borderRadius: '1.25rem' }}
          >
            🎲  Random Game
          </button>

          {/* Selected game info panel */}
          {selectedMode && selected && (
            <div
              className="rounded-2xl p-5 mb-4 animate-fade-in"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-mid)',
              }}
            >
              <div className="flex items-start justify-between mb-2 gap-3">
                <h3
                  className="text-xl font-black leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {selected.emoji} {GAME_NAMES[selectedMode]}
                </h3>
                <button
                  onClick={() => setSelectedMode(null)}
                  className="text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>
              <p
                className="text-sm font-semibold mb-4 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {selected.description}
              </p>
              <button
                onClick={() => handleConfirm(selectedMode)}
                className="btn btn-success w-full"
                style={{ fontSize: '1.2rem', padding: '0.9rem', borderRadius: '1rem' }}
              >
                Play {GAME_NAMES[selectedMode]}!
              </button>
            </div>
          )}

          {/* Game grid */}
          <div
            className="grid grid-cols-2 gap-2 scroll-fade overflow-y-auto"
            style={{ maxHeight: '55vh' }}
          >
            {availableModes.map(mode => {
              const info = GAME_INFO[mode];
              const isSelected = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className="text-left rounded-xl px-3.5 py-3 transition-all font-bold text-sm"
                  style={{
                    backgroundColor: isSelected
                      ? 'var(--bg-elevated)'
                      : 'var(--bg-card)',
                    border: isSelected
                      ? '1.5px solid rgba(245,166,35,0.5)'
                      : '1px solid var(--border-subtle)',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected ? '0 4px 16px rgba(245,140,20,0.2)' : 'none',
                  }}
                >
                  <div className="text-lg mb-0.5">{info.emoji}</div>
                  <div className="leading-tight">{GAME_NAMES[mode]}</div>
                </button>
              );
            })}
          </div>

          {/* End game */}
          {currentRound > 1 && players.length > 0 && (
            <button
              onClick={() => endGame()}
              className="btn btn-secondary w-full mt-4"
              style={{ fontSize: '0.95rem', padding: '0.7rem', borderRadius: '0.875rem' }}
            >
              End Game & See Scores
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Pass-phone screen ───────────────────────────────────────
  if (screen === 'pass-phone') {
    const nextPlayer = getCurrentPlayer();
    return (
      <div
        className="min-h-dvh flex items-center justify-center p-6 safe-area-padding animate-slide-up"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(245,166,35,0.08) 0%, transparent 65%)',
          }}
        />
        <div className="text-center max-w-sm w-full relative z-10">
          <div className="text-6xl mb-5 animate-bounce-in">📱</div>

          <p
            className="text-xl font-bold mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Pass the phone to
          </p>

          <div
            className="text-5xl font-black mb-10 animate-glow leading-tight"
            style={{
              background: 'linear-gradient(135deg, #f5a623 0%, #ff7b4a 50%, #f5a623 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {nextPlayer?.name || 'Next Player'}!
          </div>

          <button
            onClick={() => setScreen('game')}
            className="btn btn-success btn-lg w-full"
            style={{ fontSize: '1.5rem', padding: '1.2rem', borderRadius: '1.25rem' }}
          >
            I'm Ready
          </button>
        </div>
      </div>
    );
  }

  // ── Game screen ─────────────────────────────────────────────
  if (screen === 'game') {
    const gameComponent = (() => {
      switch (currentGameMode) {
        case 'truth-or-dare':    return <TruthOrDare />;
        case 'hot-seat':         return <HotSeat />;
        case 'trivia':           return <Trivia />;
        case 'would-you-rather': return <WouldYouRather />;
        case 'challenges':       return <Challenges />;
        case 'hot-takes':        return <HotTakes />;
        case 'wildcard':         return <Wildcard />;
        case 'wavelength':       return <Wavelength />;
        case 'herd-mentality':   return <HerdMentality />;
        case 'cap-or-fax':       return <CapOrFax />;
        case 'kings-cup':        return <KingsCup />;
        case 'ride-the-bus':     return <RideTheBus />;
        case 'slevens':          return <Slevens />;
        default:                 return null;
      }
    })();

    return (
      <div className="relative">
        {/* Quit button — fixed top-right */}
        <button
          onClick={switchGame}
          className="fixed right-4 z-50 font-bold text-sm px-3.5 py-2 rounded-full transition-all"
          style={{
            top: 'max(1rem, calc(env(safe-area-inset-top) + 0.5rem))',
            backgroundColor: 'rgba(39, 24, 16, 0.85)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          ✕ Quit
        </button>
        {gameComponent}
      </div>
    );
  }

  // ── Game over ───────────────────────────────────────────────
  if (screen === 'game-over') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <div
        className="min-h-dvh flex items-center justify-center p-6 safe-area-padding animate-fade-in"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.1) 0%, transparent 60%)',
          }}
        />

        <div className="text-center max-w-sm w-full relative z-10">
          <div className="text-6xl mb-3 animate-bounce-in">🏆</div>
          <h2
            className="text-4xl font-black mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            Game Over!
          </h2>

          <div
            className="rounded-2xl p-6 mb-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h3
              className="text-base font-black uppercase tracking-widest mb-5"
              style={{ color: 'var(--text-muted)' }}
            >
              Final Scores
            </h3>
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center py-2 px-3 rounded-xl"
                  style={{
                    backgroundColor: index === 0 && winner.score > 0
                      ? 'rgba(245,166,35,0.1)'
                      : 'transparent',
                    border: index === 0 && winner.score > 0
                      ? '1px solid rgba(245,166,35,0.25)'
                      : '1px solid transparent',
                  }}
                >
                  <span
                    className="font-bold text-base"
                    style={{ color: index === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {index === 0 && winner.score > 0 ? '🏆 ' : ''}{player.name}
                  </span>
                  <span
                    className="text-xl font-black"
                    style={{ color: 'var(--amber-bright)' }}
                  >
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setScreen('welcome')}
            className="btn btn-primary w-full"
            style={{ fontSize: '1.4rem', padding: '1.1rem', borderRadius: '1.25rem' }}
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
