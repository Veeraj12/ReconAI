"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ListOrdered } from "lucide-react";
import { useReconciliationContext } from "@/features/reconciliation/ReconciliationProvider";
import { buildExceptionResolver } from "@/features/analysis/resolveExceptions";
import { PatternTransactionsTable } from "@/features/analysis/components/PatternTransactionsTable";

export function ReferencedTransactions({ exceptionIds }: { exceptionIds: string[] }) {
  const { data } = useReconciliationContext();
  const [expanded, setExpanded] = useState(false);

  const entries = useMemo(() => {
    if (!data || !expanded) return [];
    return buildExceptionResolver(data).resolveIds(exceptionIds);
  }, [data, expanded, exceptionIds]);

  if (exceptionIds.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-border-app bg-bg-panel px-2.5 py-1.5 text-[11px] font-semibold text-text-secondary transition-all duration-150 hover:border-accent hover:text-accent-dark"
      >
        <ListOrdered className="h-3 w-3" />
        {expanded ? "Hide" : "View"} {exceptionIds.length.toLocaleString()} transaction
        {exceptionIds.length === 1 ? "" : "s"}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="mt-2 max-h-64 overflow-y-auto">
          <PatternTransactionsTable entries={entries} />
        </div>
      )}
    </div>
  );
}
