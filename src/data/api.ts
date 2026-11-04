import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import type { HistoryFile, JackpotWeek, Match, SlateFile } from "./matchData";

const CACHE_KEY = "bingo-data-v1";
const MANUAL_MATCHES_KEY = "bingo-manual-matches-v1";
export const MANUAL_MATCHES_EVENT = "bingo-manual-matches-updated";

export interface BingoData {
  week: JackpotWeek | null;
  weeks: JackpotWeek[];
  generatedAt: string | null;
  source: "network" | "cache" | "empty";
}

const EMPTY: BingoData = {
  week: null,
  weeks: [],
  generatedAt: null,
  source: "empty",
};

export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function fixtureKey(match: Pick<Match, "kickoff" | "homeTeam" | "awayTeam">): string {
  return [
    match.kickoff.slice(0, 10),
    match.homeTeam.trim().toLocaleLowerCase(),
    match.awayTeam.trim().toLocaleLowerCase(),
  ].join("|");
}

function readManualMatches(): Match[] {
  try {
    const raw = localStorage.getItem(MANUAL_MATCHES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Match[] : [];
  } catch {
    return [];
  }
}

export function saveManualMatches(matches: Match[]): void {
  try {
    const existing = readManualMatches();
    const byFixture = new Map(existing.map((match) => [fixtureKey(match), match]));
    for (const match of matches) byFixture.set(fixtureKey(match), match);
    localStorage.setItem(MANUAL_MATCHES_KEY, JSON.stringify([...byFixture.values()]));
    window.dispatchEvent(new Event(MANUAL_MATCHES_EVENT));
  } catch (error) {
    throw new Error(`Could not save uploaded fixtures on this device: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getManualMatches(): Match[] {
  return readManualMatches();
}

export function removeManualMatches(matches: Match[]): void {
  const removed = new Set(matches.map(fixtureKey));
  const remaining = readManualMatches().filter((match) => !removed.has(fixtureKey(match)));
  localStorage.setItem(MANUAL_MATCHES_KEY, JSON.stringify(remaining));
  window.dispatchEvent(new Event(MANUAL_MATCHES_EVENT));
}

export function clearManualMatches(): void {
  localStorage.removeItem(MANUAL_MATCHES_KEY);
  window.dispatchEvent(new Event(MANUAL_MATCHES_EVENT));
}

function withManualMatches(data: BingoData): BingoData {
  const manualMatches = readManualMatches();
  if (manualMatches.length === 0) return data;

  const matches = [...(data.week?.matches ?? [])];
  const indexes = new Map(matches.map((match, index) => [fixtureKey(match), index]));
  for (const manual of manualMatches) {
    const index = indexes.get(fixtureKey(manual));
    if (index === undefined) {
      indexes.set(fixtureKey(manual), matches.length);
      matches.push(manual);
    } else {
      matches[index] = {
        ...matches[index],
        odds: manual.odds,
        dataSource: manual.dataSource,
      };
    }
  }

  matches.sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  const firstKickoff = matches[0]?.kickoff ?? new Date().toISOString();
  const week: JackpotWeek = data.week
    ? { ...data.week, matches, totalMatches: matches.length }
    : {
        id: `manual-${firstKickoff.slice(0, 10)}`,
        label: "Uploaded fixtures",
        status: "active",
        cutoffTime: firstKickoff,
        matches,
        score: null,
        totalMatches: matches.length,
        settledAt: null,
      };
  return { ...data, week };
}

// Native builds set VITE_PAGES_ORIGIN to the GitHub Pages site, for example
// https://<owner>.github.io/<repo>, so the APK can load new slates without a rebuild.
export function dataFileUrl(file: "slate.json" | "history.json"): string {
  const origin = String(import.meta.env.VITE_PAGES_ORIGIN || "").replace(/\/$/, "");
  if (Capacitor.isNativePlatform() && origin) {
    return `${origin}/data/${file}`;
  }
  return `${import.meta.env.BASE_URL}data/${file}`;
}

function readCache(): BingoData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BingoData;
    return { ...parsed, source: "cache" };
  } catch {
    return null;
  }
}

function writeCache(data: BingoData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, source: "cache" }));
  } catch {
    // The screen still renders the response when storage is unavailable.
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return response.json() as Promise<T>;
}

let inflight: Promise<BingoData> | null = null;
let resolved: BingoData | null = null;
const listeners = new Set<() => void>();

function notifyBingoData() {
  for (const listener of listeners) listener();
}

/** Subscribe to data refreshes; returns an unsubscribe function. */
export function subscribeBingoData(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function loadBingoData(): Promise<BingoData> {
  if (resolved) return Promise.resolve(resolved);
  if (!inflight) {
    inflight = fetchBingoData().then((data) => {
      resolved = data;
      return data;
    });
  }
  return inflight;
}

/** Force a network refetch (pull-to-refresh, "check for updates"). */
export async function refreshBingoData(): Promise<BingoData> {
  inflight = null;
  resolved = null;
  const data = await loadBingoData();
  notifyBingoData();
  return data;
}

async function fetchBingoData(): Promise<BingoData> {
  try {
    const [slate, history] = await Promise.all([
      fetchJson<SlateFile>(dataFileUrl("slate.json")),
      fetchJson<HistoryFile>(dataFileUrl("history.json")),
    ]);
    const data: BingoData = {
      week: slate.week ?? null,
      weeks: Array.isArray(history.weeks) ? history.weeks : [],
      generatedAt: slate.generatedAt ?? history.generatedAt ?? null,
      source: "network",
    };
    writeCache(data);
    return data;
  } catch {
    return readCache() ?? EMPTY;
  }
}

export function useBingoData() {
  const [status, setStatus] = useState<"loading" | "ready">(resolved ? "ready" : "loading");
  const [data, setData] = useState<BingoData | null>(resolved);

  useEffect(() => {
    let cancelled = false;
    loadBingoData().then((next) => {
      if (cancelled) return;
      setData(withManualMatches(next));
      setStatus("ready");
    });
    const syncFromRefresh = () => {
      if (resolved) setData(withManualMatches(resolved));
    };
    const updateManualMatches = () => {
      setData((current) => current ? withManualMatches(current) : current);
    };
    window.addEventListener(MANUAL_MATCHES_EVENT, updateManualMatches);
    const unsubscribe = subscribeBingoData(syncFromRefresh);
    return () => {
      cancelled = true;
      window.removeEventListener(MANUAL_MATCHES_EVENT, updateManualMatches);
      unsubscribe();
    };
  }, []);

  return { status, data };
}
