import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_LEAGUE_AVG_AWAY_GOALS,
  DEFAULT_LEAGUE_AVG_HOME_GOALS,
  generatePrediction,
  MODEL_NAME,
} from "../src/data/predict.mjs";
import { computeLeagueStrengths, createWeek } from "./refresh-matches.mjs";

const now = new Date("2026-11-03T00:00:00.000Z");

function sum(prediction) {
  return prediction.home + prediction.draw + prediction.away;
}

test("neutral prior with no standings: valid probabilities, home edge, honest reasoning", () => {
  const prediction = generatePrediction();

  assert.ok(prediction.home > 0 && prediction.home < 1);
  assert.ok(prediction.draw > 0 && prediction.draw < 1);
  assert.ok(prediction.away > 0 && prediction.away < 1);
  assert.ok(Math.abs(sum(prediction) - 1) < 0.02, `probabilities sum to ~1, got ${sum(prediction)}`);
  assert.ok(prediction.home > prediction.away, "league-average home advantage favours the home side");
  assert.equal(prediction.model, MODEL_NAME);
  assert.match(prediction.reasoning, /no standings/);
  assert.match(prediction.reasoning, /Expected goals/);
});

test("strong home side against weak away defence yields a HIGH home pick", () => {
  const prediction = generatePrediction({
    homeAttack: 1.6,
    homeDefence: 0.7,
    awayAttack: 0.6,
    awayDefence: 1.5,
    homeRank: 1,
    awayRank: 15,
  });

  assert.equal(prediction.pick, "1");
  assert.ok(prediction.home >= 0.55, `expected dominant home probability, got ${prediction.home}`);
  assert.equal(prediction.confidence, "HIGH");
  assert.match(prediction.reasoning, /1st/);
  assert.match(prediction.reasoning, /15th/);
});

test("low-scoring evenly matched sides flag DRAW_ALERT", () => {
  const prediction = generatePrediction({
    leagueAvgHomeGoals: 1.0,
    leagueAvgAwayGoals: 1.0,
  });

  assert.ok(prediction.draw >= 0.3, `expected a sizeable draw probability, got ${prediction.draw}`);
  assert.equal(prediction.confidence, "DRAW_ALERT");
});

test("extreme inputs stay normalised thanks to the lambda clamp", () => {
  const prediction = generatePrediction({
    homeAttack: 10,
    awayDefence: 10,
    awayAttack: 10,
    homeDefence: 10,
  });

  assert.ok(Math.abs(sum(prediction) - 1) < 0.02);
  assert.ok(prediction.home < 1 && prediction.away >= 0);
});

test("computeLeagueStrengths parses v4 standings with home/away splits", () => {
  const payload = {
    standings: [{
      type: "TOTAL",
      table: [
        {
          position: 1,
          team: { name: "Arsenal" },
          playedGames: 4,
          goalsFor: 8,
          goalsAgainst: 2,
          home: { played: 2, goalsFor: 6, goalsAgainst: 1 },
          away: { played: 2, goalsFor: 2, goalsAgainst: 1 },
        },
        {
          position: 2,
          team: { name: "Chelsea" },
          playedGames: 4,
          goalsFor: 4,
          goalsAgainst: 4,
          home: { played: 2, goalsFor: 3, goalsAgainst: 2 },
          away: { played: 2, goalsFor: 1, goalsAgainst: 2 },
        },
      ],
    }],
  };

  const league = computeLeagueStrengths(payload);
  assert.notEqual(league, null);
  // Two teams, 2 home games each: avg home goals = (6+3)/4 = 2.25, away = (2+1)/4 = 0.75.
  assert.ok(Math.abs(league.avgHomeGoals - 2.25) < 1e-9);
  assert.ok(Math.abs(league.avgAwayGoals - 0.75) < 1e-9);

  const arsenal = league.teams.get("arsenal");
  assert.equal(arsenal.rank, 1);
  assert.equal(arsenal.homeScoringRate, 3);
  // Raw home attack (6/2)/2.25 = 1.333 shrunk with weight 2/(2+6) = 0.25 -> 1.0833.
  assert.ok(Math.abs(arsenal.homeAttack - (1 + (4 / 3 - 1) * 0.25)) < 1e-9);
});

test("computeLeagueStrengths falls back to totals when home/away splits are missing", () => {
  const payload = {
    standings: [{
      table: [{
        position: 1,
        team: { name: "Arsenal" },
        playedGames: 4,
        goalsFor: 8,
        goalsAgainst: 2,
      }],
    }],
  };

  const league = computeLeagueStrengths(payload);
  assert.notEqual(league, null);
  const arsenal = league.teams.get("arsenal");
  // Totals split evenly: 2 home games, 4 goals for at home -> 2.0/game.
  assert.equal(arsenal.homeScoringRate, 2);
  assert.equal(arsenal.awayScoringRate, 2);
});

test("computeLeagueStrengths returns null for empty or malformed payloads", () => {
  assert.equal(computeLeagueStrengths({ standings: [] }), null);
  assert.equal(computeLeagueStrengths({}), null);
  assert.equal(computeLeagueStrengths({ standings: [{ table: [] }] }), null);
});

test("createWeek predictions use standings when provided and neutral prior when not", () => {
  const apiMatch = {
    id: "m1",
    utcDate: "2026-11-07T15:00:00.000Z",
    status: "TIMED",
    competition: { code: "PL", name: "Premier League" },
    homeTeam: { name: "Arsenal" },
    awayTeam: { name: "Chelsea" },
    season: { startDate: "2026-08-01" },
  };
  const standings = computeLeagueStrengths({
    standings: [{
      table: [
        {
          position: 1,
          team: { name: "Arsenal" },
          playedGames: 4, goalsFor: 8, goalsAgainst: 2,
          home: { played: 2, goalsFor: 6, goalsAgainst: 1 },
          away: { played: 2, goalsFor: 2, goalsAgainst: 1 },
        },
        {
          position: 2,
          team: { name: "Chelsea" },
          playedGames: 4, goalsFor: 4, goalsAgainst: 4,
          home: { played: 2, goalsFor: 3, goalsAgainst: 2 },
          away: { played: 2, goalsFor: 1, goalsAgainst: 2 },
        },
      ],
    }],
  });
  const index = new Map([["PL", standings]]);

  const withStandings = createWeek([apiMatch], now, index);
  assert.equal(withStandings.matches[0].prediction.pick, "1");
  assert.match(withStandings.matches[0].prediction.reasoning, /1st/);

  const neutral = createWeek([apiMatch], now, null);
  assert.match(neutral.matches[0].prediction.reasoning, /no standings/);
  assert.ok(Math.abs(sum(neutral.matches[0].prediction) - 1) < 0.02);
});

test("default league averages are sensible European rates", () => {
  assert.ok(DEFAULT_LEAGUE_AVG_HOME_GOALS > DEFAULT_LEAGUE_AVG_AWAY_GOALS);
  assert.ok(DEFAULT_LEAGUE_AVG_HOME_GOALS + DEFAULT_LEAGUE_AVG_AWAY_GOALS > 2);
  assert.ok(DEFAULT_LEAGUE_AVG_HOME_GOALS + DEFAULT_LEAGUE_AVG_AWAY_GOALS < 4);
});
