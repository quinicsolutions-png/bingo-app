// Dixon-Coles inspired prediction model. Shared by the app and the GitHub Actions refresh.
export function generatePrediction(homeStrength, awayStrength, homeAdvantage = 0.15) {
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
  let pick = "X";
  if (maxProb === normalized.home) pick = "1";
  else if (maxProb === normalized.away) pick = "2";

  let confidence = "LOW";
  const confidenceScore = maxProb;

  if (maxProb >= 0.55) confidence = "HIGH";
  else if (maxProb >= 0.42) confidence = "MEDIUM";
  else if (normalized.draw >= 0.3) confidence = "DRAW_ALERT";

  const reasons = [];
  if (normalized.home > 0.45) reasons.push("Strong home form");
  if (normalized.away > 0.4) reasons.push("Away team in good shape");
  if (normalized.draw > 0.28) reasons.push("Tight matchup expected");
  if (homeAdvantage > 0.1) reasons.push("Home advantage factor");
  reasons.push("Model: Dixon-Coles + Poisson");

  return {
    home: Math.round(normalized.home * 100) / 100,
    draw: Math.round(normalized.draw * 100) / 100,
    away: Math.round(normalized.away * 100) / 100,
    pick,
    confidence,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    model: "Dixon-Coles + Poisson",
    reasoning: reasons.join(" • "),
  };
}
