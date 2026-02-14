# Game Engine - useGame Hook

The core game engine for Roundhouse, managing all game state and flow.

## Usage

```tsx
import { useGame } from './hooks/useGame';

function MyComponent() {
  const {
    players,
    currentRound,
    addPlayer,
    startGame
  } = useGame();

  // Use game state and methods
}
```

## Features

### 1. Player Management
- `addPlayer(name: string)` - Add a new player to the game
- `removePlayer(playerId: string)` - Remove a player
- `updatePlayerScore(playerId: string, delta: number)` - Update player score
- `players: Player[]` - Current player list

### 2. Game Flow
- `startGame(totalRounds?: number)` - Start a new game (default 10 rounds)
- `nextRound()` - Advance to next round (auto-escalates intensity)
- `selectGameMode(mode?: GameMode)` - Pick game mode (auto if not specified)
- `nextPlayer()` - Rotate to next player
- `endGame()` - End the game early
- `resetGame()` - Full reset to welcome screen

### 3. Screen Navigation
- `setScreen(screen: GameScreen)` - Navigate between screens
- `screen: GameScreen` - Current screen (welcome, setup, round-intro, game, pass-phone, game-over)

### 4. Helper Methods
- `getCurrentPlayer()` - Get the current active player
- `getRandomPlayer(excludeCurrent?: boolean)` - Get a random player
- `getRandomPair()` - Get two random players for pair challenges

### 5. Intensity Escalation
Intensity automatically increases based on game progress:
- **Level 1 (Chill)** - First third of game (rounds 1-3 of 10)
- **Level 2 (Medium)** - Middle third (rounds 4-6 of 10)
- **Level 3 (Wild)** - Final third (rounds 7-10 of 10)

### 6. Game Mode Selection
Uses weighted random selection that favors variety:
- Tracks last 3 game modes played
- Reduces weight for recently played modes
- Prevents repetitive gameplay

## State Structure

```typescript
interface GameState {
  screen: GameScreen;              // Current screen
  players: Player[];               // All players
  currentPlayerIndex: number;      // Who's turn it is
  currentRound: number;            // Current round (1-indexed)
  totalRounds: number;             // Total rounds in game
  currentGameMode: GameMode | null; // Active game mode
  intensity: IntensityLevel;       // 1, 2, or 3
  roundHistory: GameMode[];        // History for variety tracking
}
```

## Example Flow

```tsx
// 1. Setup players
addPlayer('Alice');
addPlayer('Bob');
addPlayer('Charlie');

// 2. Start game
startGame(10); // 10 rounds

// 3. Each round:
selectGameMode(); // Picks random mode
// ... play the game mode ...
nextRound(); // Advance

// 4. Game ends automatically after totalRounds
// Or manually: endGame()
```

## Integration with Game Modes

Game mode components should:
1. Read `currentGameMode`, `intensity`, `getCurrentPlayer()`
2. Display appropriate content based on intensity level
3. Call `nextRound()` when round is complete
4. Optionally use `updatePlayerScore()` for scoring

Example:
```tsx
function TruthOrDareMode() {
  const { intensity, getCurrentPlayer, nextRound } = useGame();
  const player = getCurrentPlayer();
  const prompt = getPromptForIntensity(intensity);

  return (
    <div>
      <h2>{player?.name}, truth or dare?</h2>
      <p>{prompt.text}</p>
      <button onClick={nextRound}>Next Round</button>
    </div>
  );
}
```
