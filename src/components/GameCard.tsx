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
  'ride-the-bus': 'Ride the Bus',
  'slevens': 'Slevens',
};

// Per-game accent colors for the header pill
const GAME_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'truth-or-dare':  { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  'hot-seat':       { bg: 'rgba(240, 96, 64, 0.15)',   text: '#f06040', border: 'rgba(240,96,64,0.3)' },
  'trivia':         { bg: 'rgba(56, 189, 248, 0.15)',   text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  'would-you-rather': { bg: 'rgba(245, 166, 35, 0.15)', text: '#f5a623', border: 'rgba(245,166,35,0.3)' },
  'challenges':     { bg: 'rgba(240, 96, 64, 0.15)',   text: '#f06040', border: 'rgba(240,96,64,0.3)' },
  'hot-takes':      { bg: 'rgba(240, 96, 64, 0.15)',   text: '#f06040', border: 'rgba(240,96,64,0.3)' },
  'wildcard':       { bg: 'rgba(251, 191, 36, 0.15)',   text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  'wavelength':     { bg: 'rgba(56, 189, 248, 0.15)',   text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  'herd-mentality': { bg: 'rgba(245, 166, 35, 0.15)',   text: '#f5a623', border: 'rgba(245,166,35,0.3)' },
  'cap-or-fax':     { bg: 'rgba(167, 139, 250, 0.15)', text: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  'kings-cup':      { bg: 'rgba(251, 191, 36, 0.15)',   text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  'ride-the-bus':   { bg: 'rgba(56, 189, 248, 0.15)',   text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  'slevens':        { bg: 'rgba(62, 207, 122, 0.15)',   text: '#3ecf7a', border: 'rgba(62,207,122,0.3)' },
};

interface GameCardProps {
  children: ReactNode;
  className?: string;
}

export function GameCard({ children, className = '' }: GameCardProps) {
  return (
    <div className={`game-card ${className}`}>
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
  const variantClass = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    success:   'btn-success',
    danger:    'btn-danger',
  }[variant];

  const sizeClass = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
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
  const colors = gameMode ? GAME_COLORS[gameMode] : null;

  return (
    <div
      className="min-h-dvh text-warm-primary px-5 flex flex-col animate-fade-in safe-area-padding"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Header */}
      {(round || playerName || gameMode) && (
        <div className="text-center mb-5 pr-16 pt-1">
          {/* Game mode pill */}
          {gameMode && colors && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold mb-2"
              style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              {GAME_NAMES[gameMode] || gameMode.replaceAll('-', ' ')}
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            {round && (
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Round {round}
              </span>
            )}
            {round && playerName && (
              <span style={{ color: 'var(--border-mid)' }}>·</span>
            )}
            {playerName && (
              <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                {playerName}'s turn
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 flex items-start justify-center pt-[2vh]">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

// Shared PassPhone screen — extracted so games can use it
interface PassPhoneProps {
  playerName?: string;
  onReady: () => void;
}

export function PassPhoneScreen({ playerName, onReady }: PassPhoneProps) {
  return (
    <div
      className="min-h-dvh flex items-center justify-center p-6 safe-area-padding animate-slide-up"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(245,166,35,0.08) 0%, transparent 65%)',
        }}
      />
      <div className="text-center max-w-sm w-full relative z-10">
        {/* Big phone icon */}
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
          {playerName || 'Next Player'}!
        </div>

        <button
          onClick={onReady}
          className="btn btn-success btn-lg w-full text-2xl py-5"
          style={{ borderRadius: '1.25rem' }}
        >
          I'm Ready
        </button>
      </div>
    </div>
  );
}
