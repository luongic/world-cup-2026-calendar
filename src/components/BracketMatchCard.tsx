import type { Match, MatchData } from '../types';

interface BracketMatchCardProps {
  match: Match;
  data: MatchData;
  // isHighlighted: boolean;
  // onHoverStart: () => void;
  // onHoverEnd: () => void;
}

function flagEmojiToCountryCode(emoji: string): string {
  if (!emoji) return '';
  if (emoji.includes('🏴󠁧󠁢󠁳󠁣󠁴󠁿')) return 'gb-sct';
  if (emoji.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) return 'gb-eng';

  const codePoints = Array.from(emoji).map((c) => c.codePointAt(0));
  const chars = codePoints
    .filter((cp) => cp !== undefined && cp >= 0x1f1e6 && cp <= 0x1f1ff)
    .map((cp) => String.fromCharCode(cp! - 0x1f1e6 + 65));
  return chars.join('').toLowerCase();
}

function formatTeamName(name: string): string {
  if (!name) return 'TBD';
  if (name.startsWith('W') && !isNaN(Number(name.slice(1)))) {
    return `Winner Match ${name.slice(1)}`;
  }
  if (name.startsWith('RU') && !isNaN(Number(name.slice(2)))) {
    return `Runner-up Match ${name.slice(2)}`;
  }
  return name;
}

export default function BracketMatchCard({
  match,
  data,
  // isHighlighted,
  // onHoverStart,
  // onHoverEnd,
}: BracketMatchCardProps) {
  const isHomePlaceholder =
    match.home === 'TBD' ||
    match.home.startsWith('W') ||
    match.home.startsWith('RU');
  const isAwayPlaceholder =
    match.away === 'TBD' ||
    match.away.startsWith('W') ||
    match.away.startsWith('RU');

  const homeFlag = data.flags[match.home] ?? '';
  const awayFlag = data.flags[match.away] ?? '';
  const homeCC = flagEmojiToCountryCode(homeFlag);
  const awayCC = flagEmojiToCountryCode(awayFlag);

  // Date and Time formatting (DD/MM - HH:MM) for the tooltip
  const dateParts = match.date.split('-');
  const formattedDate =
    dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : match.date;
  const formattedTime = match.time ? match.time.split(' ')[0] : 'TBD';
  const dateTimeStr = `${formattedDate} ${formattedTime}`;

  // Highlight styling
  const cardStyle = {
    borderColor: 'rgba(255, 255, 255, 0.18)',
    padding: 'var(--bracket-card-padding)',
    width: 'var(--bracket-card-width)',
    height: 'var(--bracket-card-height)',
  };

  const tooltipText = `${formatTeamName(match.home)} vs ${formatTeamName(match.away)}\nTime: ${dateTimeStr}\nVenue: ${match.venue}\nStage: ${match.stage} (Match ${match.id})`;

  return (
    <div
      // onMouseEnter={onHoverStart}
      // onMouseLeave={onHoverEnd}
      style={cardStyle}
      title={tooltipText}
      className={`bg-[#111111] border rounded-[10px] flex flex-col justify-between items-center transition-all duration-200 select-none cursor-pointer shadow-[4px_4px_8px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(255,255,255,0.015)] hover:translate-y-[-1px]`}
    >
      {/* Home Flag Slot */}
      <div
        style={{ width: 'var(--bracket-flag-width)', height: 'var(--bracket-flag-height)' }}
        className="relative flex-shrink-0"
      >
        {isHomePlaceholder ? (
          <div className="w-full h-full rounded-tl-[8px] rounded-br-[8px] bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/70 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
            ?
          </div>
        ) : (
          <div className="w-full h-full relative overflow-hidden rounded-tl-[8px] rounded-br-[8px] border border-black/30 flex items-center justify-center">
            {homeCC && (
              <img
                src={`https://flagcdn.com/w40/${homeCC}.png`}
                alt={match.home}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
                className="w-full h-full object-cover"
              />
            )}
            <span className={`${homeCC ? 'hidden' : ''} text-[10px] sm:text-xs leading-none`}>
              {homeFlag}
            </span>
          </div>
        )}
        {match.homeScore !== undefined && (
          <span className="absolute right-[-4px] bottom-[-2px] text-[8px] font-bold text-white bg-black/85 px-0.5 rounded shadow-sm border border-white/10 scale-90">
            {match.homeScore}
          </span>
        )}
      </div>

      {/* Away Flag Slot */}
      <div
        style={{ width: 'var(--bracket-flag-width)', height: 'var(--bracket-flag-height)' }}
        className="relative flex-shrink-0"
      >
        {isAwayPlaceholder ? (
          <div className="w-full h-full rounded-tl-[8px] rounded-br-[8px] bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/70 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
            ?
          </div>
        ) : (
          <div className="w-full h-full relative overflow-hidden rounded-tl-[8px] rounded-br-[8px] border border-black/30 flex items-center justify-center">
            {awayCC && (
              <img
                src={`https://flagcdn.com/w40/${awayCC}.png`}
                alt={match.away}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove('hidden');
                }}
                className="w-full h-full object-cover"
              />
            )}
            <span className={`${awayCC ? 'hidden' : ''} text-[10px] sm:text-xs leading-none`}>
              {awayFlag}
            </span>
          </div>
        )}
        {match.awayScore !== undefined && (
          <span className="absolute right-[-4px] bottom-[-2px] text-[8px] font-bold text-white bg-black/85 px-0.5 rounded shadow-sm border border-white/10 scale-90">
            {match.awayScore}
          </span>
        )}
      </div>
    </div>
  );
}
