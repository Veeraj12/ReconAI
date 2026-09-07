"use client";

import { usePagination } from "@/hooks/usePagination";
import { Pager } from "@/components/ui/Pager";
import type { ResolvedEntry } from "../resolveExceptions";

export function PatternTransactionsTable({ entries }: { entries: ResolvedEntry[] }) {
  const { pageRows, rangeLabel, canGoPrev, canGoNext, goToPrevPage, goToNextPage } =
    usePagination(entries);

  if (entries.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border-app px-3 py-4 text-center text-xs text-text-secondary">
        No underlying transactions could be resolved for this pattern.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-app">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border-app bg-row-alt text-left uppercase tracking-wide text-text-secondary">
            <th className="px-3 py-2 font-bold">Date</th>
            <th className="px-3 py-2 font-bold">Bank Row</th>
            <th className="px-3 py-2 font-bold">Tally Row</th>
            <th className="px-3 py-2 font-bold">Reference</th>
            <th className="px-3 py-2 font-bold">Bank Amount</th>
            <th className="px-3 py-2 font-bold">Tally Amount</th>
            <th className="px-3 py-2 font-bold">Difference</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((entry) => (
            <tr
              key={entry.exceptionId}
              className="border-b border-border-app/60 odd:bg-transparent even:bg-row-alt/50 hover:bg-row-hover"
            >
              <td className="px-3 py-2 tabular-data text-text-secondary">{entry.date ?? "—"}</td>
              <td className="px-3 py-2 tabular-data text-text-secondary">{entry.bankRow ?? "—"}</td>
              <td className="px-3 py-2 tabular-data text-text-secondary">{entry.tallyRow ?? "—"}</td>
              <td className="px-3 py-2 font-medium text-text-primary">
                {entry.reference || "—"}
                {entry.groupSize ? (
                  <span className="ml-1.5 text-[10px] font-normal text-text-secondary">
                    (+{entry.groupSize} grouped)
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-2 tabular-data text-text-primary">{entry.bankAmount ?? "—"}</td>
              <td className="px-3 py-2 tabular-data text-text-primary">{entry.tallyAmount ?? "—"}</td>
              <td className="px-3 py-2 tabular-data font-bold text-danger">
                {entry.difference !== null ? entry.difference : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager
        rangeLabel={rangeLabel}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={goToPrevPage}
        onNext={goToNextPage}
      />
    </div>
  );
}
