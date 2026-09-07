// Phase 1/2 exception_ids are synthetic (e.g. "AMOUNT_MISMATCH:B214:T87")
// built from the excelRow(s) involved — see
// backend/parser/analytics/features.py's module docstring ("A NOTE ON
// IDENTITY"). Rather than asking the backend for full per-transaction
// detail (which Phase 2's /analyze/ response deliberately omits, to
// keep that payload small — see ARCHITECTURE.md §15), we can resolve
// every exception_id straight back to the actual record the frontend
// already has in memory from the original /reconcile/ response. This
// keeps "view the transactions behind this pattern" free of any extra
// network round trip.

import type {
  ExceptionPair,
  GroupedMatch,
  ReconciliationResult,
  Transaction,
} from "../reconciliation/types";
import type { Pattern } from "./types";

export interface ResolvedEntry {
  exceptionId: string;
  date: string | null;
  bankRow: number | null;
  tallyRow: number | null;
  bankAmount: number | null;
  tallyAmount: number | null;
  reference: string | null;
  difference: number | null;
  groupSize?: number;
}

interface ParsedId {
  type: string;
  bankRow: number | null;
  tallyRow: number | null;
  direction: string | null;
}

function parseExceptionId(id: string): ParsedId {
  const parts = id.split(":");
  const type = parts[0] ?? "";
  let bankRow: number | null = null;
  let tallyRow: number | null = null;
  let direction: string | null = null;

  for (const part of parts.slice(1)) {
    if (part.startsWith("B")) bankRow = Number(part.slice(1));
    else if (part.startsWith("T")) tallyRow = Number(part.slice(1));
    else direction = part;
  }

  return { type, bankRow, tallyRow, direction };
}

export function buildExceptionResolver(data: ReconciliationResult) {
  const pairMap = new Map<string, ExceptionPair>();
  const indexPairs = (pairs: ExceptionPair[]) => {
    for (const pair of pairs) {
      pairMap.set(`${pair.bankTransaction.excelRow}:${pair.tallyTransaction.excelRow}`, pair);
    }
  };
  indexPairs(data.exceptions.amountMismatches);
  indexPairs(data.exceptions.typeMismatches);
  indexPairs(data.signReversalHints);

  const missingInTallyMap = new Map<number, Transaction>(
    data.missingInTally.map((t) => [t.excelRow, t])
  );
  const missingInBankMap = new Map<number, Transaction>(
    data.missingInBank.map((t) => [t.excelRow, t])
  );
  const duplicateBankMap = new Map<number, Transaction>(
    data.duplicates.bank.map((t) => [t.excelRow, t])
  );
  const duplicateTallyMap = new Map<number, Transaction>(
    data.duplicates.tally.map((t) => [t.excelRow, t])
  );
  const groupedMap = new Map<string, GroupedMatch>(
    data.exceptions.groupedMatches.map((g) => [
      `${g.direction}:${g.oneTransaction.excelRow}`,
      g,
    ])
  );

  function resolveIds(exceptionIds: string[]): ResolvedEntry[] {
    const entries: ResolvedEntry[] = [];

    for (const exceptionId of exceptionIds) {
      const { type, bankRow, tallyRow, direction } = parseExceptionId(exceptionId);

      if (type === "AMOUNT_MISMATCH" || type === "TYPE_MISMATCH" || type === "SIGN_REVERSAL_HINT") {
        const pair = pairMap.get(`${bankRow}:${tallyRow}`);
        if (pair) {
          entries.push({
            exceptionId,
            date: pair.bankTransaction.date,
            bankRow: pair.bankTransaction.excelRow,
            tallyRow: pair.tallyTransaction.excelRow,
            bankAmount: pair.bankTransaction.amount,
            tallyAmount: pair.tallyTransaction.amount,
            reference: pair.bankTransaction.reference || pair.tallyTransaction.reference,
            difference: pair.amountDifference ?? pair.bankTransaction.amount - pair.tallyTransaction.amount,
          });
        }
        continue;
      }

      if (type === "MISSING_IN_TALLY" && bankRow !== null) {
        const txn = missingInTallyMap.get(bankRow);
        if (txn) {
          entries.push({
            exceptionId, date: txn.date, bankRow: txn.excelRow, tallyRow: null,
            bankAmount: txn.amount, tallyAmount: null, reference: txn.reference, difference: null,
          });
        }
        continue;
      }

      if (type === "MISSING_IN_BANK" && tallyRow !== null) {
        const txn = missingInBankMap.get(tallyRow);
        if (txn) {
          entries.push({
            exceptionId, date: txn.date, bankRow: null, tallyRow: txn.excelRow,
            bankAmount: null, tallyAmount: txn.amount, reference: txn.reference, difference: null,
          });
        }
        continue;
      }

      if (type === "DUPLICATE_BANK" && bankRow !== null) {
        const txn = duplicateBankMap.get(bankRow);
        if (txn) {
          entries.push({
            exceptionId, date: txn.date, bankRow: txn.excelRow, tallyRow: null,
            bankAmount: txn.amount, tallyAmount: null, reference: txn.reference, difference: null,
          });
        }
        continue;
      }

      if (type === "DUPLICATE_TALLY" && tallyRow !== null) {
        const txn = duplicateTallyMap.get(tallyRow);
        if (txn) {
          entries.push({
            exceptionId, date: txn.date, bankRow: null, tallyRow: txn.excelRow,
            bankAmount: null, tallyAmount: txn.amount, reference: txn.reference, difference: null,
          });
        }
        continue;
      }

      if (type === "GROUPED_MATCH" && direction) {
        const row = bankRow ?? tallyRow;
        const group = groupedMap.get(`${direction}:${row}`);
        if (group) {
          const isBankOne = direction === "TALLY_MANY_TO_BANK_ONE";
          entries.push({
            exceptionId,
            date: group.date,
            bankRow: isBankOne ? group.oneTransaction.excelRow : null,
            tallyRow: isBankOne ? null : group.oneTransaction.excelRow,
            bankAmount: isBankOne ? group.oneTransaction.amount : group.amount,
            tallyAmount: isBankOne ? group.amount : group.oneTransaction.amount,
            reference: group.oneTransaction.reference,
            difference: 0,
            groupSize: group.manyTransactions.length,
          });
        }
      }
    }

    return entries;
  }

  return {
    // Resolves every exception_id on a Pattern — the original use case
    // (Phase 2 pattern drill-down).
    resolve: (pattern: Pattern): ResolvedEntry[] => resolveIds(pattern.exception_ids),
    // Resolves a plain list of exception_ids directly — used by Recon
    // Bot, which references IDs without necessarily having a full
    // Pattern object on hand (e.g. after a plain exception-type count
    // question, not a pattern-specific one).
    resolveIds,
  };
}
