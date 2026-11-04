import { useEffect, useMemo, useState } from "react";
import { FileUp, X } from "lucide-react";
import {
  MANUAL_MATCHES_EVENT,
  saveManualMatches,
  getManualMatches,
  removeManualMatches,
  clearManualMatches,
} from "../data/api";
import {
  defaultColumnMapping,
  IMPORT_FIELDS,
  IMPORT_FIELD_LABELS,
  parseUploadFile,
  prepareImportedMatches,
  type ColumnMapping,
  type ImportField,
  type ImportRow,
} from "../data/manualImport";
import type { Match } from "../data/matchData";

export function ManualImport() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping | null>(null);
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const headers = useMemo(() => [...new Set(rows.flatMap((row) => Object.keys(row)))], [rows]);
  const prepared = useMemo(
    () => rows.length && mapping ? prepareImportedMatches(rows, mapping, source) : { matches: [], errors: [] },
    [rows, mapping, source],
  );

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const parsedRows = await parseUploadFile(file);
      const columns = [...new Set(parsedRows.flatMap((row) => Object.keys(row)))];
      if (!columns.length) throw new Error("No columns were found in the uploaded data.");
      setRows(parsedRows);
      setMapping(defaultColumnMapping(columns));
      setFileName(file.name);
    } catch (parseError) {
      setRows([]);
      setMapping(null);
      setFileName("");
      setError(parseError instanceof Error ? parseError.message : "Could not read this file.");
    } finally {
      setBusy(false);
    }
  }

  function updateMapping(field: ImportField, value: string) {
    setMapping((current) => current ? { ...current, [field]: value } : current);
    setSuccess("");
  }

  function handleImport() {
    if (!prepared.matches.length) return;
    try {
      saveManualMatches(prepared.matches);
      setSuccess(`Imported ${prepared.matches.length} fixture${prepared.matches.length === 1 ? "" : "s"}. They are saved on this device.`);
      setError("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the uploaded fixtures.");
      setSuccess("");
    }
  }

  return (
    <section className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-3">
      <div>
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Upload fixtures & odds</h3>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
          Import CSV, TSV, Excel, or JSON exports from Betika, SportPesa, SportyBet, or another source.
          Map that file’s columns to the fields below.
        </p>
      </div>

      <label className="block">
        <span className="block text-[11px] text-gray-400 mb-1">Bookmaker / data source</span>
        <input
          value={source}
          onChange={(event) => setSource(event.target.value)}
          placeholder="e.g. Betika"
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 bg-gray-800/50 px-3 py-4 text-xs text-emerald-400 cursor-pointer hover:border-emerald-500/50">
        <FileUp className="w-4 h-4" aria-hidden />
        {busy ? "Reading file…" : fileName || "Choose CSV, TSV, Excel, or JSON file"}
        <input
          type="file"
          accept=".csv,.tsv,.xlsx,.xls,.json,application/json,text/csv"
          onChange={handleFileChange}
          disabled={busy}
          className="sr-only"
        />
      </label>

      {mapping && (
        <>
          <div className="grid grid-cols-1 gap-2">
            {IMPORT_FIELDS.map((field) => (
              <label key={field} className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400">{IMPORT_FIELD_LABELS[field]}</span>
                <select
                  value={mapping[field]}
                  onChange={(event) => updateMapping(field, event.target.value)}
                  className="max-w-[55%] rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-[11px] text-white"
                >
                  <option value="">— Not mapped —</option>
                  {headers.map((header) => <option key={header} value={header}>{header}</option>)}
                </select>
              </label>
            ))}
          </div>

          <div className="rounded-lg bg-gray-800/70 p-3">
            <p className="text-[11px] font-semibold text-white">
              Preview: {prepared.matches.length} valid fixture{prepared.matches.length === 1 ? "" : "s"}
              {prepared.errors.length ? ` · ${prepared.errors.length} row${prepared.errors.length === 1 ? "" : "s"} skipped` : ""}
            </p>
            {prepared.matches[0] && (
              <p className="text-[11px] text-gray-400 mt-1">
                {prepared.matches[0].homeTeam} vs {prepared.matches[0].awayTeam}
                {" · "}{new Date(prepared.matches[0].kickoff).toLocaleString()}
                {prepared.matches[0].odds && ` · ${[
                  prepared.matches[0].odds.home,
                  prepared.matches[0].odds.draw,
                  prepared.matches[0].odds.away,
                ].map((odd) => odd?.toFixed(2) ?? "—").join(" / ")}`}
              </p>
            )}
            {prepared.errors.length > 0 && (
              <ul className="mt-2 space-y-1 text-[11px] text-amber-400">
                {prepared.errors.slice(0, 3).map((message) => <li key={message}>{message}</li>)}
                {prepared.errors.length > 3 && <li>And {prepared.errors.length - 3} more invalid rows.</li>}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={!prepared.matches.length}
            className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-emerald-600"
          >
            Import {prepared.matches.length} valid fixture{prepared.matches.length === 1 ? "" : "s"}
          </button>
        </>
      )}

      {error && <p role="alert" className="text-[11px] text-red-400">{error}</p>}
      {success && <p role="status" className="text-[11px] text-emerald-400">{success}</p>}
      <p className="text-[11px] text-gray-500 leading-relaxed">
        Fixtures and odds remain in this browser/device. Odds are treated as manually uploaded decimal prices,
        not live data, and will not alter the prediction model.
      </p>

      <ManageUploads />
    </section>
  );
}

function ManageUploads() {
  const [fixtures, setFixtures] = useState<Match[]>([]);

  useEffect(() => {
    const refresh = () => setFixtures(getManualMatches());
    refresh();
    window.addEventListener(MANUAL_MATCHES_EVENT, refresh);
    return () => window.removeEventListener(MANUAL_MATCHES_EVENT, refresh);
  }, []);

  if (fixtures.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-700/60 bg-gray-800/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-white">
          On this device ({fixtures.length})
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Remove all ${fixtures.length} uploaded fixture${fixtures.length === 1 ? "" : "s"}?`)) {
              clearManualMatches();
            }
          }}
          className="text-[11px] font-medium text-red-400 hover:text-red-300"
        >
          Remove all
        </button>
      </div>
      <ul className="divide-y divide-gray-700/40">
        {fixtures.map((match) => (
          <li key={`${match.kickoff}|${match.homeTeam}|${match.awayTeam}`} className="flex items-center justify-between gap-2 py-1.5">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-gray-200">
                {match.homeTeam} vs {match.awayTeam}
              </p>
              <p className="text-[11px] text-gray-500">
                {new Date(match.kickoff).toLocaleString()}
                {match.odds?.source ? ` · ${match.odds.source}` : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Remove ${match.homeTeam} vs ${match.awayTeam}`}
              onClick={() => removeManualMatches([match])}
              className="flex-shrink-0 rounded-md px-2 py-1 text-gray-400 hover:bg-gray-700/60 hover:text-red-400"
            >
              <X className="w-3.5 h-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
