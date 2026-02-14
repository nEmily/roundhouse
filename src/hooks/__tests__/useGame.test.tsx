import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from '../useGame';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

describe('useGame - Player Management', () => {
  it('adds players to the game', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
    });

    expect(result.current.players).toHaveLength(2);
    expect(result.current.players[0].name).toBe('Alice');
    expect(result.current.players[1].name).toBe('Bob');
    expect(result.current.players[0].score).toBe(0);
  });

  it('trims whitespace when adding players', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('  Charlie  ');
    });

    expect(result.current.players[0].name).toBe('Charlie');
  });

  it('removes players by ID', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
      result.current.addPlayer('Charlie');
    });

    const bobId = result.current.players[1].id;

    act(() => {
      result.current.removePlayer(bobId);
    });

    expect(result.current.players).toHaveLength(2);
    expect(result.current.players.map(p => p.name)).toEqual(['Alice', 'Charlie']);
  });

  it('updates player scores', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
    });

    const playerId = result.current.players[0].id;

    act(() => {
      result.current.updatePlayerScore(playerId, 10);
    });

    expect(result.current.players[0].score).toBe(10);

    act(() => {
      result.current.updatePlayerScore(playerId, -5);
    });

    expect(result.current.players[0].score).toBe(5);
  });
});

describe('useGame - Game Flow', () => {
  it('starts a game', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
    });

    act(() => {
      result.current.startGame();
    });

    expect(result.current.screen).toBe('round-intro');
    expect(result.current.currentRound).toBe(1);
    expect(result.current.intensity).toBe(1);
    expect(result.current.currentPlayerIndex).toBe(0);
  });

  it('advances to next round and auto-escalates intensity', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.startGame();
    });

    expect(result.current.currentRound).toBe(1);
    expect(result.current.intensity).toBe(1);

    // Move to round 6 (medium intensity: rounds 6-12)
    act(() => {
      for (let i = 0; i < 5; i++) result.current.nextRound();
    });

    expect(result.current.currentRound).toBe(6);
    expect(result.current.intensity).toBe(2);

    // Move to round 13 (wild intensity: round 13+)
    act(() => {
      for (let i = 0; i < 7; i++) result.current.nextRound();
    });

    expect(result.current.currentRound).toBe(13);
    expect(result.current.intensity).toBe(3);
  });

  it('ends game via endGame and goes to game-over', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.startGame();
    });

    act(() => {
      result.current.endGame();
    });

    expect(result.current.screen).toBe('game-over');
  });

  it('keeps same game mode on nextRound', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
      result.current.startGame();
      result.current.selectGameMode('trivia');
    });

    act(() => {
      result.current.nextRound();
    });

    expect(result.current.currentGameMode).toBe('trivia');
    expect(result.current.screen).toBe('pass-phone');
  });

  it('selects game mode and adds to history', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.startGame();
    });

    act(() => {
      result.current.selectGameMode('trivia');
    });

    expect(result.current.currentGameMode).toBe('trivia');
    expect(result.current.roundHistory).toContain('trivia');

    act(() => {
      result.current.selectGameMode('hot-seat');
    });

    expect(result.current.currentGameMode).toBe('hot-seat');
    expect(result.current.roundHistory).toEqual(['trivia', 'hot-seat']);
  });

  it('selects random game mode when not specified', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.startGame();
    });

    act(() => {
      result.current.selectGameMode();
    });

    expect(result.current.currentGameMode).not.toBeNull();
    expect([
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
      'slevens'
    ]).toContain(
      result.current.currentGameMode
    );
  });

  it('resets game to initial state', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.startGame();
      result.current.selectGameMode('trivia');
      result.current.nextRound();
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.screen).toBe('welcome');
    expect(result.current.players).toHaveLength(0);
    expect(result.current.currentRound).toBe(0);
    expect(result.current.currentGameMode).toBeNull();
    expect(result.current.roundHistory).toHaveLength(0);
  });
});

describe('useGame - Player Navigation', () => {
  it('cycles through players', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
      result.current.addPlayer('Charlie');
    });

    expect(result.current.currentPlayerIndex).toBe(0);

    act(() => {
      result.current.nextPlayer();
    });

    expect(result.current.currentPlayerIndex).toBe(1);

    act(() => {
      result.current.nextPlayer();
    });

    expect(result.current.currentPlayerIndex).toBe(2);

    act(() => {
      result.current.nextPlayer();
    });

    expect(result.current.currentPlayerIndex).toBe(0); // Wraps around
  });

  it('getCurrentPlayer returns current player', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
    });

    expect(result.current.getCurrentPlayer()?.name).toBe('Alice');

    act(() => {
      result.current.nextPlayer();
    });

    expect(result.current.getCurrentPlayer()?.name).toBe('Bob');
  });

  it('getCurrentPlayer returns null when no players', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    expect(result.current.getCurrentPlayer()).toBeNull();
  });
});

describe('useGame - Random Player Selection', () => {
  it('getRandomPlayer returns a player', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
      result.current.addPlayer('Charlie');
    });

    const randomPlayer = result.current.getRandomPlayer();
    expect(randomPlayer).not.toBeNull();
    expect(['Alice', 'Bob', 'Charlie']).toContain(randomPlayer?.name);
  });

  it('getRandomPlayer excludes current player when requested', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
    });

    // Current player is Alice (index 0)
    const randomPlayer = result.current.getRandomPlayer(true);
    expect(randomPlayer?.name).toBe('Bob');
  });

  it('getRandomPlayer returns null when no players', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    expect(result.current.getRandomPlayer()).toBeNull();
  });

  it('getRandomPair returns two different players', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    act(() => {
      result.current.addPlayer('Alice');
      result.current.addPlayer('Bob');
      result.current.addPlayer('Charlie');
    });

    const pair = result.current.getRandomPair();
    expect(pair).not.toBeNull();
    expect(pair).toHaveLength(2);
    expect(pair![0].id).not.toBe(pair![1].id);
  });

  it('getRandomPair returns null when less than 2 players', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    expect(result.current.getRandomPair()).toBeNull();

    act(() => {
      result.current.addPlayer('Alice');
    });

    expect(result.current.getRandomPair()).toBeNull();
  });
});

describe('useGame - Game Mode Variety', () => {
  it('avoids repeating recently played modes', () => {
    const { result } = renderHook(() => useGame(), { wrapper });

    // Mock Math.random to control selection
    const randomSpy = vi.spyOn(Math, 'random');

    act(() => {
      result.current.addPlayer('Alice');
      result.current.startGame();
    });

    // Play trivia 3 times in a row
    randomSpy.mockReturnValue(0.3); // Should select trivia initially
    act(() => {
      result.current.selectGameMode('trivia');
      result.current.selectGameMode('trivia');
      result.current.selectGameMode('trivia');
    });

    expect(result.current.roundHistory).toEqual(['trivia', 'trivia', 'trivia']);

    // Next selection should heavily favor non-trivia modes
    // We can't guarantee it won't be trivia (it's still possible), but weight is reduced
    const modesSelected: string[] = [];
    for (let i = 0; i < 20; i++) {
      randomSpy.mockReturnValue(Math.random());
      act(() => {
        result.current.selectGameMode();
      });
      modesSelected.push(result.current.currentGameMode!);
    }

    // At least some variety should exist in 20 selections after 3 trivias
    const uniqueModes = new Set(modesSelected);
    expect(uniqueModes.size).toBeGreaterThan(1);

    randomSpy.mockRestore();
  });
});
