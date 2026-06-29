import type { Match, MatchData } from '../types';
import BracketMatchCard from './BracketMatchCard';

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
  top: string;
  bottom: string;
  isLeft: boolean;
}

const border_rounded_var = 'var(--bracket-connector-radius)';

function Connector({ top, bottom, isLeft }: ConnectorProps) {
  const borderStyle = isLeft
    ? {
        borderTop: '2px solid rgba(255,255,255,0.18)',
        borderBottom: '2px solid rgba(255,255,255,0.18)',
        borderRight: '2px solid rgba(255,255,255,0.18)',
        borderTopRightRadius: border_rounded_var,
        borderBottomRightRadius: border_rounded_var,
      }
    : {
        borderTop: '2px solid rgba(255,255,255,0.18)',
        borderBottom: '2px solid rgba(255,255,255,0.18)',
        borderLeft: '2px solid rgba(255,255,255,0.18)',
        borderTopLeftRadius: border_rounded_var,
        borderBottomLeftRadius: border_rounded_var,
      };

  const connectorStyle = {
    position: 'absolute' as const,
    top: top,
    height: `calc(${bottom} - ${top})`,
    width: 'calc(var(--bracket-gap) / 2)',
    left: isLeft ? '100%' : 'auto',
    right: isLeft ? 'auto' : '100%',
    pointerEvents: 'none' as const,
    ...borderStyle,
  };

  const exitStyle = {
    position: 'absolute' as const,
    top: '50%',
    height: '2px',
    width: 'calc(var(--bracket-gap) / 2)',
    left: isLeft ? '100%' : 'auto',
    right: isLeft ? 'auto' : '100%',
    backgroundColor: 'rgba(255,255,255,0.18)',
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

  // Absolute positioning definitions for 100% perfect visual alignment
  const r32Tops = [
    'calc(0 * var(--step))',
    'calc(1 * var(--step))',
    'calc(2 * var(--step))',
    'calc(3 * var(--step))',
    'calc(4 * var(--step))',
    'calc(5 * var(--step))',
    'calc(6 * var(--step))',
    'calc(7 * var(--step))',
  ];
  const r16Tops = [
    'calc(0.5 * var(--step))',
    'calc(2.5 * var(--step))',
    'calc(4.5 * var(--step))',
    'calc(6.5 * var(--step))',
  ];
  const qfTops = ['calc(1.5 * var(--step))', 'calc(5.5 * var(--step))'];
  const sfTops = ['calc(3.5 * var(--step))'];

  const renderAbsolutePairConnector = (
    _matchAId: number,
    _matchBId: number,
    topCardTop: string,
    bottomCardTop: string,
    isLeft: boolean,
    _stage?: string,
  ) => {
    return (
      <Connector
        top={`calc(${topCardTop} + (var(--bracket-card-height) / 2))`}
        bottom={`calc(${bottomCardTop} + (var(--bracket-card-height) / 2))`}
        isLeft={isLeft}
      />
    );
  };

  const renderAbsoluteSFLine = (_matchId: number, isLeft: boolean) => {
    const sfLineStyle = {
      position: 'absolute' as const,
      top: 'calc(3.5 * var(--step) + var(--bracket-card-height) / 2)',
      left: isLeft ? '100%' : 'auto',
      right: isLeft ? 'auto' : '100%',
      width: 'var(--bracket-gap)',
      height: '2px',
      backgroundColor: 'rgba(255,255,255,0.18)',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const,
    };

    return <div style={sfLineStyle} />;
  };

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-visible">
      {/* Bracket Structure - Mathematically Perfect Symmetrical Alignment */}
      <div
        className="flex justify-center items-center w-full select-none py-2"
        style={{
          height: 'calc(7 * var(--step) + var(--bracket-card-height) + 36px)',
        }}
      >
        <div
          className="flex h-full items-center justify-center"
          style={{ gap: 'var(--bracket-gap)' }}
        >
          {/* Left Column 1: Round of 32 (8 matches, 4 pair connectors) */}
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {leftR32.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: r32Tops[idx] }}
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
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {leftR16.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: r16Tops[idx] }}
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
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {leftQF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: qfTops[idx] }}
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
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {leftSF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: sfTops[idx] }}
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
          <div
            className="relative flex flex-col items-center flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {/* World Champion Title & Card */}
            <div
              style={{
                position: 'absolute',
                top: 'calc(1.5 * var(--step) - 32px)',
              }}
              className="flex flex-col items-center"
            >
              <div className="text-[12px] font-condensed font-black tracking-[0.2em] text-white/90 mb-2 uppercase text-center leading-none">
                WORLD
                <br />
                CHAMPION
              </div>
              <div
                style={{
                  padding: 'var(--bracket-card-padding)',
                  width: 'var(--bracket-card-width)',
                  height: 'var(--bracket-champ-card-height)',
                }}
                title={
                  championName === 'W104' ? 'Winner Match 104' : championName
                }
                className={`bg-[#111111] border rounded-[10px] flex items-center justify-center transition-all duration-300 shadow-[4px_4px_8px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(255,255,255,0.015)] ${
                  isChampPlaceholder
                    ? 'border-[#FFD700]/45'
                    : 'border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.25)]'
                }`}
              >
                <div
                  style={{
                    width: 'var(--bracket-flag-width)',
                    height: 'var(--bracket-flag-height)',
                  }}
                  className="relative"
                >
                  {isChampPlaceholder ? (
                    <div className="w-full h-full rounded-tl-[8px] rounded-br-[8px] bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/70 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                      ?
                    </div>
                  ) : (
                    <div className="w-full h-full relative overflow-hidden rounded-tl-[8px] rounded-br-[8px] border border-black/30">
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
              style={{
                position: 'absolute',
                top: 'calc(1.5 * var(--step) + var(--bracket-champ-card-height) + 10px)',
                height:
                  'calc(2 * var(--step) - var(--bracket-champ-card-height) - 10px)',
              }}
              className="w-[2px] bg-gradient-to-b from-[#FFD700] to-white/10"
            />

            {/* Final Match Card */}
            <div
              style={{ position: 'absolute', top: 'calc(3.5 * var(--step))' }}
            >
              <BracketMatchCard match={finalMatch} data={data} />
            </div>

            {/* Bronze Final Card (Horizontally side-by-side flags) */}
            {thirdPlaceMatch && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(4.5 * var(--step) + 8px)',
                }}
                className="flex flex-col items-center gap-1 mt-1"
              >
                <div
                  style={{
                    padding: 'var(--bracket-card-padding)',
                    width: 'calc(2 * var(--bracket-flag-width) + 4px)',
                    height: 'var(--bracket-champ-card-height)',
                  }}
                  title={`${formatTeamName(thirdPlaceMatch.home)} vs ${formatTeamName(thirdPlaceMatch.away)}\nVenue: ${thirdPlaceMatch.venue}`}
                  className="bg-[#111111] border border-white/18 rounded-[10px] flex items-center justify-between shadow-[4px_4px_8px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(255,255,255,0.015)] hover:translate-y-[-1px] transition-all duration-200"
                >
                  <div
                    style={{
                      width: 'calc(var(--bracket-flag-width) - 6px)',
                      height: 'calc(var(--bracket-flag-height) - 4px)',
                    }}
                    className="relative"
                  >
                    {thirdPlaceMatch.home === 'TBD' ||
                    thirdPlaceMatch.home.startsWith('W') ||
                    thirdPlaceMatch.home.startsWith('RU') ? (
                      <div className="w-full h-full rounded-tl-[8px] rounded-br-[8px] bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/70 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                        ?
                      </div>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden rounded-tl-[8px] rounded-br-[8px] border border-black/30">
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
                  <div
                    style={{
                      width: 'calc(var(--bracket-flag-width) - 6px)',
                      height: 'calc(var(--bracket-flag-height) - 4px)',
                    }}
                    className="relative"
                  >
                    {thirdPlaceMatch.away === 'TBD' ||
                    thirdPlaceMatch.away.startsWith('W') ||
                    thirdPlaceMatch.away.startsWith('RU') ? (
                      <div className="w-full h-full rounded-tl-[8px] rounded-br-[8px] bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/70 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]">
                        ?
                      </div>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden rounded-tl-[8px] rounded-br-[8px] border border-black/30">
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
                <div className="text-[7px] font-condensed font-black tracking-[0.1em] text-white/60 uppercase">
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
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {rightSF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: sfTops[idx] }}
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
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {rightQF.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: qfTops[idx] }}
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
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {rightR16.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: r16Tops[idx] }}
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
          <div
            className="relative flex-shrink-0"
            style={{
              width: 'var(--bracket-card-width)',
              height: 'calc(7 * var(--step) + var(--bracket-card-height))',
            }}
          >
            {rightR32.map((match, idx) => (
              <div
                key={match.id}
                style={{ position: 'absolute', top: r32Tops[idx] }}
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
