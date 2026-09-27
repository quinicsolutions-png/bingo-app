import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import type { HistoryFile, JackpotWeek, SlateFile } from "./matchData";

const CACHE_KEY = "bingo-data-v1";

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
      setData(next);
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, data };
}
