import { apiClient } from "@/lib/api-client";
import type { ReconciliationResult } from "./types";

export interface LatestRunResponse {
  success: true;
  run: { runType: "single" | "multi"; result: ReconciliationResult; createdAt: string } | null;
}

export const reconciliationApi = {
  upload: (bankFile: File, tallyFile: File) => {
    const formData = new FormData();
    formData.append("bank_file", bankFile);
    formData.append("tally_file", tallyFile);
    return apiClient.postForm<ReconciliationResult>("/api/v1/reconcile/", formData);
  },

  // Restores the last reconciliation this user ran, if the backend
  // still has it persisted — see ReconciliationRun in the backend's
  // models.py for why this survives a refresh/crash/server restart
  // rather than living only in this tab's React state.
  getLatest: () =>
    apiClient.get<LatestRunResponse>("/api/v1/reconciliation-runs/latest/?type=single"),
};
