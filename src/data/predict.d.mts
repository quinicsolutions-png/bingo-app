export interface PredictionOptions {
  /** Goals-scored multiplier at home, 1.0 = league average. */
  homeAttack?: number;
  /** Goals-conceded multiplier at home relative to away-side scoring. */
  homeDefence?: number;
  /** Goals-scored multiplier away, 1.0 = league average. */
  awayAttack?: number;
  /** Goals-conceded multiplier away relative to home-side scoring. */
  awayDefence?: number;
  /** League average home goals per game. */
  leagueAvgHomeGoals?: number;
  /** League average away goals per game. */
  leagueAvgAwayGoals?: number;
  /** Home team table position, used for the reasoning string. */
  homeRank?: number | null;
  /** Away team table position, used for the reasoning string. */
  awayRank?: number | null;
  /** Home goals per game at home, used for the reasoning string. */
  homeScoringRate?: number | null;
  /** Away goals per game on the road, used for the reasoning string. */
  awayScoringRate?: number | null;
  /** Home goals conceded per game at home, used for the reasoning string. */
  homeConcedingRate?: number | null;
  /** Away goals conceded per game on the road, used for the reasoning string. */
  awayConcedingRate?: number | null;
}

export interface PredictionResult {
  home: number;
  draw: number;
  away: number;
  pick: "1" | "X" | "2";
  confidence: "HIGH" | "MEDIUM" | "DRAW_ALERT" | "LOW";
  confidenceScore: number;
  model: string;
  reasoning: string;
}

export declare function generatePrediction(options?: PredictionOptions): PredictionResult;

export declare const MODEL_NAME: string;

export declare const DEFAULT_LEAGUE_AVG_HOME_GOALS: number;

export declare const DEFAULT_LEAGUE_AVG_AWAY_GOALS: number;
