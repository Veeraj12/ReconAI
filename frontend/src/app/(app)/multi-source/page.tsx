"use client";

import { RotateCw, Cloud, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useMultiSource } from "@/features/multiSource/useMultiSource";
import { MultiSourceUploadForm } from "@/features/multiSource/components/MultiSourceUploadForm";
import { CrossSourceSummaryCards } from "@/features/multiSource/components/CrossSourceSummaryCards";
import { CrossSourceBreakdownList } from "@/features/multiSource/components/CrossSourceBreakdownList";
import { SourceDrilldown } from "@/features/multiSource/components/SourceDrilldown";
import { SkeletonMetricCards } from "@/components/ui/Skeleton";
import { exportMultiSourceToExcel } from "@/features/export/exportMultiSourceToExcel";

export default function MultiSourcePage() {
  const hook = useMultiSource();
  const { result, reset, isRestoring, wasRestored } = hook;
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (isRestoring) {
    return (
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <SkeletonMetricCards />
      </div>
    );
  }

  function handleExport() {
    if (!result) return;
    const { exportedSheets } = exportMultiSourceToExcel(result);
    setExportNotice(
      exportedSheets.length > 0
        ? `Downloaded ${exportedSheets.length} sheet${exportedSheets.length === 1 ? "" : "s"}.`
        : "Nothing to export — every category was empty for this run."
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      {!result ? (
        <MultiSourceUploadForm hook={hook} />
      ) : (
        <div className="animate-stagger space-y-6">
          {wasRestored && (
            <div className="flex animate-scale-in items-center gap-2 rounded-md border border-success/25 bg-success-soft px-3.5 py-2.5 text-xs font-medium text-success">
              <Cloud className="h-4 w-4 shrink-0" />
              Restored your last multi-source run — saved automatically, so a refresh or connection
              drop never loses your work.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="font-display text-lg font-semibold text-text-primary">
                {result.primarySource} vs. {result.secondarySources.join(", ")}
              </h1>
              <p className="text-xs text-text-secondary">Multi-source reconciliation results</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-accent-dark active:scale-95"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Export all as Excel
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-md border border-border-app px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95"
              >
                <RotateCw className="h-3.5 w-3.5" />
                New Reconciliation
              </button>
            </div>
          </div>

          {exportNotice && (
            <p className="rounded-md bg-row-alt/60 px-3 py-2 text-[11px] text-text-secondary">{exportNotice}</p>
          )}

          <CrossSourceSummaryCards result={result} />
          <CrossSourceBreakdownList
            breakdown={result.crossSourceBreakdown}
            samples={result.sampleTransactions}
            totalPrimary={result.summary.totalPrimaryTransactions}
          />
          <SourceDrilldown result={result} />
        </div>
      )}
    </div>
  );
}
