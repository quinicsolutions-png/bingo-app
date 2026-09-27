export function generatePrediction(
  homeStrength: number,
  awayStrength: number,
  homeAdvantage?: number,
): {
  home: number;
  draw: number;
  away: number;
  pick: "1" | "X" | "2";
  confidence: "HIGH" | "MEDIUM" | "DRAW_ALERT" | "LOW";
  confidenceScore: number;
  model: string;
  reasoning: string;
};
