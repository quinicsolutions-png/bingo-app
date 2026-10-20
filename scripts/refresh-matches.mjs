import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generatePrediction } from "../src/data/predict.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SLATE_PATH = join(ROOT, "public/data/slate.json");
const HISTORY_PATH = join(ROOT, "public/data/history.json");
const SLATE_SIZE = 13;

const LEAGUE_ICONS = {
  PL: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  ELC: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  PD: "🇪🇸",
  BL1: "🇩🇪",
  SA: "🇮🇹",
  FL1: "🇫🇷",
  DED: "🇳🇱",
  PPL: "🇵🇹",
  BSA: "🇧🇷",
  CL: "🇪🇺",
  EC: "🇪🇺",
  WC: "🌍",
};

export function strengthFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 33 + name.charCodeAt(i)) >>> 0;
  }
  return 0.4 + (hash % 35) / 100;
}

export function mapStatus(apiStatus) {
  if (apiStatus === "FINISHED" || apiStatus === "AWARDED") return "finished";
  if (apiStatus === "IN_PLAY" || apiStatus === "PAUSED" || apiStatus === "LIVE") return "live";
  if (apiStatus === "POSTPONED" || apiStatus === "SUSPENDED" || apiStatus === "CANCELLED") return "postponed";
  return "scheduled";
}

function shortName(team) {
  if (team?.tla) return team.tla;
  const name = team?.shortName || team?.name || "";
  return name.slice(0, 3).toUpperCase();
}

function seasonLabel(startDate) {
  if (!startDate || startDate.length < 4) return "";
  const year = Number(startDate.slice(0, 4));
  if (!Number.isFinite(year)) return "";
  return `${year}/${String(year + 1).slice(2)}`;
}

export function outcomeFromScore(homeGoals, awayGoals) {
  if (homeGoals > awayGoals) return "1";
  if (homeGoals < awayGoals) return "2";
  return "X";
}

function resultFromApi(apiMatch, prediction) {
  const status = mapStatus(apiMatch.status);
  const homeGoals = apiMatch.score?.fullTime?.home;
  const awayGoals = apiMatch.score?.fullTime?.away;
  if (status !== "finished" || homeGoals == null || awayGoals == null || !prediction) return null;
  const outcome = outcomeFromScore(homeGoals, awayGoals);
  return {
    homeGoals,
    awayGoals,
    outcome,
    correct: outcome === prediction.pick,
  };
}

export function mapApiMatch(apiMatch, prediction) {
  const code = apiMatch.competition?.code || "";
  return {
    id: String(apiMatch.id),
    homeTeam: apiMatch.homeTeam?.name || "Home",
    awayTeam: apiMatch.awayTeam?.name || "Away",
    homeShort: shortName(apiMatch.homeTeam),
    awayShort: shortName(apiMatch.awayTeam),
    league: apiMatch.competition?.name || "Competition",
    leagueIcon: LEAGUE_ICONS[code] || "⚽",
    kickoff: apiMatch.utcDate,
    status: mapStatus(apiMatch.status),
    matchday: apiMatch.matchday ?? 0,
    season: seasonLabel(apiMatch.season?.startDate),
    prediction,
    result: resultFromApi(apiMatch, prediction),
  };
}

function predictionFor(apiMatch) {
  const home = strengthFromName(apiMatch.homeTeam?.name || "Home");
  const away = strengthFromName(apiMatch.awayTeam?.name || "Away");
  return generatePrediction(home, away);
}

export function selectUpcoming(apiMatches, now = new Date()) {
  return apiMatches
    .filter((match) => {
      const kickoff = new Date(match.utcDate);
      return (match.status === "SCHEDULED" || match.status === "TIMED") && kickoff >= now;
    })
    .slice()
    .sort((a, b) => String(a.utcDate).localeCompare(String(b.utcDate)))
    .slice(0, SLATE_SIZE);
}

function weekLabel(matches) {
  const kickoff = matches[0]?.kickoff;
  const date = kickoff
    ? new Date(kickoff).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "upcoming";
  const leagues = [...new Set(matches.map((match) => match.league))];
  if (leagues.length === 1) return `${leagues[0]} — ${date}`;
  return `Slate — ${date}`;
}

export function createWeek(apiMatches, now = new Date()) {
  const selected = selectUpcoming(apiMatches, now);
  if (selected.length === 0) return null;
  const matches = selected.map((match) => mapApiMatch(match, predictionFor(match)));
  const cutoffTime = matches.map((match) => match.kickoff).sort()[0];
  return {
    id: `slate-${cutoffTime.slice(0, 10)}-${matches[0].id}`,
    label: weekLabel(matches),
    status: "active",
    cutoffTime,
    matches,
    score: null,
    totalMatches: matches.length,
    settledAt: null,
  };
}

function isClosed(match) {
  if (match.status === "postponed") return true;
  return match.status === "finished" && match.result != null;
}

export function refreshData({ apiMatches, slate, history, now = new Date() }) {
  const byId = new Map(apiMatches.map((match) => [String(match.id), match]));
  const byFixture = new Map(apiMatches.map((match) => [fixtureKey(match), match]));
  const weeks = Array.isArray(history?.weeks) ? history.weeks.map((week) => structuredClone(week)) : [];
  let week = slate?.week ? structuredClone(slate.week) : null;

  if (week && Array.isArray(week.matches) && week.matches.length > 0) {
    week = {
      ...week,
      matches: week.matches.map((stored) => {
        const apiMatch = byId.get(stored.id) ?? byFixture.get(fixtureKey(stored));
        if (!apiMatch) return stored;
        return mapApiMatch(apiMatch, stored.prediction ?? null);
      }),
    };
    const kickoffs = week.matches.map((match) => match.kickoff).filter(Boolean).sort();
    if (kickoffs[0]) week.cutoffTime = kickoffs[0];
    week.label = weekLabel(week.matches);

    if (week.matches.every(isClosed) && !weeks.some((saved) => saved.id === week.id)) {
      const scored = week.matches.filter((match) => match.result);
      const settled = {
        ...week,
        status: "settled",
        score: scored.filter((match) => match.result.correct).length,
        totalMatches: week.matches.length,
        settledAt: now.toISOString(),
      };
      weeks.unshift(settled);
      week = createWeek(apiMatches, now);
    }
  } else {
    week = createWeek(apiMatches, now);
  }

  const nextSlate = { generatedAt: slate?.generatedAt ?? null, week };
  const nextHistory = { generatedAt: history?.generatedAt ?? null, weeks };
  const previousContent = JSON.stringify({ week: slate?.week ?? null, weeks: history?.weeks ?? [] });
  const nextContent = JSON.stringify({ week, weeks });
  if (previousContent !== nextContent) {
    const generatedAt = now.toISOString();
    nextSlate.generatedAt = generatedAt;
    nextHistory.generatedAt = generatedAt;
  }

  return { slate: nextSlate, history: nextHistory };
}

function fixtureKey(match) {
  const date = String(match.utcDate ?? match.kickoff ?? "").slice(0, 10);
  const home = String(match.homeTeam?.name ?? match.homeTeam ?? "").trim().toLowerCase();
  const away = String(match.awayTeam?.name ?? match.awayTeam ?? "").trim().toLowerCase();
  return `${date}|${home}|${away}`;
}

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

function writeIfChanged(path, data) {
  const next = `${JSON.stringify(data, null, 2)}\n`;
  let previous = null;
  try {
    previous = readFileSync(path, "utf8");
  } catch {
    previous = null;
  }
  if (previous === next) return false;
  writeFileSync(path, next);
  return true;
}

export function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export async function fetchMatches(token, dateFrom, dateTo) {
  const url = new URL("https://api.football-data.org/v4/matches");
  url.searchParams.set("dateFrom", dateFrom);
  url.searchParams.set("dateTo", dateTo);
  const response = await fetch(url, { headers: { "X-Auth-Token": token } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`football-data.org ${response.status}: ${body.slice(0, 200)}`);
  }
  const payload = await response.json();
  return Array.isArray(payload.matches) ? payload.matches : [];
}

function tubetId(date, home, away) {
  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `tubet-${date.slice(0, 10)}-${slug(home)}-${slug(away)}`;
}

export function mapTubetFixtures(payload, { now = new Date() } = {}) {
  if (!Array.isArray(payload?.rounds)) {
    throw new Error("Tubet fixtures response must contain a rounds array");
  }

  const fixtures = [];
  const ids = new Set();
  for (const round of payload.rounds) {
    if (!Array.isArray(round?.matches)) {
      throw new Error("Tubet fixture round must contain a matches array");
    }
    for (const fixture of round.matches) {
      const date = typeof fixture?.date === "string" ? fixture.date : "";
      const parsedDate = new Date(date);
      const home = fixture?.team1?.name;
      const away = fixture?.team2?.name;
      if (!home || !away || !date || Number.isNaN(parsedDate.getTime())) {
        throw new Error("Tubet fixture is missing a valid date or team name");
      }
      const hasHomeScore = fixture.score1 != null;
      const hasAwayScore = fixture.score2 != null;
      if (hasHomeScore !== hasAwayScore) {
        throw new Error(`Tubet fixture has a partial score: ${home} vs ${away}`);
      }
      if (
        (hasHomeScore && (!Number.isInteger(fixture.score1) || fixture.score1 < 0)) ||
        (hasAwayScore && (!Number.isInteger(fixture.score2) || fixture.score2 < 0))
      ) {
        throw new Error(`Tubet fixture has an invalid score: ${home} vs ${away}`);
      }

      const kickoff = /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? `${date}T00:00:00.000Z`
        : parsedDate.toISOString();
      const id = tubetId(kickoff, home, away);
      if (ids.has(id)) throw new Error(`Duplicate Tubet fixture: ${home} vs ${away} on ${date}`);
      ids.add(id);
      const scored = hasHomeScore && hasAwayScore;
      fixtures.push({
        id,
        utcDate: kickoff,
        status: scored ? "FINISHED" : parsedDate >= now ? "TIMED" : "UNKNOWN",
        competition: { code: "PL", name: "English Premier League" },
        homeTeam: { name: home, tla: fixture.team1.code },
        awayTeam: { name: away, tla: fixture.team2.code },
        matchday: Number(round.name?.match(/(\d+)/)?.[1] ?? 0),
        season: { startDate: kickoff },
        score: {
          fullTime: {
            home: scored ? fixture.score1 : null,
            away: scored ? fixture.score2 : null,
          },
        },
      });
    }
  }
  if (fixtures.length === 0) throw new Error("Tubet fixtures response contains no fixtures");
  return fixtures;
}

export async function fetchTubetMatches(baseUrl, leagueId = "1", now = new Date()) {
  let base;
  try {
    base = new URL(baseUrl);
  } catch {
    throw new Error("TUBET_API_BASE_URL must be a valid HTTPS URL");
  }
  if (base.protocol !== "https:" || base.username || base.password) {
    throw new Error("TUBET_API_BASE_URL must be an HTTPS URL without credentials");
  }
  const url = new URL(`/api/v1/league/${encodeURIComponent(leagueId)}/fixtures`, base);
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Tubet API ${response.status}: ${body.slice(0, 200)}`);
  }
  return mapTubetFixtures(await response.json(), { now });
}

function validateMatches(matches, source) {
  if (!Array.isArray(matches) || matches.length === 0) {
    throw new Error(`${source} returned no matches; refusing to publish`);
  }
  for (const match of matches) {
    if (!match?.id || !match?.utcDate || !match?.homeTeam?.name || !match?.awayTeam?.name) {
      throw new Error(`${source} returned a match with missing identity fields; refusing to publish`);
    }
    if (Number.isNaN(new Date(match.utcDate).getTime())) {
      throw new Error(`${source} returned a match with an invalid date; refusing to publish`);
    }
  }
}

export function compareFeeds(primary, tubet) {
  const tubetByFixture = new Map(tubet.map((match) => [fixtureKey(match), match]));
  let matchedFixtures = 0;
  let scoreAvailabilityMatches = 0;
  for (const match of primary) {
    const other = tubetByFixture.get(fixtureKey(match));
    if (!other) continue;
    matchedFixtures += 1;
    const primaryScored = match.score?.fullTime?.home != null && match.score?.fullTime?.away != null;
    const tubetScored = other.score?.fullTime?.home != null && other.score?.fullTime?.away != null;
    if (primaryScored === tubetScored) scoreAvailabilityMatches += 1;
  }
  return {
    primaryFixtures: primary.length,
    tubetFixtures: tubet.length,
    matchedFixtures,
    scoreAvailabilityMatches,
  };
}

function dateWindow(slate, now) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  let from = today;
  const kickoffs = slate?.week?.matches?.map((match) => match.kickoff).filter(Boolean) ?? [];
  for (const kickoff of kickoffs) {
    const kickoffDate = new Date(kickoff);
    if (kickoffDate < from) from = kickoffDate;
  }
  from = new Date(from.getTime() - 24 * 60 * 60 * 1000);
  const to = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  return { dateFrom: isoDate(from), dateTo: isoDate(to) };
}

async function main() {
  const provider = process.env.MATCH_DATA_PROVIDER || "football-data";
  const mode = process.env.MATCH_DATA_MODE || "refresh";
  if (!["football-data", "tubet"].includes(provider)) {
    throw new Error(`Unsupported MATCH_DATA_PROVIDER: ${provider}`);
  }
  if (!["refresh", "compare"].includes(mode)) {
    throw new Error(`Unsupported MATCH_DATA_MODE: ${mode}`);
  }
  const now = new Date();
  const slate = readJson(SLATE_PATH, { generatedAt: null, week: null });
  const history = readJson(HISTORY_PATH, { generatedAt: null, weeks: [] });
  const { dateFrom, dateTo } = dateWindow(slate, now);
  const token = process.env.FOOTBALL_DATA_TOKEN;
  const tubetBaseUrl = process.env.TUBET_API_BASE_URL;
  const leagueId = process.env.TUBET_LEAGUE_ID || "1";

  if (mode === "compare") {
    if (!token) throw new Error("FOOTBALL_DATA_TOKEN is required for compare mode");
    if (!tubetBaseUrl) throw new Error("TUBET_API_BASE_URL is required for compare mode");
    const [footballMatches, tubetMatches] = await Promise.all([
      fetchMatches(token, dateFrom, dateTo),
      fetchTubetMatches(tubetBaseUrl, leagueId, now),
    ]);
    validateMatches(footballMatches, "football-data.org");
    validateMatches(tubetMatches, "Tubet");
    console.log(`Provider comparison (no files written): ${JSON.stringify(compareFeeds(footballMatches, tubetMatches))}`);
    return;
  }

  let apiMatches;
  if (provider === "tubet") {
    if (!tubetBaseUrl) throw new Error("TUBET_API_BASE_URL is not set");
    apiMatches = await fetchTubetMatches(tubetBaseUrl, leagueId, now);
  } else {
    if (!token) throw new Error("FOOTBALL_DATA_TOKEN is not set");
    apiMatches = await fetchMatches(token, dateFrom, dateTo);
  }
  validateMatches(apiMatches, provider === "tubet" ? "Tubet" : "football-data.org");
  const next = refreshData({ apiMatches, slate, history, now });
  const slateChanged = writeIfChanged(SLATE_PATH, next.slate);
  const historyChanged = writeIfChanged(HISTORY_PATH, next.history);
  console.log(
    `Refreshed from ${provider}: ${apiMatches.length} matches, slate ${slateChanged ? "updated" : "unchanged"}, history ${historyChanged ? "updated" : "unchanged"}`,
  );
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
