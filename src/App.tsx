import CalendarMonth from './components/CalendarMonth';
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
    if (m.time === 'TBD' || m.date === 'TBD') {
      return m;
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
  const juneMatches = data.matches.filter((m) => m.date.startsWith('2026-06'));
  const julyMatches = data.matches.filter((m) => m.date.startsWith('2026-07'));

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
        {/* <header className="mb-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ background: 'rgba(202,255,0,0.15)', border: '1px solid rgba(202,255,0,0.4)' }}>
                ⚽
              </div>
              <span className="font-condensed text-xs font-bold tracking-[0.3em] uppercase text-[#CAFF00]">
                FIFA World Cup
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-white leading-none">
              2026 SCHEDULE
            </h1>
            <p className="font-condensed text-white/40 text-sm mt-2 tracking-wide">
              USA · CANADA · MEXICO &nbsp;·&nbsp; 11 JUN – 19 JUL 2026
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="font-condensed text-xs text-white/30 tracking-widest uppercase mb-1">48 Teams</div>
            <div className="font-condensed text-xs text-white/30 tracking-widest uppercase mb-1">104 Matches</div>
            <div className="font-condensed text-xs text-white/30 tracking-widest uppercase">16 Venues</div>
          </div>
        </header> */}

        {/* <Legend data={data} /> */}

        <CalendarMonth
          year={2026}
          month={6}
          matches={juneMatches}
          data={data}
        />
        <CalendarMonth
          year={2026}
          month={7}
          matches={julyMatches}
          data={data}
        />

        <footer className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="font-condensed text-white/20 text-xs tracking-widest uppercase">
            All times in local time ({localTz}) · Knockout stage fixtures
            updated after group stage concludes - Donate to{' '}
            <a target="_blank" href="http://git.hanbiro.com/luongic">
              luongic
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
