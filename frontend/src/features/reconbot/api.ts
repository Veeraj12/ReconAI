import { apiClient } from "@/lib/api-client";
import type { ReconciliationResult } from "../reconciliation/types";
import type { BotApiResponse, BotContextPayload } from "./types";

function buildReconciliationPayload(data: ReconciliationResult) {
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

export const reconbotApi = {
  ask: (message: string, data: ReconciliationResult, context: BotContextPayload | null) =>
    apiClient.post<BotApiResponse>("/api/v1/reconbot/ask/", {
      message,
      reconciliation: buildReconciliationPayload(data),
      summary: data.summary,
      context: context ?? undefined,
    }),
};
