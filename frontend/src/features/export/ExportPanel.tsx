"use client";

import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, FileText, CheckSquare, Square } from "lucide-react";
import type { ReconciliationResult } from "../reconciliation/types";
import { useAnalysisContext } from "../analysis/AnalysisProvider";
import { EXPORT_CATEGORIES, exportToCsv, exportToExcel } from "./exportToExcel";

interface ExportPanelProps {
  data: ReconciliationResult;
}

export function ExportPanel({ data }: ExportPanelProps) {
  const { result: analysisResult } = useAnalysisContext();

  // Only categories that actually have at least one row for THIS
  // data are selectable — nobody wants to tick a checkbox for
  // "Duplicates" and get an empty sheet.
  const availableCategories = useMemo(
    () =>
      EXPORT_CATEGORIES.map((category) => ({
        ...category,
        rowCount: category.count(data, analysisResult),
      })),
    [data, analysisResult]
  );

  const selectableKeys = useMemo(
    () => availableCategories.filter((c) => c.rowCount > 0).map((c) => c.key),
    [availableCategories]
  );

  const [selected, setSelected] = useState<Set<string>>(new Set(selectableKeys));
  const [lastResult, setLastResult] = useState<{ exportedSheets: string[]; skippedEmpty: string[] } | null>(null);

  const allSelected = selectableKeys.length > 0 && selectableKeys.every((k) => selected.has(k));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(selectableKeys));
    setLastResult(null);
  }

  function toggleOne(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setLastResult(null);
  }

  function handleExportExcel() {
    const result = exportToExcel(data, analysisResult, Array.from(selected));
    setLastResult(result);
  }

  function handleExportCsv() {
    if (selected.size !== 1) return;
    const [key] = Array.from(selected);
    exportToCsv(data, analysisResult, key);
  }

  return (
    <div className="animate-fade-in-up space-y-4 rounded-lg border border-border-app bg-bg-panel p-4">
      <div>
        <h3 className="font-display text-sm font-semibold text-text-primary">Export results</h3>
        <p className="mt-1 text-xs text-text-secondary">
          Choose everything, or just the categories you need — each selected category becomes its
          own sheet in a single downloaded workbook.
        </p>
      </div>

      <button
        type="button"
        onClick={toggleAll}
        className="flex items-center gap-2 text-xs font-medium text-accent-dark hover:underline"
      >
        {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        {allSelected ? "Deselect all" : "Select all"}
      </button>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {availableCategories.map((category) => {
          const disabled = category.rowCount === 0;
          const checked = selected.has(category.key);
          return (
            <label
              key={category.key}
              className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
                disabled
                  ? "cursor-not-allowed border-border-app/50 text-text-secondary/50"
                  : checked
                  ? "cursor-pointer border-accent/40 bg-accent-soft text-text-primary"
                  : "cursor-pointer border-border-app text-text-secondary hover:border-accent/30"
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleOne(category.key)}
                  className="h-3.5 w-3.5 rounded accent-accent"
                />
                {category.label}
              </span>
              <span className="tabular-data text-[10px] font-semibold text-text-secondary">
                {category.rowCount.toLocaleString()}
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border-app pt-3.5">
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={selected.size === 0}
          className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-accent-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Export as Excel (.xlsx)
        </button>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={selected.size !== 1}
          title={selected.size !== 1 ? "Pick exactly one category to export as CSV" : undefined}
          className="flex items-center gap-1.5 rounded-md border border-border-app px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileText className="h-3.5 w-3.5" />
          Export as CSV
        </button>

        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-text-secondary">
          <Download className="h-3 w-3" />
          {selected.size} of {selectableKeys.length} categories selected
        </span>
      </div>

      {lastResult && (
        <div className="rounded-md bg-row-alt/60 px-3 py-2 text-[11px] text-text-secondary">
          {lastResult.exportedSheets.length > 0 ? (
            <p>
              Downloaded: <span className="font-medium text-text-primary">{lastResult.exportedSheets.join(", ")}</span>
            </p>
          ) : (
            <p>Nothing to export — every selected category was empty for this reconciliation.</p>
          )}
          {lastResult.skippedEmpty.length > 0 && (
            <p className="mt-0.5">Skipped (no rows): {lastResult.skippedEmpty.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}
