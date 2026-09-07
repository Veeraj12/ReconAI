"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { useReconciliationContext } from "../reconciliation/ReconciliationProvider";
import { analysisApi } from "./api";
import { buildExceptionAnalysisPayload } from "./buildPayload";
import type { ExceptionAnalysisPayload, Pattern, PatternAnalysisResult, PatternExplanation } from "./types";

export type ExplanationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; explanation: PatternExplanation }
  | { status: "error"; message: string };

export type CauseFeedbackState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "submitted"; confirmed: boolean }
  | { status: "error"; message: string };

interface UseAnalysisResult {
  result: PatternAnalysisResult | null;
  isAnalyzing: boolean;
  analyzeError: string | null;
  hasAnalyzed: boolean;
  analyze: () => Promise<void>;
  explanations: Record<string, ExplanationState>;
  explainPattern: (pattern: Pattern, opts?: { regenerate?: boolean }) => Promise<void>;
  causeFeedback: Record<string, CauseFeedbackState>;
  submitCauseFeedback: (patternId: string, causeId: string, confirmed: boolean) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisResult {
  const { data } = useReconciliationContext();

  const [result, setResult] = useState<PatternAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, ExplanationState>>({});
  // Keyed by `${patternId}:${causeId}` so feedback on two different
  // causes shown for the same pattern never overwrites each other.
  const [causeFeedback, setCauseFeedback] = useState<Record<string, CauseFeedbackState>>({});

  // The payload the analytics endpoints need is just a slice of `data`
  // — keep a ref so explainPattern doesn't need `data` in its own
  // dependency array (it's only ever called after analyze() already
  // ran against the same data).
  const payloadRef = useRef<ExceptionAnalysisPayload | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setAnalyzeError(null);
    setExplanations({});
    setCauseFeedback({});
    payloadRef.current = null;
  }, []);

  // A fresh reconciliation result (new upload, or a reset to the empty
  // state) invalidates any previous pattern analysis and explanations —
  // they were computed against different underlying data.
  useEffect(() => {
    reset();
  }, [data, reset]);

  const analyze = useCallback(async () => {
    if (!data) return;
    setIsAnalyzing(true);
    setAnalyzeError(null);
    try {
      const payload = buildExceptionAnalysisPayload(data);
      payloadRef.current = payload;
      const response = await analysisApi.analyze(payload);
      setResult(response);
    } catch (err) {
      setAnalyzeError(err instanceof ApiError ? err.message : "Pattern analysis failed for an unknown reason.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [data]);

  const explainPattern = useCallback(
    async (pattern: Pattern, opts?: { regenerate?: boolean }) => {
      const existing = explanations[pattern.pattern_id];
      if (!opts?.regenerate && (existing?.status === "loading" || existing?.status === "loaded")) {
        return;
      }
      if (!payloadRef.current) return;

      setExplanations((prev) => ({ ...prev, [pattern.pattern_id]: { status: "loading" } }));
      try {
        const response = await analysisApi.explainPattern(pattern.pattern_id, payloadRef.current);
        if (response.explanation) {
          setExplanations((prev) => ({
            ...prev,
            [pattern.pattern_id]: { status: "loaded", explanation: response.explanation as PatternExplanation },
          }));
        } else {
          setExplanations((prev) => ({
            ...prev,
            [pattern.pattern_id]: {
              status: "error",
              message: response.error || "The explanation could not be generated.",
            },
          }));
        }
      } catch (err) {
        setExplanations((prev) => ({
          ...prev,
          [pattern.pattern_id]: {
            status: "error",
            message: err instanceof ApiError ? err.message : "Explanation request failed for an unknown reason.",
          },
        }));
      }
    },
    [explanations]
  );

  const submitCauseFeedback = useCallback(async (patternId: string, causeId: string, confirmed: boolean) => {
    if (!payloadRef.current) return;
    const key = `${patternId}:${causeId}`;

    setCauseFeedback((prev) => ({ ...prev, [key]: { status: "submitting" } }));
    try {
      await analysisApi.submitCauseFeedback(patternId, {
        ...payloadRef.current,
        causeId,
        confirmed,
      });
      setCauseFeedback((prev) => ({ ...prev, [key]: { status: "submitted", confirmed } }));
    } catch (err) {
      setCauseFeedback((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          message: err instanceof ApiError ? err.message : "Feedback could not be submitted.",
        },
      }));
    }
  }, []);

  return {
    result,
    isAnalyzing,
    analyzeError,
    hasAnalyzed: result !== null,
    analyze,
    explanations,
    explainPattern,
    causeFeedback,
    submitCauseFeedback,
    reset,
  };
}
