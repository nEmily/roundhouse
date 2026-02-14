export type IntensityLevel = 1 | 2 | 3;

export type GameMode =
  | 'truth-or-dare'
  | 'hot-seat'
  | 'trivia'
  | 'would-you-rather'
  | 'challenges'
  | 'hot-takes'
  | 'wildcard'
  | 'wavelength'
  | 'herd-mentality'
  | 'cap-or-fax'
  | 'kings-cup'
  | 'liars-dice'
  | 'ride-the-bus'
  | 'slevens';

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Prompt {
  id: string;
  text: string;
  intensity: IntensityLevel;
}

export interface TruthOrDarePrompt extends Prompt {
  type: 'truth' | 'dare';
}

export interface TriviaQuestion extends Prompt {
  question: string;
  answer: string;
  options: string[];
  category: string;
}

export interface WouldYouRatherPrompt extends Prompt {
  optionA: string;
  optionB: string;
}

export interface HotTakePrompt extends Prompt {
  opinion: string;
}

export interface ChallengePrompt extends Prompt {
  timeLimit?: number; // seconds
}

export interface SpectrumPrompt extends Prompt {
  leftLabel: string;
  rightLabel: string;
  target?: number; // 0-100, optional target value for scoring
}

export interface HerdMentalityPrompt extends Prompt {
  // Uses text field from Prompt base interface
}

export interface CapOrFaxPrompt extends Prompt {
  type: 'story' | 'list';
}

export interface KingsCupCard {
  value: string; // "A", "2", "3", ..., "K"
  name: string;
  rule: string;
  explanation: string;
  intensity: IntensityLevel;
}

export interface LiarsDicePrompt extends Prompt {
  // Minimal prompt for dice game instructions
}

export interface RideTheBusPrompt extends Prompt {
  question: string;
  type: 'higher-lower' | 'red-black' | 'in-out' | 'suit';
}

export interface SlevensPrompt extends Prompt {
  // Minimal prompt for Slevens card game instructions
}

export type GameScreen = 'welcome' | 'setup' | 'round-intro' | 'game' | 'pass-phone' | 'game-over';

export interface GameState {
  screen: GameScreen;
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  currentGameMode: GameMode | null;
  intensity: IntensityLevel;
  roundHistory: GameMode[];
}
