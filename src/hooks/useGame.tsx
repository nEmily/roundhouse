import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { GameState, Player, GameMode, IntensityLevel } from '../types';

interface GameContextType extends GameState {
  // Player management
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerScore: (playerId: string, delta: number) => void;

  // Game flow
  startGame: () => void;
  nextRound: () => void;
  switchGame: () => void;
  selectGameMode: (mode?: GameMode, enabledModes?: GameMode[]) => void;
  nextPlayer: () => void;
  endGame: () => void;
  resetGame: () => void;

  // Screen navigation
  setScreen: (screen: GameState['screen']) => void;

  // Helper getters
  getCurrentPlayer: () => Player | null;
  getRandomPlayer: (excludeCurrent?: boolean) => Player | null;
  getRandomPair: () => [Player, Player] | null;
}

const GameContext = createContext<GameContextType | null>(null);

const GAME_MODES: GameMode[] = [
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
  'liars-dice',
  'ride-the-bus',
  'slevens',
];

// Weighted selection favoring variety - less likely to repeat recent modes
function selectNextGameMode(history: GameMode[], enabledModes?: GameMode[]): GameMode {
  const availableModes = enabledModes && enabledModes.length > 0 ? enabledModes : GAME_MODES;
  const recentModes = history.slice(-3); // last 3 rounds

  // Build weights - reduce weight for recently played modes
  const weights = availableModes.map(mode => {
    const timesInRecent = recentModes.filter(m => m === mode).length;
    return Math.max(1, 10 - timesInRecent * 3); // reduce weight by 3 per recent appearance
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < availableModes.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return availableModes[i];
    }
  }

  return availableModes[0]; // fallback
}

// Auto-escalate intensity based on total rounds played
function calculateIntensity(currentRound: number): IntensityLevel {
  if (currentRound <= 5) return 1;  // Rounds 1-5: chill
  if (currentRound <= 12) return 2; // Rounds 6-12: medium
  return 3;                         // Round 13+: wild
}

const initialState: GameState = {
  screen: 'welcome',
  players: [],
  currentPlayerIndex: 0,
  currentRound: 0,
  currentGameMode: null,
  intensity: 1,
  roundHistory: [],
};

// Map screens to their logical "back" target
const SCREEN_BACK_MAP: Partial<Record<GameState['screen'], GameState['screen']>> = {
  'setup': 'welcome',
  'round-intro': 'welcome',
  'pass-phone': 'round-intro',
  'game': 'round-intro',
  'game-over': 'welcome',
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const handlingPopState = useRef(false);

  // Browser back button support
  useEffect(() => {
    const handlePopState = () => {
      handlingPopState.current = true;
      setState(prev => {
        const backScreen = SCREEN_BACK_MAP[prev.screen];
        if (backScreen) {
          // If going back to welcome, reset everything
          if (backScreen === 'welcome') {
            return { ...initialState, players: prev.players };
          }
          return { ...prev, screen: backScreen };
        }
        return prev;
      });
      // Reset flag after state update
      setTimeout(() => { handlingPopState.current = false; }, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Player management
  const addPlayer = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: name.trim(),
          score: 0,
        },
      ],
    }));
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId),
    }));
  }, []);

  const updatePlayerScore = useCallback((playerId: string, delta: number) => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.id === playerId ? { ...p, score: p.score + delta } : p
      ),
    }));
  }, []);

  // Game flow
  const startGame = useCallback(() => {
    if (!handlingPopState.current) {
      history.pushState({ screen: 'round-intro' }, '', '');
    }
    setState(prev => ({
      ...prev,
      screen: 'round-intro',
      currentRound: 1,
      currentPlayerIndex: 0,
      intensity: 1,
      roundHistory: [],
      currentGameMode: null,
    }));
  }, []);

  const selectGameMode = useCallback((mode?: GameMode, enabledModes?: GameMode[]) => {
    setState(prev => {
      const selectedMode = mode || selectNextGameMode(prev.roundHistory, enabledModes);
      return {
        ...prev,
        currentGameMode: selectedMode,
        roundHistory: [...prev.roundHistory, selectedMode],
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    if (!handlingPopState.current) {
      history.pushState({ screen: 'pass-phone' }, '', '');
    }
    setState(prev => {
      const nextRoundNum = prev.currentRound + 1;
      return {
        ...prev,
        currentRound: nextRoundNum,
        currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
        intensity: calculateIntensity(nextRoundNum),
        screen: 'pass-phone',
      };
    });
  }, []);

  const switchGame = useCallback(() => {
    if (!handlingPopState.current) {
      history.pushState({ screen: 'round-intro' }, '', '');
    }
    setState(prev => ({
      ...prev,
      screen: 'round-intro',
      currentGameMode: null,
    }));
  }, []);

  const nextPlayer = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
    }));
  }, []);

  const endGame = useCallback(() => {
    if (!handlingPopState.current) {
      history.pushState({ screen: 'game-over' }, '', '');
    }
    setState(prev => ({
      ...prev,
      screen: 'game-over',
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      ...initialState,
      players: [], // Clear players on full reset
    });
  }, []);

  const setScreen = useCallback((screen: GameState['screen']) => {
    if (!handlingPopState.current) {
      history.pushState({ screen }, '', '');
    }
    setState(prev => ({ ...prev, screen }));
  }, []);

  // Helper getters
  const getCurrentPlayer = useCallback((): Player | null => {
    return state.players[state.currentPlayerIndex] || null;
  }, [state.players, state.currentPlayerIndex]);

  const getRandomPlayer = useCallback((excludeCurrent: boolean = false): Player | null => {
    if (state.players.length === 0) return null;

    let availablePlayers = state.players;
    if (excludeCurrent && state.players.length > 1) {
      availablePlayers = state.players.filter((_, idx) => idx !== state.currentPlayerIndex);
    }

    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    return availablePlayers[randomIndex];
  }, [state.players, state.currentPlayerIndex]);

  const getRandomPair = useCallback((): [Player, Player] | null => {
    if (state.players.length < 2) return null;

    const shuffled = [...state.players].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }, [state.players]);

  const contextValue: GameContextType = {
    ...state,
    addPlayer,
    removePlayer,
    updatePlayerScore,
    startGame,
    nextRound,
    switchGame,
    selectGameMode,
    nextPlayer,
    endGame,
    resetGame,
    setScreen,
    getCurrentPlayer,
    getRandomPlayer,
    getRandomPair,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
