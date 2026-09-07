import type { ReconciliationResult } from "../reconciliation/types";
import type { ExceptionAnalysisPayload } from "./types";

/** Both /exceptions/analyze/ and /exceptions/patterns/<id>/explain/
 * accept exactly this slice of the reconcile response — see
 * backend/parser/analytics/ARCHITECTURE.md §15 for why (reconciliation
 * is stateless, so there's nothing to fetch by ID server-side; the
 * frontend already holds this data, so it's sent straight through). */
export function buildExceptionAnalysisPayload(data: ReconciliationResult): ExceptionAnalysisPayload {
  return {
    exceptions: {
      amountMismatches: data.exceptions.amountMismatches,
      typeMismatches: data.exceptions.typeMismatches,
      groupedMatches: data.exceptions.groupedMatches,
    },
    missingInBank: data.missingInBank,
    missingInTally: data.missingInTally,
    duplicates: data.duplicates,
    signReversalHints: data.signReversalHints,
  };
}
