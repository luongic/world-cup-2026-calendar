import { useState } from 'react';
import CalendarMonth from './components/CalendarMonth';
import KnockoutBracket from './components/KnockoutBracket';
// import Legend from './components/Legend';
import matchData from './data/matches.json';
import type { MatchData, Match } from './types';

const rawData = matchData as MatchData;

function getLocalTimezoneString(): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
    }).formatToParts(new Date());
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart) return tzPart.value;
  } catch (e) {
    // fallback
  }
  const offset = new Date().getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  const sign = offset <= 0 ? '+' : '-';
  return `GMT${sign}${hours}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`;
}

const localTz = getLocalTimezoneString();

function convertMatchesToLocalTime(matches: Match[]): Match[] {
  return matches.map((m) => {
    if (m.time === 'TBD' || m.date === 'TBD' || !m.time) {
      return m;
    }

    try {
      // Check if time is in ISO format (e.g. 2026-06-11T19:00:00Z)
      const dateParsed = Date.parse(m.time);
      if (!isNaN(dateParsed)) {
        const utcDate = new Date(dateParsed);
        const localYear = utcDate.getFullYear();
        const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
        const localDay = String(utcDate.getDate()).padStart(2, '0');
        const localHours = String(utcDate.getHours()).padStart(2, '0');
        const localMinutes = String(utcDate.getMinutes()).padStart(2, '0');

        return {
          ...m,
          date: `${localYear}-${localMonth}-${localDay}`,
          time: `${localHours}:${localMinutes} (${localTz})`,
        };
      }
    } catch (e) {
      // fallback
    }

    const timeParts = m.time.match(/^(\d{2}):(\d{2})\s*ET$/);
    if (!timeParts) return m;

    const hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);

    const dateParts = m.date.split('-');
    if (dateParts.length !== 3) return m;
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    // ET in June/July is Eastern Daylight Time (EDT) which is UTC-4.
    // UTC = EDT + 4 hours.
    const utcDate = new Date(Date.UTC(year, month, day, hours + 4, minutes));

    const localYear = utcDate.getFullYear();
    const localMonth = String(utcDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(utcDate.getDate()).padStart(2, '0');
    const localHours = String(utcDate.getHours()).padStart(2, '0');
    const localMinutes = String(utcDate.getMinutes()).padStart(2, '0');

    return {
      ...m,
      date: `${localYear}-${localMonth}-${localDay}`,
      time: `${localHours}:${localMinutes} (${localTz})`,
    };
  });
}

const data: MatchData = {
  ...rawData,
  matches: convertMatchesToLocalTime(rawData.matches),
};

export default function App() {
  const [viewMode, setViewMode] = useState<'classic' | 'compact' | 'draw'>(
    'draw',
  );

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: 'var(--bg)' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(202,255,0,0.04), transparent)`,
        }}
      />

      <div className="relative w-full max-w-7xl px-4 sm:px-6 py-8">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div>
            {/* <div className="flex items-center gap-3 mb-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{
                  background: 'rgba(202,255,0,0.15)',
                  border: '1px solid rgba(202,255,0,0.4)',
                }}
              >
                ⚽
              </div>
              <span className="font-condensed text-xs font-bold tracking-[0.3em] uppercase text-[#CAFF00]">
                FIFA World Cup
              </span>
            </div> */}
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-none">
              2026 SCHEDULE
            </h1>
            <p className="font-condensed text-white/40 text-sm mt-2 tracking-wide">
              USA · CANADA · MEXICO &nbsp;·&nbsp; 11 JUN – 19 JUL 2026
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            {/* View Selector Toggle */}
            <div className="flex bg-white/[0.03] border border-white/[0.08] p-0.5 sm:p-1 rounded-full gap-0.5 sm:gap-1">
              {(['classic', 'compact', 'draw'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`view-toggle-btn rounded-full font-condensed font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    viewMode === mode
                      ? 'bg-[#CAFF00] text-black shadow-[0_0_12px_rgba(202,255,0,0.3)]'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* <div className="hidden sm:flex items-center gap-4 text-right">
              <div className="font-condensed text-[10px] text-white/30 tracking-widest uppercase">
                48 Teams
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="font-condensed text-[10px] text-white/30 tracking-widest uppercase">
                104 Matches
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="font-condensed text-[10px] text-white/30 tracking-widest uppercase">
                16 Venues
              </div>
            </div> */}
          </div>
        </header>

        {viewMode !== 'draw' ? (
          <CalendarMonth
            matches={data.matches.filter(
              (m) =>
                m.date.startsWith('2026-06') || m.date.startsWith('2026-07'),
            )}
            data={data}
            viewMode={viewMode}
          />
        ) : (
          <KnockoutBracket data={data} />
        )}

        {/* <footer className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="font-condensed text-white/20 text-xs tracking-widest uppercase">
            All times in local time ({localTz}) · Knockout stage fixtures
            updated after group stage concludes - Donate to{' '}
            <a target="_blank" href="http://git.hanbiro.com/luongic">
              luongic
            </a>
          </p>
        </footer> */}
      </div>
    </div>
  );
}
