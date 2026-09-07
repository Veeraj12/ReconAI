import { apiClient } from "@/lib/api-client";
import type { MultiSourceResult, SecondarySourceInput } from "./types";

export interface LatestMultiSourceRunResponse {
  success: true;
  run: { runType: "single" | "multi"; result: MultiSourceResult; createdAt: string } | null;
}

export const multiSourceApi = {
  reconcile: (
    primaryFile: File,
    primaryLabel: string,
    secondarySources: SecondarySourceInput[]
  ) => {
    const formData = new FormData();
    formData.append("primary_file", primaryFile);
    formData.append("primary_label", primaryLabel);
    for (const source of secondarySources) {
      if (!source.file) continue;
      formData.append("secondary_files", source.file);
      formData.append("secondary_labels", source.label);
    }
    return apiClient.postForm<MultiSourceResult>("/api/v1/reconcile/multi/", formData);
  },

  // Same durability story as reconciliation/api.ts's getLatest — see
  // ReconciliationRun in the backend's models.py.
  getLatest: () =>
    apiClient.get<LatestMultiSourceRunResponse>("/api/v1/reconciliation-runs/latest/?type=multi"),
};
