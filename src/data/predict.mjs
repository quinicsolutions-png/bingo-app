// Dixon-Coles + Poisson prediction model. Shared by the app and the GitHub Actions refresh.
//
// Team strengths come from league standings: goals scored/conceded per game,
// home and away, shrunk toward the league mean for small samples. Match
// probabilities come from a Poisson score matrix with the Dixon-Coles
// low-score correction. When standings are unavailable the model falls back
// to league-average scoring rates: a neutral prior plus home advantage.

export const MODEL_NAME = "Dixon-Coles + Poisson";

// Typical European top-flight rates, used when no standings are available.
export const DEFAULT_LEAGUE_AVG_HOME_GOALS = 1.5;
export const DEFAULT_LEAGUE_AVG_AWAY_GOALS = 1.2;

// Dixon-Coles low-score dependence. Negative rho boosts 0-0/1-1 and trims
// 1-0/0-1 slightly, which plain independent Poisson under/over-estimates.
const RHO = -0.08;

// Score matrix cutoff; P(more than 10 goals) is negligible for these rates.
const MAX_GOALS = 10;

// Clamp expected goals so extreme inputs cannot blow up the matrix.
const MIN_LAMBDA = 0.2;
const MAX_LAMBDA = 4.5;

// Shrinkage toward 1.0 for teams that have played few matches.
const SHRINKAGE_MATCHES = 6;

function poissonPmf(lambda, upTo) {
  const probabilities = [Math.exp(-lambda)];
  for (let k = 1; k <= upTo; k += 1) {
    probabilities.push((probabilities[k - 1] * lambda) / k);
  }
  return probabilities;
}

function tauAdjustment(homeGoals, awayGoals, lambdaHome, lambdaAway) {
  if (homeGoals === 0 && awayGoals === 0) return 1 - lambdaHome * lambdaAway * RHO;
  if (homeGoals === 0 && awayGoals === 1) return 1 + lambdaHome * RHO;
  if (homeGoals === 1 && awayGoals === 0) return 1 + lambdaAway * RHO;
  if (homeGoals === 1 && awayGoals === 1) return 1 - RHO;
  return 1;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Predict a single match.
 *
 * All strength inputs are multipliers around 1.0 (1.0 = league average) and
 * default to neutral, so calling with no options yields the league-average
 * prior. Ranks and per-game rates are optional and only feed the reasoning
 * string shown in the UI.
 */
export function generatePrediction({
  homeAttack = 1,
  homeDefence = 1,
  awayAttack = 1,
  awayDefence = 1,
  leagueAvgHomeGoals = DEFAULT_LEAGUE_AVG_HOME_GOALS,
  leagueAvgAwayGoals = DEFAULT_LEAGUE_AVG_AWAY_GOALS,
  homeRank = null,
  awayRank = null,
  homeScoringRate = null,
  awayScoringRate = null,
  homeConcedingRate = null,
  awayConcedingRate = null,
} = {}) {
  const lambdaHome = clamp(
    leagueAvgHomeGoals * homeAttack * awayDefence,
    MIN_LAMBDA,
    MAX_LAMBDA,
  );
  const lambdaAway = clamp(
    leagueAvgAwayGoals * awayAttack * homeDefence,
    MIN_LAMBDA,
    MAX_LAMBDA,
  );

  const homePmf = poissonPmf(lambdaHome, MAX_GOALS);
  const awayPmf = poissonPmf(lambdaAway, MAX_GOALS);

  let home = 0;
  let draw = 0;
  let away = 0;
  for (let hg = 0; hg <= MAX_GOALS; hg += 1) {
    for (let ag = 0; ag <= MAX_GOALS; ag += 1) {
      const probability =
        homePmf[hg] * awayPmf[ag] * tauAdjustment(hg, ag, lambdaHome, lambdaAway);
      if (hg > ag) home += probability;
      else if (hg === ag) draw += probability;
      else away += probability;
    }
  }
  // The tau adjustment perturbs the matrix slightly; renormalise to 1.
  const total = home + draw + away;

  const normalized = {
    home: home / total,
    draw: draw / total,
    away: away / total,
  };

  const maxProb = Math.max(normalized.home, normalized.draw, normalized.away);
  let pick = "X";
  if (maxProb === normalized.home) pick = "1";
  else if (maxProb === normalized.away) pick = "2";

  let confidence = "LOW";
  if (maxProb >= 0.55) confidence = "HIGH";
  else if (maxProb >= 0.42) confidence = "MEDIUM";
  else if (normalized.draw >= 0.3) confidence = "DRAW_ALERT";

  const reasons = [];
  if (homeRank != null) reasons.push(`Home side sit ${ordinal(homeRank)} in the table`);
  if (awayRank != null) reasons.push(`Away side sit ${ordinal(awayRank)} in the table`);
  if (homeScoringRate != null) reasons.push(`Home score ${homeScoringRate.toFixed(1)}/game at home`);
  if (awayConcedingRate != null) reasons.push(`Away concede ${awayConcedingRate.toFixed(1)}/game on the road`);
  if (awayScoringRate != null && awayScoringRate >= 1.6) reasons.push("Away side score freely on the road");
  if (homeAttack > 1.15 && awayDefence > 1.15) reasons.push("Strong home attack meets leaky away defence");
  if (awayAttack > 1.15 && homeDefence > 1.15) reasons.push("Away attack threatens a home defence that concedes");
  if (Math.abs(homeAttack * homeDefence - awayAttack * awayDefence) < 0.1) {
    reasons.push("Evenly matched sides");
  }
  if (homeRank == null && awayRank == null && homeScoringRate == null) {
    reasons.push("League-average prior (no standings available)");
  }
  reasons.push(`Expected goals ${lambdaHome.toFixed(1)} – ${lambdaAway.toFixed(1)}`);
  reasons.push(`Model: ${MODEL_NAME}`);

  return {
    home: Math.round(normalized.home * 100) / 100,
    draw: Math.round(normalized.draw * 100) / 100,
    away: Math.round(normalized.away * 100) / 100,
    pick,
    confidence,
    confidenceScore: Math.round(maxProb * 100) / 100,
    model: MODEL_NAME,
    reasoning: reasons.join(" • "),
  };
}

function ordinal(rank) {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = rank % 100;
  const suffix = suffixes[(remainder - 20) % 10] ?? suffixes[remainder] ?? suffixes[0];
  return `${rank}${suffix}`;
}
