import type { Match } from "./matchData";

export const IMPORT_FIELDS = [
  "homeTeam",
  "awayTeam",
  "kickoff",
  "league",
  "homeOdds",
  "drawOdds",
  "awayOdds",
] as const;

export type ImportField = typeof IMPORT_FIELDS[number];
export type ImportRow = Record<string, string>;
export type ColumnMapping = Record<ImportField, string>;

const FIELD_LABELS: Record<ImportField, string> = {
  homeTeam: "Home team (required)",
  awayTeam: "Away team (required)",
  kickoff: "Kickoff date/time (required)",
  league: "League / competition",
  homeOdds: "Home odds (1)",
  drawOdds: "Draw odds (X)",
  awayOdds: "Away odds (2)",
};

const FIELD_ALIASES: Record<ImportField, string[]> = {
  homeTeam: ["home team", "home_team", "hometeam", "home", "team1", "team 1", "host", "home.name"],
  awayTeam: ["away team", "away_team", "awayteam", "away", "team2", "team 2", "visitor", "away.name"],
  kickoff: ["kickoff", "kick off", "date", "datetime", "date time", "start time", "start", "match date", "event date"],
  league: ["league", "competition", "tournament", "country", "event league"],
  homeOdds: ["home odds", "home_odds", "odds home", "odd1", "odds1", "price1", "1", "home win"],
  drawOdds: ["draw odds", "draw_odds", "odds draw", "oddx", "oddsx", "pricex", "x", "draw"],
  awayOdds: ["away odds", "away_odds", "odds away", "odd2", "odds2", "price2", "2", "away win"],
};

export const IMPORT_FIELD_LABELS = FIELD_LABELS;

function flattenObject(value: unknown, prefix = "", output: ImportRow = {}): ImportRow {
  if (value == null) return output;
  if (Array.isArray(value)) {
    output[prefix] = value.map((item) => String(item ?? "")).join(", ");
    return output;
  }
  if (value instanceof Date) {
    output[prefix] = value.toISOString();
    return output;
  }
  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flattenObject(child, prefix ? `${prefix}.${key}` : key, output);
    }
    return output;
  }
  if (prefix) output[prefix] = String(value);
  return output;
}

function findJsonRecords(value: unknown): unknown[] | null {
  if (Array.isArray(value)) return value.filter((row) => row && typeof row === "object");
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  for (const key of ["matches", "fixtures", "events", "odds", "results", "data"]) {
    if (record[key] !== undefined) {
      const rows = findJsonRecords(record[key]);
      if (rows) return rows;
    }
  }
  for (const nested of Object.values(record)) {
    if (Array.isArray(nested)) {
      const rows = findJsonRecords(nested);
      if (rows) return rows;
    }
    if (nested && typeof nested === "object") {
      const rows = findJsonRecords(nested);
      if (rows) return rows;
    }
  }
  return Object.keys(record).length ? [record] : null;
}

function normalizeSheetRows(rows: Record<string, unknown>[]): ImportRow[] {
  return rows.map((row) => Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key,
      value instanceof Date ? value.toISOString() : String(value ?? ""),
    ]),
  ));
}

function parseDelimited(text: string, delimiter: string): ImportRow[] {
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) records.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (quoted) throw new Error("The delimited file contains an unclosed quoted field.");
  row.push(field);
  if (row.some((value) => value.trim())) records.push(row);
  if (records.length < 2) throw new Error("The selected file has no data rows.");

  const headers = records[0].map((header) => header.trim());
  if (headers.some((header) => !header)) throw new Error("Every column needs a header name.");
  return records.slice(1).map((values) => Object.fromEntries(
    headers.map((header, index) => [header, values[index] ?? ""]),
  ));
}

export async function parseUploadData(fileName: string, content: ArrayBuffer | string): Promise<ImportRow[]> {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "json") {
    const parsed: unknown = JSON.parse(String(content));
    const records = findJsonRecords(parsed);
    if (!records?.length) throw new Error("The JSON file does not contain a list of match records.");
    return records.map((row) => flattenObject(row));
  }
  if (extension === "csv" || extension === "tsv") {
    return parseDelimited(String(content), extension === "tsv" ? "\t" : ",");
  }
  if (!["xlsx", "xls"].includes(extension ?? "")) {
    throw new Error("Choose a CSV, TSV, Excel (.xlsx/.xls), or JSON file.");
  }

  const XLSX = await import("@e965/xlsx");
  const workbook = XLSX.read(content, {
    type: typeof content === "string" ? "string" : "array",
    cellDates: true,
  });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!firstSheet) throw new Error("The selected file does not contain a worksheet.");
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
    defval: "",
    raw: false,
    blankrows: false,
  });
  if (!rows.length) throw new Error("The selected file has no data rows.");
  return normalizeSheetRows(rows);
}

export async function parseUploadFile(file: File): Promise<ImportRow[]> {
  const content = file.name.toLowerCase().endsWith(".json")
    ? await file.text()
    : file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".tsv")
      ? await file.text()
      : await file.arrayBuffer();
  return parseUploadData(file.name, content);
}

function normalizedHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function defaultColumnMapping(headers: string[]): ColumnMapping {
  const mapping = Object.fromEntries(IMPORT_FIELDS.map((field) => [field, ""])) as ColumnMapping;
  for (const field of IMPORT_FIELDS) {
    const aliases = new Set(FIELD_ALIASES[field].map(normalizedHeader));
    mapping[field] = headers.find((header) => aliases.has(normalizedHeader(header))) ?? "";
  }
  return mapping;
}

function parseKickoff(value: string): string | null {
  const input = value.trim();
  if (!input) return null;
  const yearFirst = input.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (yearFirst) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] = yearFirst;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)));
    if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) return null;
    return date.toISOString();
  }
  const dayFirst = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (dayFirst) {
    const [, first, second, year, hour = "0", minute = "0", secondOfMinute = "0"] = dayFirst;
    let day = Number(first);
    let month = Number(second);
    if (day <= 12 && month > 12) [day, month] = [month, day];
    const date = new Date(Date.UTC(Number(year), month - 1, day, Number(hour), Number(minute), Number(secondOfMinute)));
    if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return date.toISOString();
  }
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseOdds(value: string): number | undefined | null {
  const input = value.trim();
  if (!input) return undefined;
  const normalized = input.includes(",") && !input.includes(".")
    ? input.replace(",", ".")
    : input.replace(/,/g, "");
  const odds = Number(normalized);
  return Number.isFinite(odds) && odds > 1 ? odds : null;
}

function shortName(team: string): string {
  return team.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() || team.slice(0, 3).toUpperCase();
}

function fixtureId(kickoff: string, home: string, away: string): string {
  const slug = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `manual-${kickoff.slice(0, 10)}-${slug(home)}-${slug(away)}`;
}

export interface PreparedImport {
  matches: Match[];
  errors: string[];
}

export function prepareImportedMatches(
  rows: ImportRow[],
  mapping: ColumnMapping,
  source: string,
  updatedAt = new Date().toISOString(),
): PreparedImport {
  const matches: Match[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const homeTeam = (row[mapping.homeTeam] ?? "").trim();
    const awayTeam = (row[mapping.awayTeam] ?? "").trim();
    const kickoff = parseKickoff(row[mapping.kickoff] ?? "");
    if (!homeTeam || !awayTeam || !kickoff) {
      errors.push(`Row ${rowNumber}: home team, away team, and a valid kickoff date/time are required.`);
      return;
    }

    const homeOdds = parseOdds(row[mapping.homeOdds] ?? "");
    const drawOdds = parseOdds(row[mapping.drawOdds] ?? "");
    const awayOdds = parseOdds(row[mapping.awayOdds] ?? "");
    if (homeOdds === null || drawOdds === null || awayOdds === null) {
      errors.push(`Row ${rowNumber}: odds must be decimal values greater than 1.`);
      return;
    }

    const key = `${kickoff.slice(0, 10)}|${homeTeam.toLowerCase()}|${awayTeam.toLowerCase()}`;
    if (seen.has(key)) {
      errors.push(`Row ${rowNumber}: duplicate fixture in this file was skipped.`);
      return;
    }
    seen.add(key);

    const league = (row[mapping.league] ?? "").trim() || "Uploaded fixtures";
    const hasOdds = homeOdds !== undefined || drawOdds !== undefined || awayOdds !== undefined;
    matches.push({
      id: fixtureId(kickoff, homeTeam, awayTeam),
      homeTeam,
      awayTeam,
      homeShort: shortName(homeTeam),
      awayShort: shortName(awayTeam),
      league,
      leagueIcon: "⚽",
      kickoff,
      status: "scheduled",
      matchday: 0,
      season: String(new Date(kickoff).getUTCFullYear()),
      prediction: null,
      result: null,
      dataSource: source.trim() || "Manual upload",
      ...(hasOdds ? {
        odds: {
          ...(homeOdds !== undefined ? { home: homeOdds } : {}),
          ...(drawOdds !== undefined ? { draw: drawOdds } : {}),
          ...(awayOdds !== undefined ? { away: awayOdds } : {}),
          source: source.trim() || "Manual upload",
          updatedAt,
        },
      } : {}),
    });
  });
  return { matches, errors };
}
