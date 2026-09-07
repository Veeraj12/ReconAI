"use client";

import { useCallback, useEffect, useState } from "react";
import { reconciliationApi } from "./api";
import type { ReconciliationResult } from "./types";
import { ApiError } from "@/lib/api-client";

interface UseReconciliationResult {
  data: ReconciliationResult | null;
  isLoading: boolean;
  error: string | null;
  /** True right after mount while we check whether a previous
   * session's result can be restored from the server — lets the UI
   * show a brief "checking for saved work…" state instead of
   * flashing the empty upload form before a restored result appears. */
  isRestoring: boolean;
  /** True for the render cycle where `data` just came back from the
   * server rather than from a fresh upload — the UI uses this to
   * show a one-time "Restored your last session" notice. */
  wasRestored: boolean;
  upload: (bankFile: File, tallyFile: File) => Promise<void>;
  reset: () => void;
}

export function useReconciliation(): UseReconciliationResult {
  const [data, setData] = useState<ReconciliationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [wasRestored, setWasRestored] = useState(false);

  // On first mount, ask the backend whether this user has a
  // previously-finished reconciliation sitting in ReconciliationRun —
  // this is what makes a page refresh (or the whole browser crashing)
  // non-destructive: the data was never only in this tab's memory.
  useEffect(() => {
    let cancelled = false;
    reconciliationApi
      .getLatest()
      .then((res) => {
        if (cancelled) return;
        if (res.run) {
          setData(res.run.result);
          setWasRestored(true);
        }
      })
      .catch(() => {
        // No saved run, or the check failed — either way, fall back
        // silently to the normal empty-state upload form. This is a
        // convenience restore, not something the user should ever see
        // an error about.
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const upload = useCallback(async (bankFile: File, tallyFile: File) => {
    setIsLoading(true);
    setError(null);
    setWasRestored(false);
    try {
      const result = await reconciliationApi.upload(bankFile, tallyFile);
      setData(result);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Upload failed for an unknown reason."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setWasRestored(false);
  }, []);

  return { data, isLoading, error, isRestoring, wasRestored, upload, reset };
}
