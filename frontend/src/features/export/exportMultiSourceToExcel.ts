// Multi-source's own export builder — kept separate from
// export/exportToExcel.ts (rather than overloading one function with
// two incompatible input shapes) since MultiSourceResult has a nested
// per-secondary-source structure ReconciliationResult doesn't. Reuses
// the exact same underlying flatteners for the row-level shapes both
// share (Transaction, MatchedPair, ExceptionPair, GroupedMatch), so a
// "matched transactions" row looks identical whether it came from a
// single reconciliation or one leg of a multi-source one.

import * as XLSX from "xlsx";
import type { MultiSourceResult, PairwiseResult } from "../multiSource/types";
import type { ExceptionPair, GroupedMatch, MatchedPair, Transaction } from "../reconciliation/types";

function flattenTransaction(t: Transaction) {
  return {
    "Excel Row": t.excelRow,
    Date: t.date,
    Reference: t.reference,
    Description: t.description,
    Amount: t.amount,
    Type: t.transactionType ?? "",
  };
}

function flattenMatchedPair(m: MatchedPair) {
  return {
    "Primary Row": m.bankTransaction.excelRow,
    "Primary Date": m.bankTransaction.date,
    "Primary Reference": m.bankTransaction.reference,
    "Primary Amount": m.bankTransaction.amount,
    "Secondary Row": m.tallyTransaction.excelRow,
    "Secondary Date": m.tallyTransaction.date,
    "Secondary Reference": m.tallyTransaction.reference,
    "Secondary Amount": m.tallyTransaction.amount,
    "Matching Rule": m.matchingRule,
  };
}

function flattenExceptionPair(e: ExceptionPair) {
  return {
    "Primary Row": e.bankTransaction.excelRow,
    "Primary Amount": e.bankTransaction.amount,
    "Secondary Row": e.tallyTransaction.excelRow,
    "Secondary Amount": e.tallyTransaction.amount,
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
  };
}

/** Excel sheet names are capped at 31 chars and must be unique within
 * one workbook — with several secondary sources, a name like
 * "Tally-2 — Amount Mismatches" can easily exceed that, so this
 * truncates deterministically and disambiguates on collision rather
 * than letting XLSX silently reject or mangle the sheet. */
function safeSheetName(name: string, used: Set<string>): string {
  let candidate = name.slice(0, 31);
  let suffix = 2;
  while (used.has(candidate)) {
    const suffixText = ` (${suffix})`;
    candidate = name.slice(0, 31 - suffixText.length) + suffixText;
    suffix += 1;
  }
  used.add(candidate);
  return candidate;
}

export function exportMultiSourceToExcel(result: MultiSourceResult): { exportedSheets: string[] } {
  const workbook = XLSX.utils.book_new();
  const usedNames = new Set<string>();
  const exportedSheets: string[] = [];

  function addSheet(name: string, rows: Record<string, unknown>[]) {
    if (rows.length === 0) return;
    const sheetName = safeSheetName(name, usedNames);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    exportedSheets.push(name);
  }

  for (const [secondaryLabel, pairwise] of Object.entries(result.pairwiseResults)) {
    const p: PairwiseResult = pairwise;
    addSheet(`${secondaryLabel} — Matched`, p.matchedTransactions.map(flattenMatchedPair));
    addSheet(`${secondaryLabel} — Missing In ${secondaryLabel}`, p.missingInSecondary.map(flattenTransaction));
    addSheet(`${secondaryLabel} — Missing In Primary`, p.missingInPrimary.map(flattenTransaction));
    addSheet(`${secondaryLabel} — Amount Mismatches`, p.exceptions.amountMismatches.map(flattenExceptionPair));
    addSheet(`${secondaryLabel} — Type Mismatches`, p.exceptions.typeMismatches.map(flattenExceptionPair));
    addSheet(`${secondaryLabel} — Grouped Matches`, p.exceptions.groupedMatches.map(flattenGroupedMatch));
    addSheet(`${secondaryLabel} — Duplicates (Primary)`, p.duplicates.primary.map(flattenTransaction));
    addSheet(`${secondaryLabel} — Duplicates (${secondaryLabel})`, p.duplicates.secondary.map(flattenTransaction));
    addSheet(`${secondaryLabel} — Sign Reversal Hints`, p.signReversalHints.map(flattenExceptionPair));
    addSheet(`${secondaryLabel} — Dropped (Primary)`, p.summary.invalidPrimaryRowData);
    addSheet(`${secondaryLabel} — Dropped (${secondaryLabel})`, p.summary.invalidSecondaryRowData);
  }

  addSheet(
    "Cross-Source Breakdown",
    result.crossSourceBreakdown.map((b) => ({
      Label: b.label,
      Count: b.count,
      "Problem Sources": b.problemSources.join(", "),
    }))
  );

  if (exportedSheets.length === 0) {
    return { exportedSheets };
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  XLSX.writeFile(workbook, `multi-source-reconciliation-${timestamp}.xlsx`);

  return { exportedSheets };
}
