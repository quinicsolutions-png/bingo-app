import assert from "node:assert/strict";
import test from "node:test";
import {
  compareFeeds,
  mapTubetFixtures,
  refreshData,
} from "./refresh-matches.mjs";

const now = new Date("2026-09-27T00:00:00.000Z");

function tubetFixture(overrides = {}) {
  return {
    date: "2026-09-28",
    team1: { name: "Arsenal", code: "ARS" },
    team2: { name: "Chelsea", code: "CHE" },
    ...overrides,
  };
}

test("maps Tubet fixtures, result scores, and matchday into the existing match shape", () => {
  const [match] = mapTubetFixtures({
    rounds: [{
      name: "Matchday 4",
      matches: [tubetFixture({ date: "2026-09-20", score1: 2, score2: 1 })],
    }],
  }, { now });

  assert.equal(match.status, "FINISHED");
  assert.equal(match.matchday, 4);
  assert.equal(match.competition.code, "PL");
  assert.equal(match.score.fullTime.home, 2);
  assert.equal(match.score.fullTime.away, 1);
});

test("rejects empty, partial-score, duplicate, and malformed Tubet feeds", () => {
  assert.throws(() => mapTubetFixtures({ rounds: [] }), /no fixtures/);
  assert.throws(
    () => mapTubetFixtures({ rounds: [{ matches: [tubetFixture({ score1: 1 })] }] }),
    /partial score/,
  );
  assert.throws(
    () => mapTubetFixtures({ rounds: [{ matches: [tubetFixture(), tubetFixture()] }] }),
    /Duplicate Tubet fixture/,
  );
  assert.throws(
    () => mapTubetFixtures({ rounds: [{ matches: [{ ...tubetFixture(), team1: {} }] }] }),
    /valid date or team name/,
  );
});

test("reconciles Tubet results to saved predictions using fixture identity", () => {
  const [tubetMatch] = mapTubetFixtures({
    rounds: [{
      name: "Matchday 3",
      matches: [tubetFixture({ date: "2026-09-20", score1: 2, score2: 1 })],
    }],
  }, { now });
  const prediction = {
    home: 0.5,
    draw: 0.25,
    away: 0.25,
    pick: "1",
    confidence: "HIGH",
    confidenceScore: 0.5,
    model: "test",
    reasoning: "test",
  };
  const slate = {
    generatedAt: null,
    week: {
      id: "existing-week",
      label: "Old label",
      status: "active",
      cutoffTime: "2026-09-20T00:00:00.000Z",
      matches: [{
        id: "football-data-id",
        homeTeam: "Arsenal",
        awayTeam: "Chelsea",
        kickoff: "2026-09-20T15:00:00.000Z",
        prediction,
      }],
      score: null,
      totalMatches: 1,
      settledAt: null,
    },
  };

  const next = refreshData({ apiMatches: [tubetMatch], slate, history: { weeks: [] }, now });
  assert.equal(next.history.weeks[0].status, "settled");
  assert.deepEqual(next.history.weeks[0].matches[0].prediction, prediction);
  assert.equal(next.history.weeks[0].matches[0].result.correct, true);
});

test("reports fixture overlap and score availability without changing the feeds", () => {
  const [tubetMatch] = mapTubetFixtures({
    rounds: [{ matches: [tubetFixture({ date: "2026-09-20", score1: 2, score2: 1 })] }],
  }, { now });
  const footballDataMatch = {
    ...tubetMatch,
    id: "provider-id",
    utcDate: "2026-09-20T15:00:00.000Z",
  };
  const before = structuredClone(footballDataMatch);

  assert.deepEqual(compareFeeds([footballDataMatch], [tubetMatch]), {
    primaryFixtures: 1,
    tubetFixtures: 1,
    matchedFixtures: 1,
    scoreAvailabilityMatches: 1,
  });
  assert.deepEqual(footballDataMatch, before);
});
