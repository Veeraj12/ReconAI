"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ListOrdered,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Pattern } from "../types";
import type { ExplanationState } from "../useAnalysis";
import { getPatternTypeMeta } from "../patternTypeMeta";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { ExplanationView } from "./ExplanationView";
import { PatternTransactionsTable } from "./PatternTransactionsTable";
import type { ResolvedEntry } from "../resolveExceptions";
import type { CauseFeedbackState } from "../useAnalysis";

interface PatternCardProps {
  pattern: Pattern;
  rank: number;
  explanationState: ExplanationState;
  onExplain: () => void;
  onRegenerate: () => void;
  resolveEntries: (pattern: Pattern) => ResolvedEntry[];
  canSubmitFeedback: boolean;
  causeFeedback: Record<string, CauseFeedbackState>;
  onSubmitCauseFeedback: (causeId: string, confirmed: boolean) => void;
}

const STAT_LABELS: Record<string, string> = {
  reference_match_rate: "Reference match",
  amount_match_rate: "Amount match",
  date_match_rate: "Date match",
  average_absolute_amount_difference: "Avg. difference",
  median_absolute_amount_difference: "Median difference",
  average_percentage_difference: "Avg. % difference",
  common_date_offset_days: "Date offset",
};

function formatStat(key: string, value: number): string {
  if (key.endsWith("_rate")) return `${Math.round(value * 100)}%`;
  if (key === "common_date_offset_days") return `${value} day${value === 1 ? "" : "s"}`;
  if (key === "average_percentage_difference") return `${value.toFixed(2)}%`;
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatCurrency(value: number): string {
  return `₹${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function PatternCard({
  pattern,
  rank,
  explanationState,
  onExplain,
  onRegenerate,
  resolveEntries,
  canSubmitFeedback,
  causeFeedback,
  onSubmitCauseFeedback,
}: PatternCardProps) {
  const [showTransactions, setShowTransactions] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const meta = getPatternTypeMeta(pattern.pattern_type);
  const Icon = meta.icon;

  const entries = useMemo(
    () => (showTransactions ? resolveEntries(pattern) : []),
    [showTransactions, resolveEntries, pattern]
  );

  const statEntries = Object.entries(pattern.common_features).filter(
    ([key, value]) => value !== null && value !== undefined && STAT_LABELS[key]
  ) as [string, number][];

  return (
    <div className="animate-fade-in-up overflow-hidden rounded-xl border border-border-app bg-bg-panel shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-row-alt text-text-secondary">
              <Icon className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-text-secondary">#{rank}</span>
                <h4 className="font-display text-[15px] font-semibold leading-tight text-text-primary">
                  {meta.label}
                </h4>
                <StatusBadge tone={meta.tone}>{pattern.exception_type.replace(/_/g, " ")}</StatusBadge>
              </div>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-text-secondary">{pattern.summary}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="tabular-data text-lg font-bold text-text-primary">
              {pattern.record_count.toLocaleString()}
              <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                records
              </span>
            </span>
            {pattern.total_financial_impact > 0 && (
              <span className="tabular-data text-xs font-semibold text-danger">
                {formatCurrency(pattern.total_financial_impact)} impact
              </span>
            )}
            <ConfidenceMeter value={pattern.confidence} />
          </div>
        </div>

        {statEntries.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-2">
            {statEntries.map(([key, value]) => (
              <span
                key={key}
                className="tabular-data rounded-md border border-border-app bg-row-alt/60 px-2 py-1 text-[11px] font-medium text-text-secondary"
              >
                {STAT_LABELS[key]}: <span className="text-text-primary">{formatStat(key, value)}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-app pt-3.5">
          <ExplainButton
            state={explanationState}
            onExplain={onExplain}
            isExplanationVisible={showExplanation}
            onToggleVisibility={() => setShowExplanation((v) => !v)}
          />

          <button
            type="button"
            onClick={() => setShowTransactions((v) => !v)}
            className="flex items-center gap-1.5 rounded-md border border-border-app px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95"
          >
            <ListOrdered className="h-3.5 w-3.5" />
            {showTransactions ? "Hide" : "View"} Transactions
            <span className="tabular-data text-[10px] text-text-secondary">({pattern.record_count})</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${showTransactions ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {explanationState.status === "loaded" && showExplanation && (
        <div className="border-t border-border-app px-4 pb-4 pt-4">
          <ExplanationView
            explanation={explanationState.explanation}
            onRegenerate={onRegenerate}
            isRegenerating={false}
            canSubmitFeedback={canSubmitFeedback}
            causeFeedback={causeFeedback}
            onSubmitFeedback={onSubmitCauseFeedback}
          />
        </div>
      )}

      {explanationState.status === "error" && (
        <div className="flex items-start gap-2 border-t border-border-app bg-danger-soft px-4 py-3 text-xs text-danger">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            <p className="font-medium">Explanation failed to generate.</p>
            <p className="mt-0.5 text-danger/80">{explanationState.message}</p>
            <button
              type="button"
              onClick={onExplain}
              className="mt-1.5 font-semibold underline underline-offset-2 hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {showTransactions && (
        <div className="border-t border-border-app p-4">
          <PatternTransactionsTable entries={entries} />
        </div>
      )}
    </div>
  );
}

function ExplainButton({
  state,
  onExplain,
  isExplanationVisible,
  onToggleVisibility,
}: {
  state: ExplanationState;
  onExplain: () => void;
  isExplanationVisible: boolean;
  onToggleVisibility: () => void;
}) {
  if (state.status === "loading") {
    return (
      <button
        type="button"
        disabled
        className="flex items-center gap-1.5 rounded-md bg-accent/50 px-3 py-1.5 text-xs font-semibold text-white"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin-slow" />
        Generating explanation…
      </button>
    );
  }

  if (state.status === "loaded") {
    return (
      <button
        type="button"
        onClick={onToggleVisibility}
        className="flex items-center gap-1.5 rounded-md bg-success-soft px-3 py-1.5 text-xs font-semibold text-success transition-all duration-150 hover:brightness-95 active:scale-95"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {isExplanationVisible ? "Hide Explanation" : "Show Explanation"}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${isExplanationVisible ? "rotate-180" : ""}`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onExplain}
      className="group flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-accent-dark active:scale-95"
    >
      <Sparkles className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
      {state.status === "error" ? "Retry Explanation" : "Explain This Pattern"}
    </button>
  );
}
