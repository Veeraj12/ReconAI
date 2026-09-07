import {
  CheckCircle2,
  Lightbulb,
  CircleHelp,
  Compass,
  RotateCw,
  BadgeCheck,
  BadgeAlert,
  Cpu,
  CircleX,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import type { PatternExplanation } from "../types";
import type { CauseFeedbackState } from "../useAnalysis";
import { getCauseConfidenceMeta } from "../patternTypeMeta";

interface ExplanationViewProps {
  explanation: PatternExplanation;
  onRegenerate: () => void;
  isRegenerating: boolean;
  /** Only accountant/admin can confirm/reject a suggested cause —
   * matches the backend's IsAccountantOrAdmin restriction on
   * /causes/feedback/. Viewers still see the explanation, just not
   * the feedback buttons. */
  canSubmitFeedback: boolean;
  causeFeedback: Record<string, CauseFeedbackState>;
  onSubmitFeedback: (causeId: string, confirmed: boolean) => void;
}

export function ExplanationView({
  explanation,
  onRegenerate,
  isRegenerating,
  canSubmitFeedback,
  causeFeedback,
  onSubmitFeedback,
}: ExplanationViewProps) {
  return (
    <div className="animate-fade-in-up space-y-4 rounded-lg border border-border-app bg-bg-panel p-4">
      {/* Provenance strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-app pb-3">
        <div className="flex items-center gap-2 text-[11px] text-text-secondary">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-row-alt px-2 py-1 font-medium">
            <Cpu className="h-3.5 w-3.5" />
            Generated locally from a rule-based knowledge base — no external AI service used
          </span>
          {explanation.from_cache && (
            <span className="rounded-md bg-row-alt px-2 py-1 font-medium">Cached</span>
          )}
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-1.5 rounded-md border border-border-app px-2.5 py-1.5 text-[11px] font-medium text-text-secondary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCw className={`h-3 w-3 ${isRegenerating ? "animate-spin-slow" : ""}`} />
          Regenerate
        </button>
      </div>

      {explanation.validation_warnings.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-[11px] text-warning">
          <BadgeAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div className="space-y-1">
            {explanation.validation_warnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </div>
        </div>
      )}

      <p className="text-[13px] font-medium leading-relaxed text-text-primary">{explanation.summary}</p>

      {/* FACT */}
      {explanation.facts.length > 0 && (
        <section>
          <SectionLabel icon={CheckCircle2} tone="text-success" text="Fact" />
          <ul className="mt-1.5 space-y-1">
            {explanation.facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-primary">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                {fact}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* LIKELY CAUSE(S) */}
      {explanation.possible_causes.length > 0 && (
        <section>
          <SectionLabel icon={Lightbulb} tone="text-warning" text="Likely cause" />
          <div className="mt-1.5 space-y-2">
            {explanation.possible_causes.map((cause, i) => {
              const meta = getCauseConfidenceMeta(cause.confidence_level);
              return (
                <div key={i} className="rounded-md border border-border-app bg-row-alt/50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-text-primary">{cause.cause}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        meta.tone === "success"
                          ? "bg-success-soft text-success"
                          : meta.tone === "warning"
                          ? "bg-warning-soft text-warning"
                          : "bg-row-alt text-text-secondary"
                      }`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  {cause.supporting_evidence.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {cause.supporting_evidence.map((ev, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-[11px] text-text-secondary">
                          <span className="mt-1 h-0.5 w-0.5 shrink-0 rounded-full bg-text-secondary" />
                          {ev}
                        </li>
                      ))}
                    </ul>
                  )}
                  {cause.contradicting_evidence.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {cause.contradicting_evidence.map((ev, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-[11px] text-danger/80">
                          <span className="mt-1 h-0.5 w-0.5 shrink-0 rounded-full bg-danger/60" />
                          Against: {ev}
                        </li>
                      ))}
                    </ul>
                  )}

                  {canSubmitFeedback && (
                    <CauseFeedbackControls
                      state={causeFeedback[`${explanation.pattern_id}:${cause.cause_id}`] ?? { status: "idle" }}
                      onConfirm={() => onSubmitFeedback(cause.cause_id, true)}
                      onReject={() => onSubmitFeedback(cause.cause_id, false)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* UNKNOWN */}
      {explanation.unknowns.length > 0 && (
        <section>
          <SectionLabel icon={CircleHelp} tone="text-text-secondary" text="Unknown" />
          <ul className="mt-1.5 space-y-1">
            {explanation.unknowns.map((u, i) => (
              <li key={i} className="flex items-start gap-2 text-xs italic text-text-secondary">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-secondary/60" />
                {u}
              </li>
            ))}
          </ul>
        </section>
      )}

      {explanation.recommended_investigation && (
        <section className="rounded-md border border-accent/25 bg-accent-soft p-2.5">
          <SectionLabel icon={Compass} tone="text-accent-dark" text="Recommended investigation" />
          <p className="mt-1 text-xs text-text-primary">{explanation.recommended_investigation}</p>
        </section>
      )}

      {explanation.evidence_references.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer select-none text-[11px] font-medium text-text-secondary hover:text-text-primary">
            {explanation.evidence_references.length} evidence reference
            {explanation.evidence_references.length === 1 ? "" : "s"} cited
          </summary>
          <ul className="mt-2 space-y-1.5">
            {explanation.evidence_references.map((ref, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-text-secondary">
                {ref.grounded ? (
                  <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                ) : (
                  <BadgeAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
                )}
                <span>
                  {ref.claim}{" "}
                  <span className="tabular-data text-text-secondary/70">[{ref.feature}]</span>
                  {!ref.grounded && <span className="ml-1 font-medium text-danger">unverified</span>}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="border-t border-border-app pt-2 text-[10px] leading-relaxed text-text-secondary/80">
        {explanation.confidence_methodology}
      </p>
    </div>
  );
}

function SectionLabel({ icon: Icon, tone, text }: { icon: LucideIcon; tone: string; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-3.5 w-3.5 ${tone}`} strokeWidth={2.25} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${tone}`}>{text}</span>
    </div>
  );
}

function CauseFeedbackControls({
  state,
  onConfirm,
  onReject,
}: {
  state: CauseFeedbackState;
  onConfirm: () => void;
  onReject: () => void;
}) {
  // Training data for the learned scorer (backend
  // analytics/explanation/learning/) — every click here becomes one
  // row in CauseFeedback, which the scorer improves from over time.
  // See learning/README.md for the full loop this feeds.
  if (state.status === "submitted") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
        {state.confirmed ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
        ) : (
          <CircleX className="h-3.5 w-3.5 text-danger" />
        )}
        {state.confirmed ? "Marked as correct" : "Marked as incorrect"} — thanks, this helps future suggestions.
      </p>
    );
  }

  if (state.status === "submitting") {
    return (
      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-text-secondary">
        <Loader2 className="h-3.5 w-3.5 animate-spin-slow" />
        Recording your feedback…
      </p>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-[10px] text-text-secondary">Was this cause correct?</span>
      <button
        type="button"
        onClick={onConfirm}
        className="flex items-center gap-1 rounded-md border border-success/30 px-2 py-1 text-[10px] font-medium text-success transition-all duration-150 hover:bg-success-soft active:scale-95"
      >
        <CheckCircle2 className="h-3 w-3" />
        Yes
      </button>
      <button
        type="button"
        onClick={onReject}
        className="flex items-center gap-1 rounded-md border border-danger/30 px-2 py-1 text-[10px] font-medium text-danger transition-all duration-150 hover:bg-danger/10 active:scale-95"
      >
        <CircleX className="h-3 w-3" />
        No
      </button>
      {state.status === "error" && (
        <span className="text-[10px] text-danger">{state.message}</span>
      )}
    </div>
  );
}
