"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { multiSourceApi } from "./api";
import type { MultiSourceResult, SecondarySourceInput } from "./types";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `secondary-${idCounter}`;
}

export function useMultiSource() {
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryLabel, setPrimaryLabel] = useState("Bank");
  const [secondarySources, setSecondarySources] = useState<SecondarySourceInput[]>([
    { id: nextId(), label: "Tally", file: null },
  ]);

  const [result, setResult] = useState<MultiSourceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [wasRestored, setWasRestored] = useState(false);

  // Same restore-on-mount behavior as reconciliation's useReconciliation —
  // survives a refresh/crash because the result was already durably
  // saved server-side the moment the reconciliation finished.
  useEffect(() => {
    let cancelled = false;
    multiSourceApi
      .getLatest()
      .then((res) => {
        if (cancelled) return;
        if (res.run) {
          setResult(res.run.result);
          setWasRestored(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addSecondarySource = useCallback(() => {
    setSecondarySources((prev) => [...prev, { id: nextId(), label: "", file: null }]);
  }, []);

  const removeSecondarySource = useCallback((id: string) => {
    setSecondarySources((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  }, []);

  const updateSecondarySource = useCallback((id: string, patch: Partial<SecondarySourceInput>) => {
    setSecondarySources((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const canSubmit =
    primaryFile !== null &&
    primaryLabel.trim().length > 0 &&
    secondarySources.some((s) => s.file !== null && s.label.trim().length > 0);

  const submit = useCallback(async () => {
    if (!primaryFile) {
      setError("Choose a primary file first.");
      return;
    }
    const ready = secondarySources.filter((s) => s.file !== null && s.label.trim().length > 0);
    if (ready.length === 0) {
      setError("Add at least one secondary source with both a file and a label.");
      return;
    }
    const labels = ready.map((s) => s.label.trim());
    if (new Set(labels).size !== labels.length) {
      setError("Secondary source labels must be unique.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setWasRestored(false);
    try {
      const response = await multiSourceApi.reconcile(primaryFile, primaryLabel.trim(), ready);
      setResult(response);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Multi-source reconciliation failed for an unknown reason.");
    } finally {
      setIsLoading(false);
    }
  }, [primaryFile, primaryLabel, secondarySources]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setWasRestored(false);
    setPrimaryFile(null);
    setPrimaryLabel("Bank");
    setSecondarySources([{ id: nextId(), label: "Tally", file: null }]);
  }, []);

  return {
    primaryFile,
    setPrimaryFile,
    primaryLabel,
    setPrimaryLabel,
    secondarySources,
    addSecondarySource,
    removeSecondarySource,
    updateSecondarySource,
    canSubmit,
    result,
    isLoading,
    error,
    isRestoring,
    wasRestored,
    submit,
    reset,
  };
}
