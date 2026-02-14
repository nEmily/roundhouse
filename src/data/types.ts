export interface Prompt {
  id: string;
  text: string;
  intensity: 1 | 2 | 3;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: string;
  intensity: 1 | 2 | 3;
}

export interface WouldYouRather {
  id: string;
  optionA: string;
  optionB: string;
  intensity: 1 | 2 | 3;
}

export interface HotTake {
  id: string;
  opinion: string;
  intensity: 1 | 2 | 3;
}

export interface Challenge {
  id: string;
  challenge: string;
  intensity: 1 | 2 | 3;
  timeLimit?: number;
}

export interface Wildcard {
  id: string;
  prompt: string;
  intensity: 1 | 2 | 3;
}

export interface SpectrumRound {
  id: string;
  leftLabel: string;
  rightLabel: string;
  intensity: 1 | 2 | 3;
}
