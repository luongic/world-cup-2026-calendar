import type { Match } from '../types';

interface KnockoutBadgeProps {
  stage: string;
  color: string;
  matches: Match[];
}

export default function KnockoutBadge({ stage, color, matches }: KnockoutBadgeProps) {
  let title = 'ROUND OF';
  let subtitle = '32';

  if (stage === 'Round of 32') {
    title = 'ROUND OF';
    subtitle = '32';
  } else if (stage === 'Round of 16') {
    title = 'ROUND OF';
    subtitle = '16';
  } else if (stage === 'Quarter-final') {
    title = 'QUARTER';
    subtitle = 'FINALS';
  } else if (stage === 'Semi-final') {
    title = 'SEMI';
    subtitle = 'FINALS';
  } else if (stage === 'Third Place' || stage === 'Play-off for third place') {
    title = 'THIRD';
    subtitle = 'PLACE';
  } else if (stage === 'Final') {
    title = 'THE';
    subtitle = 'FINAL';
  }

  const tooltipText = matches
    .map((m) => `${m.stage}${m.venue && m.venue !== 'TBD' ? ` - ${m.venue}` : ''}${m.time && m.time !== 'TBD' ? ` @ ${m.time}` : ''}`)
    .join('\n');

  return (
    <div className="flex flex-col items-center justify-center flex-1 py-1" title={tooltipText}>
      <div
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center text-center p-1 sm:p-1.5 border sm:border-2 transition-all duration-300 relative overflow-hidden group/badge cursor-pointer select-none"
        style={{
          borderColor: color,
          background: `${color}10`,
        }}
      >
        {/* Holographic shimmer effect on hover */}
        <div
          className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 ease-out"
        />

        <span className="hidden sm:inline text-[5px] font-condensed tracking-[0.2em] font-black text-white/40 leading-none uppercase">
          FIFA 2026
        </span>
        <span className="text-[6px] sm:text-[7px] font-black font-condensed tracking-wide text-white leading-tight mt-0.5">
          {title}
        </span>
        <span
          className="text-[10px] sm:text-[13px] font-black font-display leading-none tracking-tight"
          style={{ color }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}
