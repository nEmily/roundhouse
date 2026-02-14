import type { ReactNode } from 'react';

export const GAME_NAMES: Record<string, string> = {
  'truth-or-dare': 'Truth or Dare',
  'hot-seat': 'Hot Seat',
  'trivia': 'Trivia',
  'would-you-rather': 'Would You Rather',
  'challenges': 'Challenges',
  'hot-takes': 'Hot Takes',
  'wildcard': 'Wildcard',
  'wavelength': 'Wavelength',
  'herd-mentality': 'Herd Mentality',
  'cap-or-fax': 'Cap or Fax',
  'kings-cup': 'Kings Cup',
  'liars-dice': 'Liars Dice',
  'ride-the-bus': 'Ride the Bus',
  'slevens': 'Slevens',
};

interface GameCardProps {
  children: ReactNode;
  className?: string;
}

export function GameCard({ children, className = '' }: GameCardProps) {
  return (
    <div className={`bg-slate-800 rounded-3xl p-8 shadow-xl ${className}`}>
      {children}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white',
  };

  const sizeClasses = {
    sm: 'text-lg px-6 py-3',
    md: 'text-xl px-8 py-4',
    lg: 'text-2xl px-12 py-5',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

interface GameLayoutProps {
  children: ReactNode;
  round?: number;
  playerName?: string;
  gameMode?: string;
}

export function GameLayout({ children, round, playerName, gameMode }: GameLayoutProps) {
  return (
    <div className="min-h-dvh bg-slate-900 text-slate-50 p-6 flex flex-col animate-fade-in safe-area-padding">
      {/* Header — right-padded to avoid Quit button overlap */}
      {(round || playerName || gameMode) && (
        <div className="text-center mb-4 pr-16">
          {round && (
            <div className="text-sm text-slate-500 mb-1">
              Round {round}
            </div>
          )}
          {gameMode && (
            <div className="text-2xl font-bold mb-1">
              {GAME_NAMES[gameMode] || gameMode.replaceAll('-', ' ')}
            </div>
          )}
          {playerName && (
            <div className="text-lg text-pink-400">
              {playerName}'s turn
            </div>
          )}
        </div>
      )}

      {/* Content — biased upward, not true-centered */}
      <div className="flex-1 flex items-start justify-center pt-[5vh]">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
