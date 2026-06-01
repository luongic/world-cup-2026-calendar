import type { Match, MatchData } from '../types';
import CalendarDay from './CalendarDay';

interface CalendarMonthProps {
  year: number;
  month: number; // 6 or 7
  matches: Match[];
  data: MatchData;
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

export default function CalendarMonth({ year, month, matches, data }: CalendarMonthProps) {
  const today = new Date();
  const firstDay = new Date(year, month - 1, 1);
  // getDay() 0=Sun, convert to Mon-based: 0=Mon,...,6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' }).toUpperCase();


  // Build grid cells
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const getMatchesForDay = (day: number | null): Match[] => {
    if (!day) return [];
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return matches.filter((m) => m.date === dateStr);
  };

  return (
    <section className="mb-12">
      {/* Month Header */}
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="font-display text-7xl text-white leading-none tracking-tight">{monthName}</h2>
        <span className="font-condensed text-2xl text-white/20 font-bold">{year}</span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((d) => (
            <div
              key={d.full}
              className="text-center text-[10px] sm:text-xs font-condensed font-bold tracking-wider py-1.5 rounded bg-[#CAFF00] text-black uppercase"
            >
              <span className="hidden sm:inline">{d.full}</span>
              <span className="inline sm:hidden">{d.short}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, idx) => (
            <CalendarDay
              key={idx}
              day={day}
              month={month}
              year={year}
              matches={getMatchesForDay(day)}
              data={data}
              isToday={
                day !== null &&
                today.getFullYear() === year &&
                today.getMonth() + 1 === month &&
                today.getDate() === day
              }
              isCurrentMonth={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
