import type { Match, MatchData } from '../types';
import CalendarDay from './CalendarDay';

interface CalendarMonthProps {
  matches: Match[];
  data: MatchData;
  viewMode: 'classic' | 'compact';
}

const DAYS = [
  { short: 'MON', full: 'MONDAY' },
  { short: 'TUE', full: 'TUESDAY' },
  { short: 'WED', full: 'WEDNESDAY' },
  { short: 'THU', full: 'THURSDAY' },
  { short: 'FRI', full: 'FRIDAY' },
  { short: 'SAT', full: 'SATURDAY' },
  { short: 'SUN', full: 'SUNDAY' },
];

export default function CalendarMonth({
  matches,
  data,
  viewMode,
}: CalendarMonthProps) {
  const today = new Date();

  // Create unified grid cells for June and July 2026.
  // June 1, 2026 is a Monday (no startOffset padding needed).
  interface DayCell {
    day: number;
    month: number;
    year: number;
  }

  const cells: (DayCell | null)[] = [];

  // June 2026 (30 days)
  for (let d = 1; d <= 30; d++) {
    cells.push({ day: d, month: 6, year: 2026 });
  }

  // July 2026 (31 days)
  for (let d = 1; d <= 31; d++) {
    cells.push({ day: d, month: 7, year: 2026 });
  }

  // Pad the end to align to full 7-day weeks.
  // July 31, 2026 is a Friday (requires 2 padding days for Saturday and Sunday).
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const getMatchesForDay = (y: number, m: number, d: number): Match[] => {
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return matches.filter((match) => match.date === dateStr);
  };

  return (
    <section className="mb-12">
      {/* Month Header */}
      {/* <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-baseline gap-4">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-white leading-none tracking-tight">
            JUNE & JULY
          </h2>
          <span className="font-condensed text-lg sm:text-2xl text-white/20 font-bold">
            2026
          </span>
        </div>
      </div> */}

      <div className="w-full overflow-x-auto pb-4 scrollbar-visible">
        <div className="min-w-[750px] md:min-w-0 flex flex-col gap-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {DAYS.map((d) => {
              let bgClass = 'bg-[#CAFF00]';
              if (d.short === 'SAT') {
                bgClass = 'bg-[#00D4FF]';
              } else if (d.short === 'SUN') {
                bgClass = 'bg-[#FF2D90]';
              }
              return (
                <div
                  key={d.full}
                  className={`text-center text-[10px] sm:text-xs font-condensed font-bold tracking-wider py-1.5 rounded text-black uppercase ${bgClass}`}
                >
                  <span className="hidden sm:inline">{d.full}</span>
                  <span className="inline sm:hidden">{d.short}</span>
                </div>
              );
            })}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {cells.map((cell, idx) => {
              if (cell === null) {
                return (
                  <div
                    key={`pad-${idx}`}
                    className="min-h-[90px] sm:min-h-[100px] rounded-lg bg-white/[0.01] border border-white/[0.02] opacity-40"
                  />
                );
              }
              return (
                <CalendarDay
                  key={`${cell.year}-${cell.month}-${cell.day}`}
                  day={cell.day}
                  month={cell.month}
                  year={cell.year}
                  matches={getMatchesForDay(cell.year, cell.month, cell.day)}
                  data={data}
                  isToday={
                    today.getFullYear() === cell.year &&
                    today.getMonth() + 1 === cell.month &&
                    today.getDate() === cell.day
                  }
                  isCurrentMonth={true}
                  viewMode={viewMode}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
