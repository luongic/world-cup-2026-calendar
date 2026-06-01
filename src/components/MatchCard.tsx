import type { Match, MatchData } from '../types';

interface MatchCardProps {
  match: Match;
  data: MatchData;
  viewMode?: 'classic' | 'compact';
}

export const stageColors: Record<string, string> = {
  'Round of 32': '#CAFF00', // neon lime
  'Round of 16': '#00D4FF', // neon blue
  'Quarter-final': '#FF6B35', // orange
  'Semi-final': '#FF2D90', // pink
  'Third Place': '#A855F7', // purple
  'Play-off for third place': '#A855F7', // purple
  Final: '#FFD700', // gold
};

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

export default function MatchCard({ match, data, viewMode = 'classic' }: MatchCardProps) {
  const groupColor = match.group
    ? data.groups[match.group]?.color
    : (stageColors[match.stage] ?? '#888');
  const homeFlag = data.flags[match.home] ?? '🏳️';
  const awayFlag = data.flags[match.away] ?? '🏳️';
  const isKnockout = match.stage !== 'Group Stage' && match.stage !== 'First Stage';
  const isTBD = match.home === 'TBD';

  if (isKnockout && isTBD) {
    return (
      <div
        className="rounded px-2 py-1 text-[10px] font-condensed font-bold tracking-wider uppercase text-center border"
        style={{
          background: `${groupColor}10`,
          borderColor: `${groupColor}40`,
          color: groupColor,
        }}
      >
        {match.stage}
      </div>
    );
  }

  const homeCC = flagEmojiToCountryCode(homeFlag);
  const awayCC = flagEmojiToCountryCode(awayFlag);

  if (viewMode === 'compact') {
    return (
      <div
        className="flex items-center justify-center gap-2 w-full hover:bg-white/5 rounded transition-colors duration-150 cursor-pointer select-none"
        style={{
          paddingTop: '3px',
          paddingBottom: '3px',
          paddingLeft: '4px',
          paddingRight: '4px',
        }}
      >
        {/* Home Flag */}
        <div className="relative flex items-center justify-center" title={match.home}>
          {homeCC && (
            <img
              src={`https://flagcdn.com/w40/${homeCC}.png`}
              alt={match.home}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
              className="w-[32px] h-[20px] object-cover rounded-[2px] border border-white/20 shadow-sm"
            />
          )}
          <span className={`${homeCC ? 'hidden' : ''} text-sm leading-none`}>
            {homeFlag}
          </span>
        </div>

        {/* Time in Middle (smaller than flags) */}
        <span className="text-[11px] font-condensed font-bold text-white/70 select-none whitespace-nowrap px-1">
          {match.time.split(' ')[0]}
        </span>

        {/* Away Flag */}
        <div className="relative flex items-center justify-center" title={match.away}>
          {awayCC && (
            <img
              src={`https://flagcdn.com/w40/${awayCC}.png`}
              alt={match.away}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
              className="w-[32px] h-[20px] object-cover rounded-[2px] border border-white/20 shadow-sm"
            />
          )}
          <span className={`${awayCC ? 'hidden' : ''} text-sm leading-none`}>
            {awayFlag}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between w-full gap-1 hover:bg-white/5 rounded transition-colors duration-150 cursor-pointer select-none"
      style={{
        paddingTop: '3px',
        paddingBottom: '3px',
        paddingLeft: '6px',
        paddingRight: '6px',
      }}
    >
      {/* Left Column: Group Name */}
      <div className="flex-1 flex justify-start">
        {match.group ? (
          <span className="text-[11px] italic text-white/50 font-condensed select-none whitespace-nowrap">
            (G<span className="hidden sm:inline">roup</span> {match.group})
          </span>
        ) : (
          <span className="text-[11px] italic text-white/50 font-condensed select-none whitespace-nowrap">
            (
            {match.stage === 'Third Place' || match.stage === 'Play-off for third place'
              ? '3rd'
              : match.stage === 'Quarter-final'
                ? 'QF'
                : match.stage === 'Semi-final'
                  ? 'SF'
                  : match.stage === 'Final'
                    ? 'F'
                    : 'KO'}
            )
          </span>
        )}
      </div>

      {/* Center Column: Flags and VS */}
      <div className="flex items-center gap-1.5 justify-center flex-shrink-0">
        {/* Home Flag */}
        <div className="relative flex items-center justify-center" title={match.home}>
          {homeCC && (
            <img
              src={`https://flagcdn.com/w40/${homeCC}.png`}
              alt={match.home}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
              className="w-[32px] h-[20px] object-cover rounded-[2px] border border-white/20 shadow-sm"
            />
          )}
          <span className={`${homeCC ? 'hidden' : ''} text-sm leading-none`}>
            {homeFlag}
          </span>
        </div>

        {/* VS separator */}
        <span className="text-[10px] font-condensed font-bold text-white/30 lowercase select-none px-0.5">
          v
        </span>

        {/* Away Flag */}
        <div className="relative flex items-center justify-center" title={match.away}>
          {awayCC && (
            <img
              src={`https://flagcdn.com/w40/${awayCC}.png`}
              alt={match.away}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
              className="w-[32px] h-[20px] object-cover rounded-[2px] border border-white/20 shadow-sm"
            />
          )}
          <span className={`${awayCC ? 'hidden' : ''} text-sm leading-none`}>
            {awayFlag}
          </span>
        </div>
      </div>

      {/* Right Column: Time */}
      <div className="flex-1 flex justify-end">
        <span className="text-[11px] italic text-white/50 font-condensed select-none whitespace-nowrap">
          {match.time.split(' ')[0]}
        </span>
      </div>
    </div>
  );
}
