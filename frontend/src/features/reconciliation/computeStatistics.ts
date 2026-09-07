import type { MatchingRule, ReconciliationSummary } from "./types";

export interface DerivedStatistics {
  referenceMatches: number;
  dateToleranceMatches: number;
  amountDateMatches: number;
  duplicateEntries: number;
  matchPercentage: number;
  totalMismatch: number;
  ruleCounts: Record<MatchingRule, number>;
}

/**
 * Direct port of statistics.js's calculateStatistics(). The backend's
 * `summary` object is already authoritative for every one of these
 * values — this just reshapes it for the chart components, same as
 * the original did after the earlier fix that stopped recomputing
 * these client-side from the full (potentially 100K+ row) transaction
 * array.
 */
export function computeStatistics(summary: ReconciliationSummary): DerivedStatistics {
  return {
    referenceMatches: summary.referenceMatches ?? 0,
    dateToleranceMatches: summary.dateToleranceMatches ?? 0,
    amountDateMatches: summary.amountDateMatches ?? 0,
    duplicateEntries: summary.duplicateEntries ?? 0,
    matchPercentage: summary.matchPercentage,
    totalMismatch: summary.missingInBank + summary.missingInTally,
    ruleCounts: {
      REFERENCE: summary.referenceMatches ?? 0,
      REFERENCE_DATE_TOLERANCE: summary.dateToleranceMatches ?? 0,
      AMOUNT_DATE: summary.amountDateMatches ?? 0,
    },
  };
}
