import { Layers, CheckCircle2, CircleAlert, CircleX } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import type { MultiSourceResult } from "../types";

export function CrossSourceSummaryCards({ result }: { result: MultiSourceResult }) {
  const { summary } = result;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <MetricCard
          icon={Layers}
          label="Primary Transactions"
          value={summary.totalPrimaryTransactions.toLocaleString()}
          tone="neutral"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Fully Reconciled"
          value={summary.fullyReconciled.toLocaleString()}
          tone="success"
          subtitle={
            summary.totalPrimaryTransactions
              ? `${Math.round((summary.fullyReconciled / summary.totalPrimaryTransactions) * 100)}%`
              : undefined
          }
        />
        <MetricCard
          icon={CircleAlert}
          label="Partially Reconciled"
          value={summary.partiallyReconciled.toLocaleString()}
          tone={summary.partiallyReconciled > 0 ? "accent" : "neutral"}
        />
        <MetricCard
          icon={CircleX}
          label="Unreconciled"
          value={summary.unreconciled.toLocaleString()}
          tone={summary.unreconciled > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(summary.perSource).map(([name, s]) => (
          <div key={name} className="rounded-xl border border-border-app bg-bg-panel p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-semibold text-text-primary">{name}</h4>
              <span className="tabular-data text-xs font-bold text-text-secondary">
                {s.matchPercentage}% matched
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-row-alt">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${Math.min(100, s.matchPercentage)}%` }}
              />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-[11px]">
              <dt className="text-text-secondary">Matched</dt>
              <dd className="tabular-data text-right font-semibold text-text-primary">{s.matched.toLocaleString()}</dd>
              <dt className="text-text-secondary">Missing</dt>
              <dd className="tabular-data text-right font-semibold text-danger">{s.missing.toLocaleString()}</dd>
              <dt className="text-text-secondary">Amount mismatches</dt>
              <dd className="tabular-data text-right font-semibold text-text-primary">{s.amountMismatches.toLocaleString()}</dd>
              <dt className="text-text-secondary">Duplicates</dt>
              <dd className="tabular-data text-right font-semibold text-text-primary">{s.duplicates.toLocaleString()}</dd>
            </dl>
          </div>
        ))}
      </div>

      {Object.keys(result.secondarySourceErrors).length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning-soft px-3.5 py-2.5 text-xs text-warning">
          <p className="font-semibold">Some secondary sources could not be reconciled:</p>
          <ul className="mt-1 space-y-0.5">
            {Object.entries(result.secondarySourceErrors).map(([name, message]) => (
              <li key={name}>
                <span className="font-medium">{name}:</span> {message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
