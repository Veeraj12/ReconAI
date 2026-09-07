// Turns the already-loaded reconciliation/analysis data in memory into
// flat, spreadsheet-friendly rows and triggers a browser download —
// entirely client-side, no backend round trip needed, since the full
// result is already sitting in React state by the time a user opens
// this panel.

import * as XLSX from "xlsx";
import type {
  ExceptionPair,
  GroupedMatch,
  MatchedPair,
  ReconciliationResult,
  Transaction,
} from "../reconciliation/types";
function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}
import type { Pattern, PatternAnalysisResult } from "../analysis/types";

// ── Flatteners — one per shape, each producing a plain object with no
// nested structures, which is what a spreadsheet row actually needs ──

function flattenTransaction(t: Transaction) {
  return {
    "Excel Row": t.excelRow,
    Date: t.date,
    Reference: t.reference,
    Description: t.description,
    Amount: t.amount,
    Type: t.transactionType ?? "",
    "Duplicate Artifact": t.duplicateArtifact ? "Yes" : "",
    Note: t.note ?? "",
  };
}

function flattenMatchedPair(m: MatchedPair) {
  return {
    "Bank Row": m.bankTransaction.excelRow,
    "Bank Date": m.bankTransaction.date,
    "Bank Reference": m.bankTransaction.reference,
    "Bank Amount": m.bankTransaction.amount,
    "Tally Row": m.tallyTransaction.excelRow,
    "Tally Date": m.tallyTransaction.date,
    "Tally Reference": m.tallyTransaction.reference,
    "Tally Amount": m.tallyTransaction.amount,
    "Matching Rule": m.matchingRule,
    "Date Difference (days)": m.dateDifferenceDays,
    "Within Tolerance": m.withinTolerance ? "Yes" : "No",
  };
}

function flattenExceptionPair(e: ExceptionPair) {
  return {
    "Bank Row": e.bankTransaction.excelRow,
    "Bank Date": e.bankTransaction.date,
    "Bank Reference": e.bankTransaction.reference,
    "Bank Amount": e.bankTransaction.amount,
    "Bank Type": e.bankTransaction.transactionType ?? "",
    "Tally Row": e.tallyTransaction.excelRow,
    "Tally Date": e.tallyTransaction.date,
    "Tally Reference": e.tallyTransaction.reference,
    "Tally Amount": e.tallyTransaction.amount,
    "Tally Type": e.tallyTransaction.transactionType ?? "",
    "Amount Difference": e.amountDifference ?? "",
    Reason: e.reason,
  };
}

function flattenGroupedMatch(g: GroupedMatch) {
  return {
    Direction: g.direction,
    Date: g.date,
    Amount: g.amount,
    Reason: g.reason,
    "One-side Row": g.oneTransaction.excelRow,
    "One-side Reference": g.oneTransaction.reference,
    "Many-side Rows": g.manyTransactions.map((t) => t.excelRow).join(", "),
    "Many-side Count": g.manyTransactions.length,
  };
}

function flattenPattern(p: Pattern) {
  return {
    "Pattern ID": p.pattern_id,
    "Pattern Type": p.pattern_type,
    "Exception Type": p.exception_type,
    Records: p.record_count,
    "Financial Impact": p.total_financial_impact,
    Confidence: p.confidence,
    "Combined Score": p.combined_score,
    Summary: p.summary,
  };
}

function flattenInvalidRow(row: Record<string, unknown>) {
  return row;
}

// ── Category registry — the single source of truth for "what can be
// exported", so the UI checklist and the actual export logic can never
// drift apart (adding a category means adding one entry here). ──

export interface ExportCategory {
  key: string;
  label: string;
  sheetName: string;
  /** How many rows this category currently has, for this specific
   * data — used to grey out / auto-skip empty categories rather than
   * producing a pointless empty sheet. */
  count: (data: ReconciliationResult, analysis: PatternAnalysisResult | null) => number;
  rows: (data: ReconciliationResult, analysis: PatternAnalysisResult | null) => Record<string, unknown>[];
}

export const EXPORT_CATEGORIES: ExportCategory[] = [
  {
    key: "matched",
    label: "Matched Transactions",
    sheetName: "Matched",
    count: (d) => asArray<MatchedPair>(d.matchedTransactions).length,
    rows: (d) => asArray<MatchedPair>(d.matchedTransactions).map(flattenMatchedPair),
  },
  {
    key: "missingBank",
    label: "Missing In Bank",
    sheetName: "Missing In Bank",
    count: (d) => asArray<Transaction>(d.missingInBank).length,
    rows: (d) => asArray<Transaction>(d.missingInBank).map(flattenTransaction),
  },
  {
    key: "missingTally",
    label: "Missing In Tally",
    sheetName: "Missing In Tally",
    count: (d) => asArray<Transaction>(d.missingInTally).length,
    rows: (d) => asArray<Transaction>(d.missingInTally).map(flattenTransaction),
  },
  {
    key: "amountMismatches",
    label: "Amount Mismatches",
    sheetName: "Amount Mismatches",
    count: (d) => asArray<ExceptionPair>(d.exceptions?.amountMismatches).length,
    rows: (d) =>
      asArray<ExceptionPair>(d.exceptions?.amountMismatches).map(flattenExceptionPair)
  },
  {
    key: "typeMismatches",
    label: "Type Mismatches",
    sheetName: "Type Mismatches",
    count: (d) => asArray<ExceptionPair>(d.exceptions?.typeMismatches).length,
    rows: (d) => asArray<ExceptionPair>(d.exceptions?.typeMismatches).map(flattenExceptionPair),
  },
  {
    key: "groupedMatches",
    label: "Grouped (Split/Consolidated) Matches",
    sheetName: "Grouped Matches",
    count: (d) => asArray<GroupedMatch>(d.exceptions?.groupedMatches).length,
    rows: (d) => asArray<GroupedMatch>(d.exceptions?.groupedMatches).map(flattenGroupedMatch),
  },
  {
    key: "duplicatesBank",
    label: "Duplicates — Bank",
    sheetName: "Duplicates (Bank)",
    count: (d) => asArray<Transaction>(d.duplicates?.bank).length,
    rows: (d) =>
      asArray<Transaction>(d.duplicates?.bank).map(flattenTransaction),
  },
  {
    key: "duplicatesTally",
    label: "Duplicates — Tally",
    sheetName: "Duplicates (Tally)",
    count: (d) => asArray<Transaction>(d.duplicates?.tally).length,
    rows: (d) => asArray<Transaction>(d.duplicates?.tally).map(flattenTransaction),
  },
  {
    key: "signReversalHints",
    label: "Sign Reversal Hints",
    sheetName: "Sign Reversal Hints",
    count: (d) => asArray<ExceptionPair>(d.signReversalHints).length,
    rows: (d) =>
  asArray<ExceptionPair>(d.signReversalHints).map(flattenExceptionPair),
  },
  {
    key: "droppedBank",
    label: "Dropped Rows — Bank",
    sheetName: "Dropped Rows (Bank)",
    count: (d) => asArray<Record<string, unknown>>(d.invalidBankRowData).length,
rows: (d) =>
  asArray<Record<string, unknown>>(d.invalidBankRowData).map(flattenInvalidRow),
  },
  {
    key: "droppedTally",
    label: "Dropped Rows — Tally",
    sheetName: "Dropped Rows (Tally)",
    count: (d) => asArray<Record<string, unknown>>(d.invalidTallyRowData).length,
    rows: (d) => asArray<Record<string, unknown>>(d.invalidTallyRowData).map(flattenInvalidRow),
  },
  {
    key: "patterns",
    label: "Pattern Analysis",
    sheetName: "Pattern Analysis",
    count: (_d, analysis) =>  asArray<Pattern>(analysis?.patterns).length,
    rows: (_d, analysis) =>  asArray<Pattern>(analysis?.patterns).map(flattenPattern),
  },
];

/** Sheet names must be <=31 characters and unique for XLSX — every
 * sheetName above is already short and unique, but this guards
 * against a future addition breaking that silently rather than
 * producing a workbook Excel refuses to open. */
function assertValidSheetNames() {
  const seen = new Set<string>();
  for (const category of EXPORT_CATEGORIES) {
    if (category.sheetName.length > 31) {
      throw new Error(`Export sheet name too long for Excel: "${category.sheetName}"`);
    }
    if (seen.has(category.sheetName)) {
      throw new Error(`Duplicate export sheet name: "${category.sheetName}"`);
    }
    seen.add(category.sheetName);
  }
}
assertValidSheetNames();

/** Builds and downloads an .xlsx workbook with one sheet per selected,
 * non-empty category. Categories with zero rows for this data are
 * silently skipped (an empty sheet would just be noise) — the caller
 * (ExportPanel) is responsible for telling the user which categories
 * had nothing to export, if that matters for the UI. */
export function exportToExcel(
  data: ReconciliationResult,
  analysis: PatternAnalysisResult | null,
  selectedKeys: string[],
  filenamePrefix = "reconciliation"
): { exportedSheets: string[]; skippedEmpty: string[] } {
  const workbook = XLSX.utils.book_new();
  const exportedSheets: string[] = [];
  const skippedEmpty: string[] = [];

  for (const category of EXPORT_CATEGORIES) {
    if (!selectedKeys.includes(category.key)) continue;

    const rows = category.rows(data, analysis);
    if (rows.length === 0) {
      skippedEmpty.push(category.label);
      continue;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, category.sheetName);
    exportedSheets.push(category.label);
  }

  if (exportedSheets.length === 0) {
    return { exportedSheets, skippedEmpty };
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  XLSX.writeFile(workbook, `${filenamePrefix}-${timestamp}.xlsx`);

  return { exportedSheets, skippedEmpty };
}

/** Exports exactly one category as a plain .csv — offered only when a
 * single category is selected, since CSV has no concept of multiple
 * sheets the way .xlsx does. */
export function exportToCsv(
  data: ReconciliationResult,
  analysis: PatternAnalysisResult | null,
  key: string,
  filenamePrefix = "reconciliation"
): boolean {
  const category = EXPORT_CATEGORIES.find((c) => c.key === key);
  if (!category) return false;

  const rows = category.rows(data, analysis);
  if (rows.length === 0) return false;

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  link.href = url;
  link.download = `${filenamePrefix}-${category.sheetName.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
