export interface Match {
  id: number;
  date: string;
  group: string | null;
  home: string;
  away: string;
  venue: string;
  time: string;
  stage: string;
  homeScore?: number;
  awayScore?: number;
}

export interface GroupInfo {
  color: string;
  teams: string[];
}

export interface MatchData {
  groups: Record<string, GroupInfo>;
  flags: Record<string, string>;
  matches: Match[];
}
