import type { Match, MatchData } from '../types';
import MatchCard, { stageColors } from './MatchCard';
import KnockoutBadge from './KnockoutBadge';

interface CalendarDayProps {
  day: number | null;
  month: number; // 6 = June, 7 = July
  year: number;
  matches: Match[];
  data: MatchData;
  isToday: boolean;
  isCurrentMonth: boolean;
  viewMode: 'classic' | 'compact';
}

export default function CalendarDay({
  day,
  matches,
  data,
  isToday,
  isCurrentMonth,
  viewMode,
}: CalendarDayProps) {
  if (day === null) {
    return <div className="min-h-[100px] rounded-lg bg-white/[0.02] border border-white/[0.04]" />;
  }

  // A day is a knockout TBD day if we have matches and all of them are knockout and TBD (no country flag)
  const isKnockoutTBDDay =
    matches.length > 0 &&
    matches.every(
      (m) =>
        m.stage !== 'Group Stage' &&
        m.stage !== 'First Stage' &&
        (m.home === 'TBD' || !data.flags[m.home])
    );

  const firstMatch = matches[0];
  const stageColor = firstMatch ? (stageColors[firstMatch.stage] ?? '#CAFF00') : '#CAFF00';

  return (
    <div
      className={`
        min-h-[100px] rounded-xl border p-2 flex flex-col gap-1 transition-all duration-200
        ${isToday
          ? 'border-[#CAFF00]/60 bg-[#CAFF00]/5 shadow-[0_0_12px_rgba(202,255,0,0.1)]'
          : 'border-white/[0.08] bg-[#0c0c0c] hover:bg-white/[0.03] hover:border-white/[0.15]'
        }
        ${!isCurrentMonth ? 'opacity-30' : ''}
      `}
    >
      {/* Day Number */}
      <div
        className={`
          text-right text-[13px] font-condensed font-extrabold leading-none tracking-wider text-[#CAFF00]/90
        `}
      >
        {String(day).padStart(2, '0')}
      </div>

      {/* Matches Grid / Badge */}
      <div className="flex flex-col justify-center flex-1">
        {isKnockoutTBDDay ? (
          <KnockoutBadge
            stage={firstMatch.stage}
            color={stageColor}
            matches={matches}
          />
        ) : (
          <div className="flex flex-col gap-1 justify-center flex-1">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} data={data} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
