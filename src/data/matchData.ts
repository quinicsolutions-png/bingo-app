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

// Dixon-Coles inspired prediction model
function generatePrediction(homeStrength: number, awayStrength: number, homeAdvantage: number = 0.15): Prediction {
  const homeAttack = homeStrength + homeAdvantage;
  const awayAttack = awayStrength;
  
  const lambdaHome = Math.max(0.3, homeAttack * 1.4 + 0.2);
  const lambdaAway = Math.max(0.3, awayAttack * 1.2);
  
  const totalExpected = lambdaHome + lambdaAway;
  const homeProb = Math.min(0.75, Math.max(0.1, lambdaHome / totalExpected + 0.05));
  const awayProb = Math.min(0.65, Math.max(0.08, lambdaAway / totalExpected - 0.02));
  const drawProb = Math.max(0.1, 1 - homeProb - awayProb);
  
  const total = homeProb + drawProb + awayProb;
  const normalized = {
    home: homeProb / total,
    draw: drawProb / total,
    away: awayProb / total,
  };
  
  const maxProb = Math.max(normalized.home, normalized.draw, normalized.away);
  let pick: '1' | 'X' | '2' = 'X';
  if (maxProb === normalized.home) pick = '1';
  else if (maxProb === normalized.away) pick = '2';
  
  let confidence: Prediction['confidence'] = 'LOW';
  let confidenceScore = maxProb;
  
  if (maxProb >= 0.55) confidence = 'HIGH';
  else if (maxProb >= 0.42) confidence = 'MEDIUM';
  else if (normalized.draw >= 0.30) confidence = 'DRAW_ALERT';
  
  const reasons = [];
  if (normalized.home > 0.45) reasons.push('Strong home form');
  if (normalized.away > 0.40) reasons.push('Away team in good shape');
  if (normalized.draw > 0.28) reasons.push('Tight matchup expected');
  if (homeAdvantage > 0.1) reasons.push('Home advantage factor');
  reasons.push(`Model: Dixon-Coles + Poisson`);
  
  return {
    home: Math.round(normalized.home * 100) / 100,
    draw: Math.round(normalized.draw * 100) / 100,
    away: Math.round(normalized.away * 100) / 100,
    pick,
    confidence,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    model: 'Dixon-Coles + Poisson',
    reasoning: reasons.join(' • '),
  };
}

// Active Week Data
export const ACTIVE_WEEK: JackpotWeek = {
  id: 'week-38',
  label: 'Matchday 38 — Premier League',
  status: 'active',
  cutoffTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  totalMatches: 13,
  score: null,
  settledAt: null,
  matches: [
    {
      id: 'm1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeShort: 'ARS', awayShort: 'CHE',
      league: 'Premier League', leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 38, season: '2025/26',
      prediction: generatePrediction(0.75, 0.55), result: null,
    },
    {
      id: 'm2', homeTeam: 'Manchester City', awayTeam: 'Liverpool', homeShort: 'MCI', awayShort: 'LIV',
      league: 'Premier League', leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 38, season: '2025/26',
      prediction: generatePrediction(0.72, 0.70), result: null,
    },
    {
      id: 'm3', homeTeam: 'Manchester United', awayTeam: 'Tottenham', homeShort: 'MUN', awayShort: 'TOT',
      league: 'Premier League', leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 38, season: '2025/26',
      prediction: generatePrediction(0.55, 0.50), result: null,
    },
    {
      id: 'm4', homeTeam: 'Newcastle', awayTeam: 'Aston Villa', homeShort: 'NEW', awayShort: 'AVL',
      league: 'Premier League', leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 38, season: '2025/26',
      prediction: generatePrediction(0.60, 0.52), result: null,
    },
    {
      id: 'm5', homeTeam: 'Brighton', awayTeam: 'West Ham', homeShort: 'BHA', awayShort: 'WHU',
      league: 'Premier League', leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 38, season: '2025/26',
      prediction: generatePrediction(0.58, 0.40), result: null,
    },
    {
      id: 'm6', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', homeShort: 'RMA', awayShort: 'BAR',
      league: 'La Liga', leagueIcon: '🇪🇸', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 34, season: '2025/26',
      prediction: generatePrediction(0.68, 0.65), result: null,
    },
    {
      id: 'm7', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', homeShort: 'BAY', awayShort: 'BVB',
      league: 'Bundesliga', leagueIcon: '🇩🇪', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 32, season: '2025/26',
      prediction: generatePrediction(0.73, 0.55), result: null,
    },
    {
      id: 'm8', homeTeam: 'PSG', awayTeam: 'Marseille', homeShort: 'PSG', awayShort: 'OM',
      league: 'Ligue 1', leagueIcon: '🇫🇷', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 33, season: '2025/26',
      prediction: generatePrediction(0.78, 0.42), result: null,
    },
    {
      id: 'm9', homeTeam: 'Juventus', awayTeam: 'AC Milan', homeShort: 'JUV', awayShort: 'MIL',
      league: 'Serie A', leagueIcon: '🇮🇹', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 35, season: '2025/26',
      prediction: generatePrediction(0.52, 0.50), result: null,
    },
    {
      id: 'm10', homeTeam: 'Ajax', awayTeam: 'PSV', homeShort: 'AJX', awayShort: 'PSV',
      league: 'Eredivisie', leagueIcon: '🇳🇱', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 33, season: '2025/26',
      prediction: generatePrediction(0.48, 0.55), result: null,
    },
    {
      id: 'm11', homeTeam: 'Inter Milan', awayTeam: 'Napoli', homeShort: 'INT', awayShort: 'NAP',
      league: 'Serie A', leagueIcon: '🇮🇹', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 35, season: '2025/26',
      prediction: generatePrediction(0.62, 0.58), result: null,
    },
    {
      id: 'm12', homeTeam: 'Atletico Madrid', awayTeam: 'Sevilla', homeShort: 'ATM', awayShort: 'SEV',
      league: 'La Liga', leagueIcon: '🇪🇸', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 34, season: '2025/26',
      prediction: generatePrediction(0.65, 0.38), result: null,
    },
    {
      id: 'm13', homeTeam: 'Leicester', awayTeam: 'Everton', homeShort: 'LEI', awayShort: 'EVE',
      league: 'Premier League', leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', kickoff: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled', matchday: 38, season: '2025/26',
      prediction: generatePrediction(0.50, 0.42), result: null,
    },
  ],
};

// Historical weeks
export const HISTORY_WEEKS: JackpotWeek[] = [
  {
    id: 'week-37', label: 'Matchday 37 — Premier League', status: 'settled',
    cutoffTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalMatches: 13, score: 9, settledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    matches: ACTIVE_WEEK.matches.map((m, i) => ({
      ...m,
      result: { homeGoals: Math.floor(Math.random() * 4), awayGoals: Math.floor(Math.random() * 3), outcome: '1' as const, correct: i < 9 },
    })),
  },
  {
    id: 'week-36', label: 'Matchday 36 — Premier League', status: 'settled',
    cutoffTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    totalMatches: 13, score: 8, settledAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    matches: ACTIVE_WEEK.matches.map((m, i) => ({
      ...m,
      result: { homeGoals: Math.floor(Math.random() * 4), awayGoals: Math.floor(Math.random() * 3), outcome: '1' as const, correct: i < 8 },
    })),
  },
  {
    id: 'week-35', label: 'Matchday 35 — Premier League', status: 'settled',
    cutoffTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    totalMatches: 13, score: 10, settledAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    matches: ACTIVE_WEEK.matches.map((m, i) => ({
      ...m,
      result: { homeGoals: Math.floor(Math.random() * 4), awayGoals: Math.floor(Math.random() * 3), outcome: '1' as const, correct: i < 10 },
    })),
  },
  {
    id: 'week-34', label: 'Matchday 34 — Premier League', status: 'settled',
    cutoffTime: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    totalMatches: 13, score: 7, settledAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    matches: ACTIVE_WEEK.matches.map((m, i) => ({
      ...m,
      result: { homeGoals: Math.floor(Math.random() * 4), awayGoals: Math.floor(Math.random() * 3), outcome: '1' as const, correct: i < 7 },
    })),
  },
];

export const PLATFORM_STATS = {
  totalPredictions: 442,
  correctPredictions: 296,
  overallAccuracy: 66.9,
  highConfidenceAccuracy: 74.2,
  weeksTracked: 34,
  leaguesCovered: 5,
  modelVersion: '2.1.0',
  lastUpdated: new Date().toISOString(),
};
