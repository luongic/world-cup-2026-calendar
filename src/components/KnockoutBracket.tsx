import type { Match, MatchData } from '../types';
import BracketMatchCard from './BracketMatchCard';
import { stageColors } from './MatchCard';

interface KnockoutBracketProps {
  data: MatchData;
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

interface ConnectorProps {
  top: number;
  bottom: number;
  isLeft: boolean;
}

function Connector({ top, bottom, isLeft }: ConnectorProps) {
  const borderStyle = isLeft
    ? {
        borderTop: '2px solid rgba(255,255,255,0.05)',
        borderBottom: '2px solid rgba(255,255,255,0.05)',
        borderRight: '2px solid rgba(255,255,255,0.05)',
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
      }
    : {
        borderTop: '2px solid rgba(255,255,255,0.05)',
        borderBottom: '2px solid rgba(255,255,255,0.05)',
        borderLeft: '2px solid rgba(255,255,255,0.05)',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      };

  const connectorStyle = {
    position: 'absolute' as const,
    top: `${top}px`,
    height: `${bottom - top}px`,
    width: '20px',
    left: isLeft ? '100%' : 'auto',
    right: isLeft ? 'auto' : '100%',
    pointerEvents: 'none' as const,
    ...borderStyle,
  };

  const exitStyle = {
    position: 'absolute' as const,
    top: '50%',
    height: '2px',
    width: '20px',
    left: isLeft ? '100%' : 'auto',
    right: isLeft ? 'auto' : '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
  };

  return (
    <div style={connectorStyle}>
      <div style={exitStyle} />
    </div>
  );
}

export default function KnockoutBracket({ data }: KnockoutBracketProps) {
  const findMatch = (id: number): Match => {
    const m = data.matches.find((item) => item.id === id);
    if (!m) {
      return {
        id,
        date: '2026-07-01',
        group: null,
        home: 'TBD',
        away: 'TBD',
        venue: 'Unknown Venue',
        time: 'TBD',
        stage: 'Knockout',
      };
    }
    return m;
  };

  const leftR32 = [74, 77, 73, 75, 83, 84, 81, 82].map(findMatch);
  const leftR16 = [89, 90, 93, 94].map(findMatch);
  const leftQF = [97, 98].map(findMatch);
  const leftSF = [101].map(findMatch);

  const rightR32 = [76, 78, 79, 80, 86, 88, 85, 87].map(findMatch);
  const rightR16 = [91, 92, 95, 96].map(findMatch);
  const rightQF = [99, 100].map(findMatch);
  const rightSF = [102].map(findMatch);

  const finalMatch = findMatch(104);
  const thirdPlaceMatch = findMatch(103);

  let championName = 'TBD';
  if (finalMatch) {
    if (
      finalMatch.homeScore !== undefined &&
      finalMatch.awayScore !== undefined
    ) {
      if (finalMatch.homeScore > finalMatch.awayScore) {
        championName = finalMatch.home;
      } else if (finalMatch.awayScore > finalMatch.homeScore) {
        championName = finalMatch.away;
      }
    } else {
      championName = 'W104';
    }
  }

  const isChampPlaceholder =
    championName === 'TBD' ||
    championName.startsWith('W') ||
    championName.startsWith('RU');
  const champFlag = data.flags[championName] ?? '';
  const champCC = flagEmojiToCountryCode(champFlag);

  const getStageColor = (stage: string) => stageColors[stage] ?? '#888';

  // Absolute positioning definitions for 100% perfect visual alignment
  const r32Tops = [0, 80, 160, 240, 320, 400, 480, 560];
  const r16Tops = [40, 200, 360, 520];
  const qfTops = [120, 440];
  const sfTops = [280];

  const renderAbsolutePairConnector = (
    _matchAId: number,
    _matchBId: number,
    topCardTop: number,
    bottomCardTop: number,
    isLeft: boolean,
    _stage?: string,
  ) => {
    // Connector top aligns with center of top card (topCardTop + 32px)
    // Connector bottom aligns with center of bottom card (bottomCardTop + 32px)
    return (
      <Connector
        top={topCardTop + 32}
        bottom={bottomCardTop + 32}
        isLeft={isLeft}
      />
    );
  };

  const renderAbsoluteSFLine = (_matchId: number, isLeft: boolean) => {
    const sfLineStyle = {
      position: 'absolute' as const,
      top: '312px',
      left: isLeft ? '100%' : 'auto',
      right: isLeft ? 'auto' : '100%',
      width: '40px',
      height: '2px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const,
    };

    return <div style={sfLineStyle} />;
  };

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-visible">
      {/* Bracket Structure - Mathematically Perfect Symmetrical Alignment */}
      <div className="flex justify-center items-center w-full min-w-[940px] h-[660px] select-none py-2">
        <div className="flex gap-[40px] h-full items-center justify-center">
          {/* Left Column 1: Round of 32 (8 matches, 4 pair connectors) */}
          <div className="relative w-[50px] h-[624px]">
            {leftR32.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${r32Tops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsolutePairConnector(
              leftR32[0].id,
              leftR32[1].id,
              r32Tops[0],
              r32Tops[1],
              true,
              'Round of 32',
            )}
            {renderAbsolutePairConnector(
              leftR32[2].id,
              leftR32[3].id,
              r32Tops[2],
              r32Tops[3],
              true,
              'Round of 32',
            )}
            {renderAbsolutePairConnector(
              leftR32[4].id,
              leftR32[5].id,
              r32Tops[4],
              r32Tops[5],
              true,
              'Round of 32',
            )}
            {renderAbsolutePairConnector(
              leftR32[6].id,
              leftR32[7].id,
              r32Tops[6],
              r32Tops[7],
              true,
              'Round of 32',
            )}
          </div>

          {/* Left Column 2: Round of 16 (4 matches, 2 pair connectors) */}
          <div className="relative w-[50px] h-[624px]">
            {leftR16.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${r16Tops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsolutePairConnector(
              leftR16[0].id,
              leftR16[1].id,
              r16Tops[0],
              r16Tops[1],
              true,
              'Round of 16',
            )}
            {renderAbsolutePairConnector(
              leftR16[2].id,
              leftR16[3].id,
              r16Tops[2],
              r16Tops[3],
              true,
              'Round of 16',
            )}
          </div>

          {/* Left Column 3: Quarter-final (2 matches, 1 pair connector) */}
          <div className="relative w-[50px] h-[624px]">
            {leftQF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${qfTops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsolutePairConnector(
              leftQF[0].id,
              leftQF[1].id,
              qfTops[0],
              qfTops[1],
              true,
              'Quarter-final',
            )}
          </div>

          {/* Left Column 4: Semi-final (1 match) */}
          <div className="relative w-[50px] h-[624px]">
            {leftSF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${sfTops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsoluteSFLine(leftSF[0].id, true)}
          </div>

          {/* Center Column: Centerpiece (Finalist, Champion, Trophy and Logo) */}
          <div className="relative w-[50px] h-[624px] flex flex-col items-center">
            {/* World Champion Title & Card */}
            <div
              style={{ position: 'absolute', top: '120px' }}
              className="flex flex-col items-center"
            >
              <div className="text-[12px] font-condensed font-black tracking-[0.2em] text-white/90 mb-2 uppercase text-center leading-none">
                WORLD
                <br />
                CHAMPION
              </div>
              <div
                style={{ padding: '5px' }}
                title={
                  championName === 'W104' ? 'Winner Match 104' : championName
                }
                className={`w-[50px] h-[36px] bg-[#111111] border rounded-[10px] flex items-center justify-center transition-all duration-300 shadow-[4px_4px_8px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(255,255,255,0.015)] ${
                  isChampPlaceholder
                    ? 'border-[#FFD700]/20'
                    : 'border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.25)]'
                }`}
              >
                <div className="w-[36px] h-[24px] relative">
                  {isChampPlaceholder ? (
                    <div className="w-full h-full rounded-[4px] bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-[9px] font-bold text-white/40 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                      ?
                    </div>
                  ) : (
                    <div className="w-full h-full relative overflow-hidden rounded-[3px] border border-black/30">
                      {champCC ? (
                        <img
                          src={`https://flagcdn.com/w40/${champCC}.png`}
                          alt={championName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] leading-none">
                          {champFlag}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connecting Vertical line from Champion to Final Card */}
            <div
              style={{ position: 'absolute', top: '198px' }}
              className="h-[82px] w-[2px] bg-gradient-to-b from-[#FFD700] to-white/10"
            />

            {/* Final Match Card */}
            <div style={{ position: 'absolute', top: '280px' }}>
              <BracketMatchCard match={finalMatch} data={data} />
            </div>

            {/* Bronze Final Card (Horizontally side-by-side flags) */}
            {thirdPlaceMatch && (
              <div
                style={{ position: 'absolute', top: '368px' }}
                className="flex flex-col items-center gap-1 mt-1"
              >
                <div
                  style={{ padding: '5px' }}
                  title={`${formatTeamName(thirdPlaceMatch.home)} vs ${formatTeamName(thirdPlaceMatch.away)}\nVenue: ${thirdPlaceMatch.venue}`}
                  className="w-[84px] h-[36px] bg-[#111111] border border-white/5 rounded-[10px] flex items-center justify-between shadow-[4px_4px_8px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(255,255,255,0.015)] hover:translate-y-[-1px] transition-all duration-200"
                >
                  <div className="w-[34px] h-[22px] relative">
                    {thirdPlaceMatch.home === 'TBD' ||
                    thirdPlaceMatch.home.startsWith('W') ||
                    thirdPlaceMatch.home.startsWith('RU') ? (
                      <div className="w-full h-full rounded-[4px] bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-[9px] font-bold text-white/40 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                        ?
                      </div>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden rounded-[3px] border border-black/30">
                        {flagEmojiToCountryCode(
                          data.flags[thirdPlaceMatch.home],
                        ) ? (
                          <img
                            src={`https://flagcdn.com/w40/${flagEmojiToCountryCode(data.flags[thirdPlaceMatch.home])}.png`}
                            alt={thirdPlaceMatch.home}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] leading-none">
                            {data.flags[thirdPlaceMatch.home]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="w-[34px] h-[22px] relative">
                    {thirdPlaceMatch.away === 'TBD' ||
                    thirdPlaceMatch.away.startsWith('W') ||
                    thirdPlaceMatch.away.startsWith('RU') ? (
                      <div className="w-full h-full rounded-[4px] bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-[9px] font-bold text-white/40 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                        ?
                      </div>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden rounded-[3px] border border-black/30">
                        {flagEmojiToCountryCode(
                          data.flags[thirdPlaceMatch.away],
                        ) ? (
                          <img
                            src={`https://flagcdn.com/w40/${flagEmojiToCountryCode(data.flags[thirdPlaceMatch.away])}.png`}
                            alt={thirdPlaceMatch.away}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] leading-none">
                            {data.flags[thirdPlaceMatch.away]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[7px] font-condensed font-black tracking-[0.1em] text-white/30 uppercase">
                  BRONZE FINAL
                </div>
              </div>
            )}

            {/* World Cup Trophy Asset */}
            {/* <div style={{ position: 'absolute', top: '428px' }}>
              <img
                src="/fifa_trophy.png"
                alt="FIFA World Cup Trophy"
                className="w-[80px] h-[140px] object-contain filter drop-shadow-[0_0_12px_rgba(255,215,0,0.15)] select-none mt-2"
              />
            </div> */}

            {/* Official Logo Footer Styling */}
            {/* <div
              style={{ position: 'absolute', top: '574px' }}
              className="flex flex-col items-center opacity-70 scale-90"
            >
              <span className="font-display text-2xl font-black text-white leading-none tracking-tighter select-none">
                26
              </span>
              <div className="text-[7px] font-condensed font-black tracking-[0.2em] text-white/60 uppercase select-none mt-0.5 leading-none">
                FIFA WORLD CUP 2026
              </div>
            </div> */}
          </div>

          {/* Right Column 4: Semi-final (1 match) */}
          <div className="relative w-[50px] h-[624px]">
            {rightSF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${sfTops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsoluteSFLine(rightSF[0].id, false)}
          </div>

          {/* Right Column 3: Quarter-final (2 matches, 1 pair connector) */}
          <div className="relative w-[50px] h-[624px]">
            {rightQF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${qfTops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsolutePairConnector(
              rightQF[0].id,
              rightQF[1].id,
              qfTops[0],
              qfTops[1],
              false,
              'Quarter-final',
            )}
          </div>

          {/* Right Column 2: Round of 16 (4 matches, 2 pair connectors) */}
          <div className="relative w-[50px] h-[624px]">
            {rightR16.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${r16Tops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsolutePairConnector(
              rightR16[0].id,
              rightR16[1].id,
              r16Tops[0],
              r16Tops[1],
              false,
              'Round of 16',
            )}
            {renderAbsolutePairConnector(
              rightR16[2].id,
              rightR16[3].id,
              r16Tops[2],
              r16Tops[3],
              false,
              'Round of 16',
            )}
          </div>

          {/* Right Column 1: Round of 32 (8 matches, 4 pair connectors) */}
          <div className="relative w-[50px] h-[624px]">
            {rightR32.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: `${r32Tops[idx]}px` }}
              >
                <BracketMatchCard
                  match={match}
                  data={data}
                  // isHighlighted={activePath.includes(match.id)}
                  // onHoverStart={() => setHoveredMatchId(match.id)}
                  // onHoverEnd={() => setHoveredMatchId(null)}
                />
              </div>
            ))}
            {renderAbsolutePairConnector(
              rightR32[0].id,
              rightR32[1].id,
              r32Tops[0],
              r32Tops[1],
              false,
              'Round of 32',
            )}
            {renderAbsolutePairConnector(
              rightR32[2].id,
              rightR32[3].id,
              r32Tops[2],
              r32Tops[3],
              false,
              'Round of 32',
            )}
            {renderAbsolutePairConnector(
              rightR32[4].id,
              rightR32[5].id,
              r32Tops[4],
              r32Tops[5],
              false,
              'Round of 32',
            )}
            {renderAbsolutePairConnector(
              rightR32[6].id,
              rightR32[7].id,
              r32Tops[6],
              r32Tops[7],
              false,
              'Round of 32',
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
