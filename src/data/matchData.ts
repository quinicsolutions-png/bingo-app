// Bingo Data Layer - Football Prediction Engine
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeShort: string;
  awayShort: string;
  league: string;
  leagueIcon: string;
  kickoff: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  matchday: number;
  season: string;
  prediction: Prediction | null;
  result: MatchResult | null;
  odds?: MatchOdds;
  dataSource?: string;
}

export interface MatchOdds {
  home?: number;
  draw?: number;
  away?: number;
  source: string;
  updatedAt: string;
}

export interface Prediction {
  home: number;
  draw: number;
  away: number;
  pick: '1' | 'X' | '2';
  confidence: 'HIGH' | 'MEDIUM' | 'DRAW_ALERT' | 'LOW';
  confidenceScore: number;
  model: string;
  reasoning: string;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  outcome: '1' | 'X' | '2';
  correct: boolean;
}

export interface JackpotWeek {
  id: string;
  label: string;
  status: 'active' | 'settled' | 'upcoming';
  cutoffTime: string;
  matches: Match[];
  score: number | null;
  totalMatches: number;
  settledAt: string | null;
}

export interface SlateFile {
  generatedAt: string | null;
  week: JackpotWeek | null;
}

export interface HistoryFile {
  generatedAt: string | null;
  weeks: JackpotWeek[];
}

export interface PlatformStats {
  totalPredictions: number;
  correctPredictions: number;
  overallAccuracy: number | null;
  highConfidenceAccuracy: number | null;
  weeksTracked: number;
  leaguesCovered: number;
}

export const APP_VERSION = "2.2.0";

export { generatePrediction } from "./predict.mjs";

export function statsFromWeeks(weeks: JackpotWeek[], active: JackpotWeek | null): PlatformStats {
  const settledMatches = weeks.flatMap((week) => week.matches).filter((match) => match.result);
  const correct = settledMatches.filter((match) => match.result?.correct).length;
  const high = settledMatches.filter((match) => match.prediction?.confidence === "HIGH");
  const highCorrect = high.filter((match) => match.result?.correct).length;
  const leagues = new Set<string>();
  for (const match of [...weeks.flatMap((week) => week.matches), ...(active?.matches ?? [])]) {
    if (match.league) leagues.add(match.league);
  }
  return {
    totalPredictions: settledMatches.length,
    correctPredictions: correct,
    overallAccuracy: settledMatches.length ? Math.round((correct / settledMatches.length) * 1000) / 10 : null,
    highConfidenceAccuracy: high.length ? Math.round((highCorrect / high.length) * 1000) / 10 : null,
    weeksTracked: weeks.length,
    leaguesCovered: leagues.size,
  };
}
