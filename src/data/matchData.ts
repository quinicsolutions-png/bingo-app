// MatchIQ Data Layer
// Uses mock data simulating football-data.org free API responses
// In production, replace with actual API calls to football-data.org

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeShort: string;
  awayShort: string;
  league: string;
  leagueIcon: string;
  kickoff: string; // ISO datetime
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  matchday: number;
  season: string;
  // Prediction data
  prediction: Prediction | null;
  result: MatchResult | null;
}

export interface Prediction {
  home: number; // probability 0-1
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

export interface PredictionRule {
  id: string;
  name: string;
  description: string;
  confidence: number;
  hitRate: number;
  sampleSize: number;
  category: 'form' | 'h2h' | 'stats' | 'context';
  isActive: boolean;
}

// Open-source data sources used
export const DATA_SOURCES = [
  {
    name: 'football-data.org',
    url: 'https://www.football-data.org/',
    license: 'Free tier: 10 req/min, 12 competitions',
    type: 'Fixtures, Results, Standings'
  },
  {
    name: 'openfootball/awesome-football',
    url: 'https://github.com/openfootball/awesome-football',
    license: 'Public Domain / CC0',
    type: 'Historical datasets, team data'
  },
  {
    name: 'DK3yyyy/football_predictor',
    url: 'https://github.com/dk3yyyy/football_predictor',
    license: 'MIT',
    type: 'XGBoost + Poisson ML pipeline'
  },
  {
    name: 'DOsinga/football_predictions',
    url: 'https://github.com/DOsinga/football_predictions',
    license: 'MIT',
    type: 'Dixon-Coles prediction model'
  },
  {
    name: 'FootballGPT/football-ai',
    url: 'https://github.com/FootballGPT/football-ai',
    license: 'MIT',
    type: 'AI prediction engine'
  },
];

// Generate mock matches with predictions
function generatePrediction(homeStrength: number, awayStrength: number, homeAdvantage: number = 0.15): Prediction {
  // Simplified Dixon-Coles inspired model
  const homeAttack = homeStrength + homeAdvantage;
  const awayAttack = awayStrength;
  
  // Expected goals (Poisson parameter)
  const lambdaHome = Math.max(0.3, homeAttack * 1.4 + 0.2);
  const lambdaAway = Math.max(0.3, awayAttack * 1.2);
  
  // Convert to probabilities using Poisson distribution approximation
  const totalExpected = lambdaHome + lambdaAway;
  const homeProb = Math.min(0.75, Math.max(0.1, lambdaHome / totalExpected + 0.05));
  const awayProb = Math.min(0.65, Math.max(0.08, lambdaAway / totalExpected - 0.02));
  const drawProb = Math.max(0.1, 1 - homeProb - awayProb);
  
  // Normalize
  const total = homeProb + drawProb + awayProb;
  const normalized = {
    home: homeProb / total,
    draw: drawProb / total,
    away: awayProb / total,
  };
  
  // Determine pick
  const maxProb = Math.max(normalized.home, normalized.draw, normalized.away);
  let pick: '1' | 'X' | '2' = 'X';
  if (maxProb === normalized.home) pick = '1';
  else if (maxProb === normalized.away) pick = '2';
  
  // Confidence
  let confidence: Prediction['confidence'] = 'LOW';
  let confidenceScore = maxProb;
  
  if (maxProb >= 0.55) confidence = 'HIGH';
  else if (maxProb >= 0.42) confidence = 'MEDIUM';
  else if (normalized.draw >= 0.30) confidence = 'DRAW_ALERT';
  
  // Generate reasoning
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

// Mock data: Active Jackpot Week
export const ACTIVE_WEEK: JackpotWeek = {
  id: 'week-38',
  label: 'Matchday 38 — Premier League',
  status: 'active',
  cutoffTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  totalMatches: 10,
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
  ],
};

// Historical weeks with results
export const HISTORY_WEEKS: JackpotWeek[] = [
  {
    id: 'week-37', label: 'Matchday 37 — Premier League', status: 'settled',
    cutoffTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalMatches: 10, score: 7, settledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    matches: [
      { ...ACTIVE_WEEK.matches[0], result: { homeGoals: 2, awayGoals: 1, outcome: '1', correct: true }, prediction: { ...ACTIVE_WEEK.matches[0].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[1], result: { homeGoals: 1, awayGoals: 1, outcome: 'X', correct: false }, prediction: { ...ACTIVE_WEEK.matches[1].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[2], result: { homeGoals: 3, awayGoals: 0, outcome: '1', correct: true }, prediction: { ...ACTIVE_WEEK.matches[2].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[3], result: { homeGoals: 2, awayGoals: 2, outcome: 'X', correct: false }, prediction: { ...ACTIVE_WEEK.matches[3].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[4], result: { homeGoals: 1, awayGoals: 0, outcome: '1', correct: true }, prediction: { ...ACTIVE_WEEK.matches[4].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[5], result: { homeGoals: 2, awayGoals: 1, outcome: '1', correct: true }, prediction: { ...ACTIVE_WEEK.matches[5].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[6], result: { homeGoals: 3, awayGoals: 1, outcome: '1', correct: true }, prediction: { ...ACTIVE_WEEK.matches[6].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[7], result: { homeGoals: 0, awayGoals: 0, outcome: 'X', correct: false }, prediction: { ...ACTIVE_WEEK.matches[7].prediction!, pick: '1' } },
      { ...ACTIVE_WEEK.matches[8], result: { homeGoals: 1, awayGoals: 2, outcome: '2', correct: true }, prediction: { ...ACTIVE_WEEK.matches[8].prediction!, pick: '2' } },
      { ...ACTIVE_WEEK.matches[9], result: { homeGoals: 2, awayGoals: 3, outcome: '2', correct: true }, prediction: { ...ACTIVE_WEEK.matches[9].prediction!, pick: '2' } },
    ],
  },
  {
    id: 'week-36', label: 'Matchday 36 — Premier League', status: 'settled',
    cutoffTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    totalMatches: 10, score: 6, settledAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    matches: ACTIVE_WEEK.matches.map(m => ({
      ...m,
      result: { homeGoals: Math.floor(Math.random() * 4), awayGoals: Math.floor(Math.random() * 3), outcome: '1' as const, correct: Math.random() > 0.4 },
    })),
  },
  {
    id: 'week-35', label: 'Matchday 35 — Premier League', status: 'settled',
    cutoffTime: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    totalMatches: 10, score: 8, settledAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    matches: ACTIVE_WEEK.matches.map(m => ({
      ...m,
      result: { homeGoals: Math.floor(Math.random() * 4), awayGoals: Math.floor(Math.random() * 3), outcome: '1' as const, correct: Math.random() > 0.3 },
    })),
  },
];

// Prediction rules/methodology
export const RULES: PredictionRule[] = [
  {
    id: 'r1', name: 'Home Advantage Factor', category: 'stats',
    description: 'Home teams win ~46% of matches in top-5 European leagues. This baseline is adjusted by team strength.',
    confidence: 0.82, hitRate: 0.68, sampleSize: 15000, isActive: true,
  },
  {
    id: 'r2', name: 'Recent Form (Last 5)', category: 'form',
    description: 'Teams on winning streaks (3+ wins in last 5) have 12% higher win probability than their baseline.',
    confidence: 0.74, hitRate: 0.61, sampleSize: 8500, isActive: true,
  },
  {
    id: 'r3', name: 'Head-to-Head Dominance', category: 'h2h',
    description: 'When one team has won 4+ of last 5 H2H meetings, they win 58% of the next encounter.',
    confidence: 0.68, hitRate: 0.58, sampleSize: 4200, isActive: true,
  },
  {
    id: 'r4', name: 'Goal Difference Momentum', category: 'stats',
    description: 'Teams with GD > +15 in the season have 15% higher probability of winning any given match.',
    confidence: 0.71, hitRate: 0.63, sampleSize: 6000, isActive: true,
  },
  {
    id: 'r5', name: 'Draw Probability in Top Clashes', category: 'context',
    description: 'Matches between top-6 teams have 28% draw probability vs. 24% league average.',
    confidence: 0.65, hitRate: 0.55, sampleSize: 3200, isActive: true,
  },
  {
    id: 'r6', name: 'Poisson Goal Distribution', category: 'stats',
    description: 'Football goals follow a Poisson distribution. Expected goals (xG) models predict score probabilities.',
    confidence: 0.79, hitRate: 0.64, sampleSize: 12000, isActive: true,
  },
  {
    id: 'r7', name: 'Dixon-Coles Model', category: 'stats',
    description: 'Bivariate Poisson model accounting for correlation between home and away scoring. Gold standard for football prediction.',
    confidence: 0.85, hitRate: 0.66, sampleSize: 20000, isActive: true,
  },
  {
    id: 'r8', name: 'Midweek Fatigue Factor', category: 'context',
    description: 'Teams playing their 2nd match in 4 days show 8% performance drop, especially away from home.',
    confidence: 0.58, hitRate: 0.52, sampleSize: 2800, isActive: true,
  },
];

// Stats for the dashboard
export const PLATFORM_STATS = {
  totalPredictions: 340,
  correctPredictions: 218,
  overallAccuracy: 64.1,
  highConfidenceAccuracy: 72.3,
  weeksTracked: 35,
  leaguesCovered: 5,
  modelVersion: '2.1.0',
  lastUpdated: new Date().toISOString(),
};
