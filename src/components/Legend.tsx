import type { MatchData } from '../types';

interface LegendProps {
  data: MatchData;
}

const knockoutStages = [
  { label: 'Round of 32', color: '#CAFF00' },
  { label: 'Round of 16', color: '#00D4FF' },
  { label: 'Quarter-final', color: '#FF6B35' },
  { label: 'Semi-final', color: '#FF2D90' },
  { label: 'Final', color: '#FFD700' },
];

export default function Legend({ data }: LegendProps) {
  return (
    <div className="mb-10 p-5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
      <h3 className="font-condensed font-bold text-xs tracking-widest uppercase text-white/40 mb-4">Group Stage</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(data.groups).map(([grp, info]) => (
          <div
            key={grp}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-condensed font-semibold"
            style={{ background: `${info.color}20`, border: `1px solid ${info.color}60`, color: info.color }}
          >
            <span>Group {grp}</span>
          </div>
        ))}
      </div>
      <h3 className="font-condensed font-bold text-xs tracking-widest uppercase text-white/40 mb-3">Knockout Rounds</h3>
      <div className="flex flex-wrap gap-2">
        {knockoutStages.map(({ label, color }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-condensed font-semibold"
            style={{ background: `${color}20`, border: `1px solid ${color}60`, color }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
